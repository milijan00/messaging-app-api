const db = require("../config/db");
const base = require("../base/controller");
const Errors = require("../base/exceptionHandler");
const  handler = new Errors.ErrorHandler();
const jsonparser = require("body-parser").json();
const Validator = require("../base/validation");
const auth_middleware = require("../middlewares/auth-middleware");

const get = (req, res)=>{
	try{
		const sql = "SELECT * FROM navlinks;";
		db.query(sql, (err, result)=>{
			if(err )throw new Errors.Errors.InternalServerError();
			return res.send(result);
		})
	}catch(err){
		return handler.handleError(err, res);
	}
}

const getOne = (req, res)=>{
	try{
		if(base.noParam(req, "id")) throw new Errors.Errors.BadRequestError("Navigation link's id is required.");
		const sql = "SELECT * FROM navlinks WHERE id=?;";
		db.query(sql, req.params.id, (err, result)=>{
			if(err )throw new Errors.Errors.InternalServerError();
			if(result.length == 0) throw new Errors.Errors.NotFoundError("navlink", req.params.id);
			return res.send(result);
		})
	}catch(err){
		return handler.handleError(err, res);
	}
}

const create = (req, res)=>{

	try{
		if(base.noParam(req, "id")) throw new Errors.Errors.BadRequestError("Navigation link's id is required.");
		if(!req.body || req.body.name || req.body.path) throw new Errors.Errors.UnprocessableEntityError({message : "You need to specify nav. link's name and path."});
		Validator.resetErrors();
		const name = req.body.name;
		const path = req.body.path;
		Validator.validateName(name);
		Validator.validatePath(path);
		if(Validator.result.invalid()) throw new Errors.Errors.UnprocessableEntityError(Validator.result.errors);

		const sql = "INSERT INTO navlinks(name, path) VALUES(?, ?);";
		db.query(sql, [name, path], (err)=>{
			if(err )throw new Errors.Errors.InternalServerError();
			return res.sendStatus(201);
		})
	}catch(err){
		return handler.handleError(err, res);
	}

}

const update = (req, res)=>{

	try{
		if(base.noParam(req, "id")) throw new Errors.Errors.BadRequestError("Navigation link's id is required.");
		if(!req.body || req.body.name || req.body.path) throw new Errors.Errors.UnprocessableEntityError({message : "You need to specify nav. link's name and path."});
		Validator.resetErrors();
		const name = req.body.name;
		const path = req.body.path;
		Validator.validateName(name);
		Validator.validatePath(path);
		if(Validator.result.invalid()) throw new Errors.Errors.UnprocessableEntityError(Validator.result.errors);

		const sql = "UPDATE navlinks SET name =?, path=? WHERE id=?;";
		db.query(sql, [name, path, req.params.id], (err)=>{
			if(err )throw new Errors.Errors.InternalServerError();
			return res.sendStatus(204);
		})
	}catch(err){
		return handler.handleError(err, res);
	}
}

const deleteRecord = (req, res)=>{

	try{
		if(base.noParam(req, "id")) throw new Errors.Errors.BadRequestError("Navigation link's id is required.");
		const sql = "DELETE  * FROM navlinks WHERE id=?;";
		db.query(sql, req.params.id, (err )=>{
			if(err )throw new Errors.Errors.InternalServerError();
			return res.sendStatus(204);
		})
	}catch(err){
		return handler.handleError(err, res);
	}
}

const express = require("express");
const router = express.Router();
router.get("/", auth_middleware, get);
router.get("/:id", auth_middleware, getOne);
router.post("/", auth_middleware, jsonparser, create);
router.put("/:id", auth_middleware, jsonparser, update);
router.delete("/:id", auth_middleware, deleteRecord);
module.exports = router;

