const express = require("express");
const app = express();
const db = require("./config/db");
const role = require("./role/index");
const user = require("./user/index");
const follower = require("./follower/index");
const request = require("./request/index");
const country = require("./country/index");
const city = require("./city/index");
const navlink = require("./navlink/index");
const auth = require("./auth/index");
const message = require("./message/index");
const cors = require("cors");
app.use(cors({
    origin: "http://localhost:3000"
}));

app.use("/roles", role.router);
app.use("/users", user.router);
app.use("/followers", follower.router);
app.use("/requests", request.router);
app.use("/countries", country.router);
app.use("/cities", city.router);
app.use("/navlinks", navlink.router);
app.use("/auth", auth.router);
app.use("/messages", message.router);

db.connect((err)=>{
	if(err) throw err;

	console.log("Database connected.");
	const port = 8888;
	app.listen(port, ()=>{
		console.log("Listening on localhost:" + port) ;
	})
})
