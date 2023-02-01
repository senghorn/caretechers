const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Healthcheck successful!");
});

// MAIN API ENDPOINTS
app.use("/notes", require("./routes/notes"));
app.use("/messages", require("./routes/messages"));
app.use("/tasks", require("./routes/tasks"));
app.use("/visits", require("./routes/visits"));
app.use("/user", require("./routes/user"));
app.use("/groups", require("./routes/groups"));
// ------------------

app.use((err, req, res, next) => {
  console.error({
    status: err.status || "",
    message: err.message || "",
    stack: err.stack || "",
  });
  res.status(err.status || 500).send(err.message || "");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// -------- Messaging Code ------------
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.on("connect", (socket) => {
  const groupName = socket.groupId;
  socket.join(groupName);

  console.log(socket.username, " just connected!");
  socket.on("chat", (messages) => {
    io.to(groupName).emit("message", messages);
    const message_data = messages[0];

    // TODO: Save the message into the database
    // Construct a message json referencing properties from the message table
    const message_object = {
      date_time: message_data.createdAt,
      content: message_data.text,
      sender: message_data.user._id,
      group_id: message_data.user.groupId
    };
    
  });

  socket.on("disconnect", (reason) => {
    socket.leave(groupName);
    socket.disconnect(true);
    console.log("user disconnected", socket.rooms);
  });

  socket.on("disconnecting", (reason) => {
    console.log("user disconnecting", reason);
  });
});

httpServer.listen(3001, () =>
  console.log("Chat server listening on port 3001")
);

// Register middleware function that gets called every incoming socket
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  socket.groupId = socket.handshake.query.groupId;
  next();
});

// ---------------------------------------