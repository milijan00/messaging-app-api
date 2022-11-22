const db = require("../config/db");
const base = require("../base/controller");
const Errors = require("../base/exceptionHandler");
const  handler = new Errors.ErrorHandler();
const auth_middleware = require("../middlewares/auth-middleware");
const getRequests = (req, res)=>{
	try{
		if(base.noParam(req, "id")) throw new Errors.Errors.BadRequestError({id : "User id has to be specified."});

		const sql = `SELECT * FROM users INNER JOIN requests ON users.id=requests.idUser WHERE idFollower=?`;
		db.query(sql, req.params.id, (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.send(result);
		})
	}catch(err){
		return handler.handleError(err, res);
	}
}

const sendRequest = (req, res)=>{
	try{
		if(base.noParam(req, "idUser")) throw new Errors.Errors.UnprocessableEntityError({id : "User's id has to be specified."});
		if(base.noParam(req, "idFollower")) throw new Errors.Errors.UnprocessableEntityError({id : "Follower's id has to be specified."});
		const sql = "INSERT INTO requests(idUser, idFollower) VALUES(?, ?);";
		db.query(sql, [req.params.idUser, req.params.idFollower], (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.sendStatus(201);
		})
	}catch(err){
		return handler.handleError(err, res);
	}
};

// PUT
//http://localhost:3000/requests/1/1/true -> accept request
//http://localhost:3000/requests/1/1/ -> reject request
const update = (req, res)=>{
	try{
		let outcome = false;
		if(base.noParam(req, "idUser")) throw new Errors.Errors.UnprocessableEntityError({id : "User's id has to be specified."});
		if(base.noParam(req, "idFollower")) throw new Errors.Errors.UnprocessableEntityError({id : "Follower's id has to be specified."});
		if(req.params.outcome) outcome = true;
		const sql = "UPDATE requests SET outcome=? WHERE idUser=? AND idFollower=?;";
		db.query(sql, [outcome, req.params.idUser, req.params.idFollower], (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.sendStatus(204);
		});
	}catch(err){
		return handler.handleError(err, res);
	}
};

const deleteRequest = (req, res)=>{
	try{
		if(base.noParam(req, "idUser")) throw new Errors.Errors.BadRequestError({id : "User's id has to be specified."});
		if(base.noParam(req, "idFollower")) throw new Errors.Errors.BadRequestError({id : "Follower's id has to be specified."});
		const sql = "DELETE FROM requests WHERE idUser=? AND idFollower=?;";
		db.query(sql, [req.params.idUser, req.params.idFollower], (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.sendStatus(204);
		})
	}catch(err){
		return handler.handleError(err, res);
	}
};

const express = require("express");
const router = express.Router();
router.get("/:id", auth_middleware, getRequests);
router.post("/:idUser/:idFollower", auth_middleware, sendRequest);
router.delete("/:idUser/:idFollower", auth_middleware, deleteRequest);
router.put("/:idUser/:idFollower/:outcome?", auth_middleware, update);
module.exports = router;
