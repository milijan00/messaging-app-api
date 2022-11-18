const express = require("express");
const app = express();
const db = require("./config/db");
const role = require("./role/index");
const user = require("./user/index");
const follower = require("./follower/index");


app.use("/roles", role.router);
app.use("/users", user.router);
app.use("/followers", follower.router);

db.connect((err)=>{
	if(err) throw err;

	console.log("Database connected.");
	const port = 3000;
	app.listen(port, ()=>{
		console.log("Listening on localhost:" + port) ;
	})
})