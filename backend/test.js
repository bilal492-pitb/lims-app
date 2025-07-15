const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'lims_db'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
  
  // Test query
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) throw err;
    console.log('The solution is: ', results[0].solution);
  });
});
