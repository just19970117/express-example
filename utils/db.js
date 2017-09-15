const mysql = require("mysql2");
const env = require("dotenv").config();

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});



connection.execute("SELECT id from users",function(err,results,fields){
    if(err){
    console.log(err);
    }
    console.log(results);
});
module.exports = connection;
