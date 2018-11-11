'use strict';
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var swig = require('swig');
var responseData;

router.use(function(req,res,next){
        responseData={
            code:0,
            message:''
        }
        next();
    });

router.post('/user/register',function(req,res,next){
    var username= req.body.username;
    var password= req.body.password;
    var repassword= req.body.repassword;
    if(username===''){
        responseData.code=1;
        responseData.message="the username can't be empty";
        res.json(responseData);
        return;
    } 
    if(password===''){
        responseData.code=2;
        responseData.message="the password can't be empty";
        res.json(responseData);
        return;
    } 
    if (password!==repassword){
        responseData.code=3;
        responseData.message="the passwords are not the same";
        res.json(responseData);
        return;
    }
    //search for this username in the database
    User.findOne({
        username:username
    }).then(function(userInfo){
        if(userInfo){
            responseData.code=4;
            responseData.message="this username has already exist";
            res.json(responseData);
            return;
        }
        var user = new User({
            username:username,
            password:password
        });
        return user.save(); 
    }).then (function(newUserInfo){
        responseData.message="register successful";
        res.json(responseData);
    })
});
/** 
 * login
 */
router.post('/user/login',function(req,res,next){
    var username= req.body.username;
    var password= req.body.password;
    if(username===''||password===''){
        responseData.code=1;
        responseData.message="username or password can't be empty";
        res.json(responseData);
        return;
    } 
    //search for this user in the database, if exist then login
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code=2;
            responseData.message="username or password WRONG";
            res.json(responseData);
            return;
        }
        //login
        responseData.message="login successful!";
        responseData.userInfo={
            _id:userInfo._id,
            username:userInfo.username
        };
        req.cookies.set('userInfo',JSON.stringify({
            _id:userInfo._id,
            username:userInfo.username
        }));
        res.json(responseData);
        return;
    });
});

router.get('/user/logout',function(req,res,next){
    req.cookies.set('userInfo',null);
    res.json(responseData);
});

module.exports=router;