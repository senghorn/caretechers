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
const endpointsFiles = ['./src/routes/graphs.js', './src/routes/groups.js', './src/routes/messages.js', 
'./src/routes/notes.js', './src/routes/tasks.js', './src/routes/user.js', './src/routes/visits.js', './src/routes/measurements.js'];

// Theoretically this should allow the documentation.
   swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./app.js')
})

// swaggerAutogen(outputFile, endpointsFiles)