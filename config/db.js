const mysql = require("mysql");

const db = mysql.createConnection({
	host: "localhost",
	user : "root",
	password : "",
	database: "messageme"
});

module.exports = db;