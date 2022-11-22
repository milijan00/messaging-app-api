const db = require("../config/db");
const Validator = require("../base/validation");
const base = require("../base/controller");
const Errors = require("../base/exceptionHandler");
const  handler = new Errors.ErrorHandler();
const bcrypt = require("bcrypt");
const jsonparser = require("body-parser").json();


const get = (req, res)=>{
    try{
        if(base.noParam(req, "idSender")) throw new Errors.Errors.BadRequestError("Sender's id must be specified.");
        if(base.noParam(req, "idReceiver")) throw new Errors.Errors.BadRequestError("Receiver's id must be specified.");
        const idSender = req.params.idSender;
        const idReceiver = req.params.idReceiver;

        const sql = "SELECT * FROM messages WHERE (senderId=? AND receiverId=?) OR (senderId=? AND receiverId=?);";
        db.query(sql, [idSender,idReceiver,idReceiver, idSender], (err, result)=>{
            if(err) throw new Errors.Errors.InternalServerError();
            return res.send(result);
        });
    }
    catch(err){
        return handler.handleError(err, res);
    }
};

const create = (req, res) =>{
    try{
        if(!req.body || !req.body.content || !req.body.idSender || !req.body.idReceiver) throw new Errors.Errors.UnprocessableEntity({message : "The message body, sender id and receiver id  are required."});
        const idSender = req.body.idSender;
        const idReceiver = req.body.idReceiver;
        const content = req.body.content;

        const sql = "INSERT INTO messages(senderId, receiverId, content) VALUES(?, ?, ?);";
        db.query(sql, [idSender,idReceiver, content], (err, result)=>{
            if(err) throw new Errors.Errors.InternalServerError();
            return res.sendStatus(201);
        });
    }
    catch(err){
        return handler.handleError(err, res);
    }
};

const deleteRecord = (req, res)=>{
    try{
        if(base.noParam(req, "id")) throw new Errors.Errors.BadRequestError("message id must be specified.");
        const sql =  "DELETE FROM messages WHERE id=?";
        db.query(sql, [req.params.id], (err) =>{
            if(err) throw new InternalServerError();
            return res.sendStatus(204);
        });
    }
    catch(err){
        return handler.handleError(err, res);
    }
};

const express = require("express");
const router = express.Router();
router.get("/:idSender/:idReceiver", get);
router.post("/", jsonparser, create);
router.delete("/:id", deleteRecord);
module.exports = router;
