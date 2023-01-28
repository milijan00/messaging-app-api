const db = require("../config/db");
const base = require("../base/controller");
const Errors = require("../base/exceptionHandler");
const  handler = new Errors.ErrorHandler();
const auth_middleware = require("../middlewares/auth-middleware");

const getFollowers = (req, res)=>{
	try{
		if(base.noParam(req, "id")) throw new Errors.Errors.BadRequestError({id : "User id has to be specified."});

		const sql = `SELECT users.firstname, users.lastname, users.id FROM users INNER JOIN followers ON users.id=followers.idFollower WHERE idUser=?`;
		db.query(sql, req.params.id, (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.send(result);
		})
	}catch(err){
		return handler.handleError(err, res);
	}
}

const follow = (req, res)=>{
	try{
		if(base.noParam(req, "idUser")) throw new Errors.Errors.UnprocessableEntityError({id : "User's id has to be specified."});
		if(base.noParam(req, "idFollower")) throw new Errors.Errors.UnprocessableEntityError({id : "Follower's id has to be specified."});
		const sql = "INSERT INTO followers(idUser, idFollower) VALUES(?, ?);";
		db.query(sql, [req.params.idUser, req.params.idFollower], (err, result)=>{
			if(err) throw new Errors.Errors.InternalServerError();
			return res.sendStatus(201);
		})
	}catch(err){
		return handler.handleError(err, res);
	}
};
const unfollow = (req, res)=>{
	try{
		if(base.noParam(req, "idUser")) throw new Errors.Errors.BadRequestError({id : "User's id has to be specified."});
		if(base.noParam(req, "idFollower")) throw new Errors.Errors.BadRequestError({id : "Follower's id has to be specified."});
		const sql = "DELETE FROM followers WHERE idUser=? AND idFollower=?;";
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
router.get("/:id", auth_middleware, getFollowers);
router.post("/:idUser/:idFollower", auth_middleware, follow);
router.delete("/:idUser/:idFollower", auth_middleware, unfollow);
module.exports = router;
