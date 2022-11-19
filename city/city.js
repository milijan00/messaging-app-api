const db = require("../config/db");
const base = require("../base/controller");
const Errors = require("../base/exceptionHandler");
const  handler = new Errors.ErrorHandler();
const jsonparser = require("body-parser").json();
const Validator = require("../base/validation");

const get = (req, res)=>{
	try{
		if(base.noParam(req, "idCountry")) throw new Errors.Errors.BadRequestError("Country id has to be specified.");
		const sql = "SELECT ci.name, ci.id, co.id as countryId,  FROM cities AS ci  INNER JOIN countries AS co ON ci.idCountry=co.id WHERE co.id=?;";
		db.query(sql, [req.params.idCountry], (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.send(result);
		});
	}catch(err){
		return handler.handleError(err, res);
	}
};

const getOne = (req, res)=>{
	try{
		if(base.noParam(req, "id")) throw new Errors.Errors.BadRequestError("City id has to be specified.");
		const sql = "SELECT ci.name, ci.id, co.id as countryId,  FROM cities AS ci  INNER JOIN countries AS co ON ci.idCountry=co.id WHERE ci.id=?;";
		db.query(sql, [req.params.id], (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.send(result);
		});
	}catch(err){
		return handler.handleError(err, res);
	}
};

const create = (req, res)=>{
	try{
		if(!req.body || req.body.name || req.body.idCountry) throw new Errors.Errors.UnprocessableEntityError({name : "City name is required."});
		const name =  req.body.name;
		const idCountry = req.body.idCountry;
		Validator.resetErrors();
		Validator.validateName(name);
		db.query("SELECT * FROM countries WHERE id=?", idCountry, (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();

			if(result.length == 0) throw new Errors.Errors.UnprocessableEntityError({idCountry: "There is no given country."});
			const  sql = "INSERT INTO cities(name, idCountry) VALUES(?, ?);";
			db.query(sql, [name, idCountry], (err)=>{
				if(err) throw new Errors.Errors.InternalServerError();
				return res.sendStatus(201);
			});
		});
	}catch(err){
		return handler.handleError(err, res);
	}
};

// PUT
const update = (req, res)=>{
	try{
		if(base.noParam(req, "id")) throw new Errors.Errors.BadRequestError("City id has to be specified.");
		if(!req.body || req.body.name || req.body.idCountry) throw new Errors.Errors.UnprocessableEntityError({name : "City name is required."});
		const name =  req.body.name;
		const idCountry = req.body.idCountry;
		Validator.resetErrors();
		Validator.validateName(name);
		db.query("SELECT * FROM countries WHERE id=?", idCountry, (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			const sql =  "UPDATE cities SET name=?, idCountry=? WHERE id=?";
			db.query(sql, [name, idCountry, req.params.id], (err)=>{
				if(err) throw new Errors.Errors.InternalServerError();
				return res.sendStatus(204);
			});
		});
	}catch(err){
		return handler.handleError(err, res);
	}
};

const deleteRecord = (req, res)=>{
	try{
		if(base.noParam(req, "id")) throw new Errors.Errors.BadRequestError("City id has to be specified.");
		const sql =  "DELETE FROM cities WHERE id=?";
		db.query(sql, [req.params.id], (err)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.sendStatus(204);
		});
	}catch(err){
		return handler.handleError(err, res);
	}
};


const express = require("express");
const router = express.Router();
router.get("/:idCountry", get);
router.get("/:id", getOne);
router.post("/", jsonparser, create);
router.put("/:id", jsonparser, update);
router.delete("/:id", deleteRecord);
module.exports = router;