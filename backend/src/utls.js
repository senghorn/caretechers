module.exports.newError = (message, status) => {
	let error = new Error(message);
	error.status = status;
	return error;
}

module.exports.getUTCDateTime = () => {
	const date = new Date()
	return date.getUTCFullYear() + '-' +
			('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
			('00' + date.getUTCDate()).slice(-2) + ' ' +
			('00' + date.getUTCHours()).slice(-2) + ':' +
			('00' + date.getUTCMinutes()).slice(-2) + ':' +
			('00' + date.getUTCSeconds()).slice(-2);
}
