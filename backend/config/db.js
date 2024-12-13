const mysql=require('mysql2');

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root@1234',
    database:'student'
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL Database!");
  });
  
  module.exports = db;
