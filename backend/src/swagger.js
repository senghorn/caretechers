const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Caretechers CareCoord API',
    description: 'The API used by the CareCoord App',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/graphs.js', './routes/groups.js', './routes/messages.js', 
'./routes/notes.js', './routes/tasks.js', './routes/user.js', './routes/visits.js', './routes/measurements.js'];

// Theoretically this should allow the documentation.
   swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./app.js')
})

// swaggerAutogen(outputFile, endpointsFiles)