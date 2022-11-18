const db = require("../config/db");
const Validator = require("../base/validation");
const base = require("../base/controller");
const Errors = require("../base/exceptionHandler");
//GET
const  handler = new Errors.ErrorHandler();
const get = (req, res)=>{
	const sql = "SELECT * FROM roles;";
	db.query(sql, (err, result)=>{
		try{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.send(result);
		}catch(err){
			return handler.handleError(err, res);
		}
	});
};
//GET
const getOne = (req, res)=>{
	if(base.noParam(req, "id")) return res.status(400).json({message: "Role id has to be specified."});
	
	const sql = "SELECT * FROM roles where id=?;";
	db.query(sql, [req.params.id], (err, result)=>{
		try{
			if(err)throw new Errors.Errors.InternalServerError();
			if(result.length == 0) throw new Errors.Errors.NotFoundError("roles", req.params.id);
			return res.send(result);
		}catch(err){
			return handler.handleError(err, res);
		}
	});
};

// POST
const create = (req, res)=>{
	try{
		const body = req.body;
		if(!body.name ) throw new Errors.Errors.UnprocessableEntityError({message : "Role name has to be specified."});
		Validator.validateName(body.name);
		if(Validator.result.invalid()){ 
			throw new Errors.Errors.UnprocessableEntityError(Validator.result.errors);
		}
		const sql = "INSERT INTO roles(name) VALUES(?);";

		db.query(sql, [body.name], (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.sendStatus(201);
		});
	}catch(err){
		return handler.handleError(err, res);
	}
};
// PUT
const update = (req, res)=>{
	try{
		if(base.noParam(req, "id")) throw new Errors.Errors.UnprocessableEntityError({message : "Role id has to be specified."});
		const body = req.body;
		if(!body.name) throw new Errors.Errors.UnprocessableEntityError({message : "Role id has to be specified."});

		Validator.validateName(body.name);

		if(Validator.result.invalid()){
			return res.status(422).json(Validator.result.errors);
		}
		const values = [body.name, req.params.id];
		const sql = "UPDATE roles SET name=? WHERE id=?;";
		db.query(sql, values, (err, result)=>{
			if(err)throw new Errors.Errors.InternalServerError();
			return res.sendStatus(204);
		});
	}catch(err){
		return handler.handleError(err, res);
	}
};

//DELETE
const deleteRecord = (req, res)=>{
	try{
		if(base.noParam(req, "id")) throw new Errors.Errors.UnprocessableEntityError({message : "Role id has to be specified."});
		const sql = "DELETE FROM roles WHERE id=?";
		db.query(sql, req.params.id, (err, result)=>{
			if(err)throw new Errors.Errors.InternalServerError();
			return res.sendStatus(204);
		});
	}catch(err){
		return handler.handleError(err, res);
	}
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