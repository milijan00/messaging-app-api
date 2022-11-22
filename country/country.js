const db = require("../config/db");
const Validator = require("../base/validation");
const base = require("../base/controller");
const Errors = require("../base/exceptionHandler");
const  handler = new Errors.ErrorHandler();
const jsonparser = require("body-parser").json();


const get = (req, res)=>{
	try{
		const sql = "SELECT * FROM countries;";
		db.query(sql, (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.send(result);
		})
	}catch(err){
		return handler.handleError(err, res);
	}
};

const getOne = (req, res)=>{
	try{
		if(base.noParam(req, "id")) throw new Errors.Errors.BadRequestError( "Country id has to be specified.");
		const sql = "SELECT * FROM countries WHERE id=?";
		db.query(sql, [req.params.id], (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();

			if(result.length == 0) throw new Errors.Errors.NotFoundError("country", req.params.id);

			return res.send(result);
		});
	}catch(err){
		return handler.handleError(err ,res);
	}
};

const create = (req, res)=>{
	try{
		if(!req.body || !req.body.name) throw new Errors.Errors.UnprocessableEntityError({name : "Country name has to be specified."});
		const name = req.body.name;
		Validator.resetErrors();
		Validator.validateName(name);
		if(Validator.result.invalid()) throw new Errors.Errors.UnprocessableEntityError(Validator.result.errors);

		const sql  ="INSERT INTO countries(name) VALUES(?);";
		db.query(sql, [name], (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.sendStatus(201);
		});
	}catch(err){
		return handler.handleError(err, res);
	}
};

const update = (req, res)=>{
	try{
		if(base.noParam(req, "id")) throw new Errors.Errors.BadRequestError( "Country's id must be specified.");
		if(!req.body || !req.body.name) throw new Errors.Errors.UnprocessableEntityError({name : "Country name has to be specified."});
		const name = req.body.name;
		Validator.resetErrors();
		Validator.validateName(name);

		if(Validator.result.invalid()) throw new Errors.Errors.UnprocessableEntityError(Validator.result.errors);

		const sql = "UPDATE countries SET name=? WHERE id=?;";
		db.query(sql, [name, req.params.id], (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.sendStatus(204);
		});
	}catch(err){
		return handler.handleError(err, res);
	}
};

const deleteRecord = (req, res)=>{
	try{
		if(base.noParam(req, "id")) throw new Errors.Errors.BadRequestError( "Country's id must be specified.");


		const sql = "DELETE FROM  countries  WHERE id=?;";
		db.query(sql, [req.params.id], (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.sendStatus(204);
		});
	}catch(err){
		return handler.handleError(err, res);
	}
};

const express = require("express");
const router = express.Router();
router.get("/", get);
router.get("/:id", getOne);
router.post("/", jsonparser, create);
router.put("/:id", jsonparser, update);
router.delete(":id", deleteRecord);
module.exports = router;
