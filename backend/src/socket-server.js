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
    const groupId = socket.groupId;
    socket.join(groupId);

    socket.on('chat', async (messages) => {
      var messageData = messages[0];
      try {
        const date = new Date();
        const query = sql`INSERT INTO Messages VALUES(NULL, ${socket.username}, ${date}, ${messageData.text}, ${groupId}, 0)`;
        const result = await db.query(query);
        messageData._id = result.insertId;
        io.to(groupId).emit('message', messageData);
        sendNotificationsToGroup(
          groupId,
          {
            title: `${socket.first_name} ${socket.last_name}`,
            body: messageData.text,
            data: { url: 'Messages' },
          },
          [socket.username]
        );
      } catch (err) {
        console.log(err);
      }

    });

    socket.on('disconnect', (reason) => {
      socket.leave(groupId);
      socket.disconnect(true);
      console.log('user disconnected', socket.rooms);
    });

    socket.on('disconnecting', (reason) => {
      console.log('user disconnecting', reason);
    });
  });

  // Register middleware function that gets called every incoming socket
  io.use((socket, next) => {
    if (!socket.handshake.auth || !socket.handshake.auth.token) {
      return next(new Error('invalid token'));
    }
    const accessToken = socket.handshake.auth.token;
    if (accessToken) {
      const decodedUser = decodeToken(accessToken);
      if (decodedUser && decodedUser.id && decodedUser.curr_group) {
        socket.username = decodedUser.id;
        socket.groupId = decodedUser.curr_group;
        socket.first_name = decodedUser.first_name;
        socket.last_name = decodedUser.last_name;
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
      console.log('given token', user);
      console.log('token decoded error', err)
      return res.sendStatus(403)
    }
    decodedUser = user;
    return user;
  })

  return decodedUser;
}

module.exports.CreateWebSocketServer = CreateWebSocketServer;
