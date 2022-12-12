// get the client
const mysql = require('mysql2/promise');

module.exports.query = async (query) => {
// create the connection to database
	const connection = await mysql.createConnection({
		host: 'caretechers-db.cyvcqcx1nbv9.us-east-1.rds.amazonaws.com',
		user: 'admin',
		database: 'carecoord',
		password: '4$CareTechers'
	});

	const [result]= await connection.execute(query.sql, query.values);
	connection.end();
	return result;
}