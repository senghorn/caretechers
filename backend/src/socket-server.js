require('dotenv').config()

const sql = require('sql-template-strings');
const db = require('./database');
const jwt = require('jsonwebtoken')

const { sendNotificationsToGroup } = require('./notifications/sendNotifications');

function CreateWebSocketServer(app) {
  // -------- Messaging Code ------------
  const { createServer } = require('http');
  const { Server } = require('socket.io');

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    /* options */
  });

  io.on('connect', (socket) => {
    console.log(`User ${socket.username} connected!`);
    const groupName = socket.groupId;
    socket.join(groupName);
    socket.on('chat', async (messages) => {

      var messageData = messages[0];
      const query = sql`INSERT INTO Messages VALUES(NULL, ${messageData.user._id}, ${messageData.createdAt}, ${messageData.text}, ${messageData.user.groupId}, 0)`;
      const result = await db.query(query);
      messageData._id = result.insertId;
      io.to(groupName).emit('message', messageData);
      sendNotificationsToGroup(
        messageData.user.groupId,
        {
          title: `${messageData.user.first_name} ${messageData.user.last_name}`,
          body: messageData.text,
          data: { url: 'Messages' },
        },
        [messageData.user._id]
      );
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
    const accessToken = socket.handshake.auth.token;
    if (accessToken) {
      const decodedUser = decodeToken(accessToken);
      if (decodedUser && decodedUser.id && decodedUser.curr_group) {
        socket.username = decodedUser.id;
        socket.groupId = decodedUser.curr_group;
      } else {
        return next(new Error('invalid token'));
      }
    }
    next();
  });

  return httpServer;
}

function decodeToken(token) {
  let decodedUser = null;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log('token decoded error', err)
      return res.sendStatus(403)
    }
    decodedUser = user;
    return user;
  })

  return decodedUser;
}

module.exports.CreateWebSocketServer = CreateWebSocketServer;
