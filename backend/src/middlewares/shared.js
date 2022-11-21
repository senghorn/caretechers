module.exports.sendResult = (req, res) => {
	return res.status(200).send(req.result);
}