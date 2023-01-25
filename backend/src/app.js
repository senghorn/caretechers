const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Healthcheck successful!');
});

// MAIN API ENDPOINTS
app.use('/notes', require('./routes/notes'));
app.use('/messages', require('./routes/messages'));
app.use('/tasks', require('./routes/tasks'));
app.use('/visits', require('./routes/visits'));
// ------------------

app.use((err, req, res, next) => {
  console.error({
    status: err.status || '',
    message: err.message || '',
    stack: err.stack || '',
  });
  res.status(err.status || 500).send(err.message || '');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
