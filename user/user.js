const db = require("../config/db");
const Validator = require("../base/validation");
const base = require("../base/controller");
const Errors = require("../base/exceptionHandler");
const  handler = new Errors.ErrorHandler();
const bcrypt = require("bcrypt");
const jsonparser = require("body-parser").json();
//Get
const get =  (req, res)=>{
	const sql = "SELECT * FROM users;";
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
	try{
		if(base.noParam(req, "id")) throw new Errors.Errors.BadRequestError("User id has to be specified.");
		const sql = "SELECT * FROM users WHERE id=?;";

		db.query(sql,[ req.params.id], (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			if(result.length == 0) throw new Errors.Errors.NotFoundError("users", req.params.id);
			return res.send(result);
		});
	}catch(err){
		return handler.handleError(err, res);
	}
}
//POST
const create =(req, res)=>{
	try{
		const body = req.body;
		Validator.resetErrors();
		Validator.validateFirstname(body.firstname);
		Validator.validateLastname(body.lastname);
		Validator.validateEmail(body.email);
		Validator.validatePassword(body.password);
		Validator.validatePasswordAgain(body.passwordAgain);

		if(!body.idCity){
			Validator.result.errors.city = "City id has to be specified.";
		}
		if(body.password != body.passwordAgain){
			Validator.result.errors.passwordAgain = " Both passwords must match.";
		}

		if(Validator.result.invalid()) throw new Errors.Errors.UnprocessableEntityError(Validator.result.errors);
		db.query("SELECT * FROM cities WHERE id=?", body.idCity, async (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			if(result.length == 0)	 throw new Errors.Errors.UnprocessableEntityError({idCity: "There is no such city."});
			const roleId = 2;
			const sql = "INSERT INTO users(firstname, lastname, email, password, idRole, idCity) VALUES(?, ?, ?, ?, ?, ?);";
			const hash = await bcrypt.hash(body.password, 10);
			const values = [
				body.firstname,
				body.lastname,
				body.email,
				hash,
				roleId,
				Number(body.idCity)
			];
			db.query(sql, values, (err, result)=>{
				if(err) throw new Errors.Errors.InternalServerError();

				return res.sendStatus(201);
			})
		})
	}catch(err){
		return handler.handleError(err, res);
	}
}
//PATCH -- update later on
const update = (req, res)=>{
	try{
		const body = req.body;
		Validator.resetErrors();
		Validator.validateFirstname(body.firstname);
		Validator.validateLastname(body.lastname);
		Validator.validateEmail(body.email);
		Validator.validatePassword(body.password);
		Validator.validatePasswordAgain(body.passwordAgain);
		if(body.password != body.passwordAgain){
			Validator.result.errors.passwordAgain = " Both passwords must match.";
		}

		if(Validator.result.invalid()) throw new Errors.Errors.UnprocessableEntityError(Validator.result.errors);
		db.query("SELECT * FROM City WHERE id=?", body.idCity, (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			if(result.length == 0)	 throw new Errors.Errors.UnprocessableEntityError({idCity: "There is no such city."});
			const roleId = 2;
			const sql = "INSERT INTO users(firstname, lastname, email, password, idRole, idCity) VALUES(?, ?, ?, ?, ?, ?);";
			const hash = bcrypt.hash(body.password, 10);
			const values = [
				body.firstname,
				body.lastname,
				body.email,
				hash,
				roleId,
				body.idCity
			];
			db.query(sql, values, (err, result)=>{
				if(err) throw new Errors.Errors.InternalServerError();

				return res.sendStatus(201);
			})
		})
	}catch(err){
		return handler.handleError(err, res);
	}
}
// DELETE
const deleteRecord = (req, res)=>{
	try{
		if(base.noParam(req, "id"))throw new Errors.Errors.BadRequestError( "User id has to be specified.");
		const sql = "DELETE FROM users WHERE id =?" ;
		db.query(sql, req.params.id, (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.sendStatus(204);
		});
	}catch(error){
		return handler.handleError(error, res);
	}
}

const express = require("express");
const router = express.Router();

router.get("/", get);
router.get("/:id", getOne);
router.post("/", jsonparser, create);
router.put("/:id", jsonparser, update );
router.delete("/:id", deleteRecord);
module.exports  = router;
