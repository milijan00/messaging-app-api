const express = require("express");
const app = express();
const db = require("./config/db");
const role = require("./role/index");

app.use("/roles", role.router);

db.connect((err)=>{
	if(err) throw err;

	console.log("Database connected.");
	const port = 3000;
	app.listen(port, ()=>{
		console.log("Listening on localhost:" + port) ;
	})
})