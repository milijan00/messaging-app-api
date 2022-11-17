const db = require("../config/db");
const Validator = require("../base/validation");
const base = require("../base/controller");
//GET
const get = (req, res)=>{
	const sql = "SELECT * FROM roles;";
	db.query(sql, (err, result)=>{
		if(err) throw err;
		return res.send(result);
	});
};
//GET
const getOne = (req, res)=>{
	if(base.noParam(req, "id")) return res.status(400).json({message: "Role id has to be specified."});
	
	const sql = "SELECT * FROM roles where id=?;";
	db.query(sql, [req.params.id], (err, result)=>{
		if(err)throw err;
		if(result.length == 0) return res.sendStatus(404);
		return res.send(result);
	});
};

// POST
const create = (req, res)=>{
	const body = req.body;
	if(!body.name ) return res.status(422).json({message : "Role name has to be specified."});
	Validator.validateName(body.name);
	if(Validator.result.invalid()){ // false
		return res.status(422).json(Validator.result.errors);
	}
	const sql = "INSERT INTO roles(name) VALUES(?);";

	db.query(sql, [body.name], (err, result)=>{
		if(err) throw err;
		return res.sendStatus(201);
	});
};
// PUT
const update = (req, res)=>{
	if(base.noParam(req, "id")) return res.status(422).json({message : "Role id has to be specified."});
	const body = req.body;
	if(!body.name) return res.status(422).json({message : "Role name has to be specified."});

	Validator.validateName(body.name);

	if(Validator.result.invalid()){
		return res.status(422).json(Validator.result.errors);
	}
	const values = [body.name, req.params.id];
	const sql = "UPDATE roles SET name=? WHERE id=?;";
	db.query(sql, values, (err, result)=>{
		if(err)throw err;
		return res.sendStatus(204);
	});
};

//DELETE
const deleteRecord = (req, res)=>{
	if(base.noParam(req, "id")) return res.status(422).json({message : "Role id has to be specified."});
	const sql = "DELETE FROM roles WHERE id=?";
	db.query(sql, req.params.id, (err, result)=>{
		if(err)throw err;
		return res.sendStatus(204);
	});
};

const express = require("express");
const router = express.Router();
const jsonparser = require("body-parser").json();

router.get("/", get);
router.get("/:id", getOne);
router.post("/", jsonparser, create);
router.put("/:id", jsonparser,update);
router.delete("/:id", deleteRecord);

module.exports = router;