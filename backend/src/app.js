const express = require("express");

const app = express();
const port = 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger-output.json");
const sql = require("sql-template-strings");
const db = require("./database");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Healthcheck very very very successful");
});

// MAIN API ENDPOINTS
app.use("/notes", require("./routes/notes"));
app.use("/messages", require("./routes/messages"));
app.use("/tasks", require("./routes/tasks"));
app.use("/visits", require("./routes/visits"));
app.use("/user", require("./routes/user"));
app.use("/groups", require("./routes/groups"));
app.use("/graphs", require("./routes/graphs"));

// API AUTO GENERATION
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
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
  socket.on("chat", async (messages) => {
    io.to(groupName).emit("message", messages);
    const messageData = messages[0];

    const query = sql`INSERT INTO Messages VALUES(${messageData.user._id}, ${messageData.createdAt}, ${messageData.text}, ${messageData.user.groupId})`;
    await db.query(query);
  
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
