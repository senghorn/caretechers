const express = require('express')

const notes = require('./routes/notes');

const app = express()
const port = 3000

app.get('/', (req, res) => {
	res.status(200).send('Healthcheck successful!')
})

// MAIN API ENDPOINTS
app.use('/notes', notes);

app.use((err, req, res, next) => {
	console.error({
		status: err.status,
		message: err.status,
		stack: err.stack
	});
	res.status(err.status).send(err.message);
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
