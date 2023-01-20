const express = require('express')

const app = express()
const port = 3000

// -------- Messaging Code ------------
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connect", (socket) => {
	console.log("client connected!", socket);
	socket.on("chat", (message) => {
		console.log(message);
	});
});



httpServer.listen(3001, () => console.log("Chat server listening on port 3001"));

// Register middleware function that gets called every incoming socket
io.use((socket, next) => {
	const username = socket.handshake.auth.username;
	if (!username) {
		return next(new Error("invalid username"));
	}
	socket.username = username;
	next();
});

// -------- Messaging Code ------------



app.use(express.json());

app.get('/', (req, res) => {
	res.status(200).send('Healthcheck successful!')
})

// MAIN API ENDPOINTS
app.use('/notes', require('./routes/notes'));
app.use('/messages', require('./routes/messages'));
app.use('/tasks', require('./routes/tasks'));
// ------------------

app.use((err, req, res, next) => {
	console.error({
		status: err.status || '',
		message: err.message || '',
		stack: err.stack || ''
	});
	res.status(err.status || 500).send(err.message || '');
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
