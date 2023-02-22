// get the client
const mysql = require('mysql2/promise');

module.exports.query = async (query) => {
  // create the connection to database
  const connection = await mysql.createConnection({
    host: 'carecoord.cbsd2vs340w3.us-west-2.rds.amazonaws.com',
    user: 'admin',
    database: 'carecoord',
    password: 'Capstone1234!',
    multipleStatements: true,
    dateStrings: true,
  });

  const [result] = await connection.execute(query.sql, query.values);
  connection.end();
  return result;
};
