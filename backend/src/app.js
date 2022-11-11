const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send('Something broke!')
})
