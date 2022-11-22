require("dotenv").config();
const db = require("../config/db");
const Validator = require("../base/validation");
const base = require("../base/controller");
const Errors = require("../base/exceptionHandler");
const  handler = new Errors.ErrorHandler();
const bcrypt = require("bcrypt");
const jsonparser = require("body-parser").json();
const jwt = require("jsonwebtoken");



const login = (req, res)=>{
   try{
        // check for email and password
        const body = req.body;

        if(!body.email || !body.password) throw new Errors.Errors.BadRequestError("User's email and password are required.");
        // verify the password once the query is executed
         Validator.resetErrors();
         Validator.validateEmail(body.email);
         Validator.validatePassword(body.password);
         if(Validator.result.invalid()) throw new Errors.Errors.UnprocessableEntityError(Validator.result.errors);

         const sql = `SELECT * FROM users WHERE email=?;`;
         db.query(sql, [body.email], async (err, result)=>{
             try{
                   if(err) throw  new Errors.Errors.InternalServerError();
                   if(result.length == 0) throw new Errors.Errors.NotFoundError("users", body.email) ;
                    const user = result[0];
                   const verified = await bcrypt.compare(body.password, user.password);
                   if(verified){
                        const accessToken = jwt.sign({
                            id : user.id,
                            username : user.username,
                            role : user.role
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn : "60s"});


                        const refreshToken = jwt.sign({
                            id : user.id,
                            username : user.username,
                            role : user.role
                        },
                        process.env.REFRESH_TOKEN_SECRET,
                        {expiresIn : "60s"});
                        // store refreshToken inside of a cookie
                        const oneDay = 24 * 60 * 60 * 1000;

                        res.cookie("jwt", refreshToken, {httpOnly : true, maxAge : oneDay });
                        res.json({accessToken });
                 }
                 else {
                      return res.sendStatus(404);
                 }
             }
             catch(err){
                throw err;
             }
       });
   }
    catch(err){
    return handler.handleError(err, res);
   }
};

const express = require("express");
const router = express.Router();

router.post("/", jsonparser, login);

module.exports = router;

