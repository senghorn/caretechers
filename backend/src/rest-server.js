const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
//const swaggerFile = require('./swagger-output.json');
const bodyParser = require('body-parser');

function CreateRESTServer() {
  const app = express();

  app.use(bodyParser.json());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).send('Healthcheck very very very successful');
  });

  // MAIN API ENDPOINTS
  app.use('/notes', require('./routes/notes'));
  app.use('/messages', require('./routes/messages'));
  app.use('/tasks', require('./routes/tasks'));
  app.use('/visits', require('./routes/visits'));
  app.use('/user', require('./routes/user'));
  app.use('/groups', require('./routes/groups'));
  app.use('/graphs', require('./routes/graphs'));
  app.use('/measurements', require('./routes/measurements'));

  // API AUTO GENERATION
  //app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  // ------------------

  // API AUTO GENERATION PT 2
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Caretechers CareCoord API',
        version: '1.0.0',
        description: 'The API used by the CareCoord App',
      },
    },
    apis: ['./src/routes/*.js'],
  };

  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  app.use((err, req, res, next) => {
    console.error({
      status: err.status || '',
      message: err.message || '',
      stack: err.stack || '',
    });
    res.status(err.status || 500).send(err.message || '');
  });

  return app;
}

module.exports.CreateRESTServer = CreateRESTServer;
