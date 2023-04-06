require('dotenv').config();

const sql = require('sql-template-strings');
const db = require('./database');
const jwt = require('jsonwebtoken');

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

    socket.on('refreshCalendar', () => {
      socket.broadcast.to(groupId).emit('refreshCalendar');
    });

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
  io.use(async (socket, next) => {
    if (!socket.handshake.auth || !socket.handshake.auth.token) {
      return next(new Error('invalid token'));
    }
    const accessToken = socket.handshake.auth.token;
    if (accessToken) {
      const decodedUser = decodeToken(accessToken);

      if (decodedUser && decodedUser.id) {
        const userData = await getUserData(decodedUser.id);
        if (userData && userData.first_name && userData.last_name && userData.curr_group) {
          socket.username = decodedUser.id;
          socket.groupId = userData.curr_group;
          socket.first_name = userData.first_name;
          socket.last_name = userData.last_name;
        } else {
          return next(new Error('User not found'));
        }
      } else {
        return next(new Error('invalid token'));
      }
    }

    next();
  });

  return httpServer;
}

/**
 * Given user email, fetch user data from the database and return.
 */
async function getUserData(email) {
  const query = sql`SELECT * FROM Users
  WHERE Users.email = ${email};`;
  const [result] = await db.query(query);
  return result;
}

function decodeToken(token) {
  let decodedUser = null;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log('given token', token);
      console.log('token decoded error', err);
      return res.sendStatus(403);
    }
    decodedUser = user;
    return user;
  });

  return decodedUser;
}

module.exports.CreateWebSocketServer = CreateWebSocketServer;
