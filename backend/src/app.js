const rest_server = require('./rest-server');
const web_socket_server = require('./socket-server');
const port = 3000;

const app = rest_server.CreateRESTServer();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const httpServer = web_socket_server.CreateWebSocketServer(app);
httpServer.listen(3001, () =>
  console.log('Chat server listening on port 3001')
);
