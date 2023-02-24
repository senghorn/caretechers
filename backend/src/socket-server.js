const sql = require('sql-template-strings');
const db = require('./database');

function CreateWebSocketServer(app) {
  // -------- Messaging Code ------------
  const { createServer } = require('http');
  const { Server } = require('socket.io');

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    /* options */
  });

  io.on('connect', (socket) => {
    const groupName = socket.groupId;
    socket.join(groupName);

    console.log(socket.username, ' just connected!');
    socket.on('chat', async (messages) => {
      io.to(groupName).emit('message', messages);
      const messageData = messages[0];

      const query = sql`INSERT INTO Messages VALUES(${messageData.user._id}, ${messageData.createdAt}, ${messageData.text}, ${messageData.user.groupId})`;
      await db.query(query);
    });

    socket.on('disconnect', (reason) => {
      socket.leave(groupName);
      socket.disconnect(true);
      console.log('user disconnected', socket.rooms);
    });

    socket.on('disconnecting', (reason) => {
      console.log('user disconnecting', reason);
    });
  });

  // Register middleware function that gets called every incoming socket
  io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error('invalid username'));
    }
    socket.username = username;
    socket.groupId = socket.handshake.query.groupId;
    next();
  });

  return httpServer;
}

module.exports.CreateWebSocketServer = CreateWebSocketServer;