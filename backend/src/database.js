// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'caretechers-db.cyvcqcx1nbv9.us-east-1.rds.amazonaws.com',
  user: 'admin',
  database: 'cctest',
  password: ''
});

// execute will internally call prepare and query
connection.execute(
  'SELECT * FROM `User`',
  [],
  function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available

  }
);