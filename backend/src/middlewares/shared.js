module.exports.sendResult = (req, res) => {
	return res.status(200).send(req.result);
}

module.exports.sendNoResult = (req, res) => {
	return res.status(204).send();
}