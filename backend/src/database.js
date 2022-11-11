// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: '192.168.0.58',
  user: 'root',
  database: 'test',
  password: 'password'
});

// execute will internally call prepare and query
connection.execute(
  'SELECT * FROM `user`',
  [],
  function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available

  }
);