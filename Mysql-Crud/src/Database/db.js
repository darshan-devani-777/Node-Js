const mysql = require('mysql2'); 
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,    
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error In Database:', err);
  } else {
    console.log('MYSQL Connected...✅');
  }
});

module.exports = db; 
