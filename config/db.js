var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "passport_js"
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to DB');
});

module.exports = connection;