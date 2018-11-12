'use strict'
var express = require('express')
var router = express.Router()
var User = require('../models/User')
var responseData
var nodemailer = require('nodemailer')
// create reusable transporter object using the default SMTP transport
var poolConfig = {
  /* pool: true,
    host: 'smtp.qq.com',
    port: 587,
    secure: false, // use TLS */
  service: 'QQ',
  auth: {
    user: '873244022@qq.com',
    pass: 'smrenmhpbowbbbda'
  }
}
var transporter = nodemailer.createTransport(poolConfig)
// retcode explanation:
//     200: request successful
//     400: wrong parameter
//     410: unlogin
//     420: the user does not exist
// resBody = {
//     retcode: '',
//     retdesc: '',
// }

router.post('/genEmailCode', function (req, res, next) {
  var email = req.body.email
  var resBody = {
    retcode: '',
    retdesc: '',
    data: {}
  }
  if (!email) {
    resBody = {
      retcode: 400,
      retdesc: 'error'
    }
    res.send(resBody)
    return
  }
  function genRandomCode () {
    var arrNum = []
    for (var i = 0; i < 6; i++) {
      var tmpCode = Math.floor(Math.random() * 9)
      arrNum.push(tmpCode)
    }
    return arrNum.join('')
  }
  User.findOne({ email: email }, function (err, doc) {
    if (err) {
      return console.log(err)
    } else if (doc && doc.username !== 'tmp') {
      resBody = {
        retcode: 400,
        retdesc: 'this email address has been registered'
      }
      res.send(resBody)
    } else if (!doc) { // the first time a email address is used to receive the verification code
      var emailCode = genRandomCode()
      var createdTime = Date.now()
      // setup e-mail data with unicode symbols
      var mailOptions = {
        from: '"blog test" <873244022@qq.com>', // sender address
        to: email, // list of receivers
        subject: 'blog register test' + email, // Subject line
        text: 'Hello world', // plaintext body
        html: [
          '<h1 style=color:red;>' + emailCode + '</h1>',
          '<p>' + (new Date()).toLocaleString() + '</p >'
        ].join('') // html body
      }
      // send mail with defined transport object
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error)
        }
        // console.log('Message sent: ' + info.response);
        new User({
          username: 'tmp',
          password: '0000',
          email: email,
          emailCode: emailCode,
          createdTime: createdTime,
          articles: [],
          links: []
        }).save(function (err) {
          if (err) return console.log(err)
          // if you don't register in 30 minutes, the data inserted into the database will be automatically deleted
          setTimeout(function () {
            User.findOne({ email: email }, function (err, doc) {
              if (err) {
                return console.log(err)
              } else if (doc && doc.createdTime === createdTime) {
                User.remove({ email: email }, function (err) {
                  if (err) {
                    return console.log(err)
                  }
                })
              }
            })
          }, 30 * 60 * 1000)
          resBody = {
            retcode: 200,
            retdesc: ''
          }
          res.send(resBody)
        })
      })
    } else if (doc && doc.username === 'tmp') { 
      // if you click to request the verification code again in 30 minutes, the code in the database will be updated
      emailCode = genRandomCode()
      createdTime = Date.now()
      // setup e-mail data with unicode symbols
      mailOptions = {
        from: '"blog test" <873244022@qq.com>', // sender address
        to: email, // list of receivers
        subject: 'blog register test' + email, // Subject line
        text: 'Hello world', // plaintext body
        html: [
          '<h1 style="color:red;">' + emailCode + '</h1>',
          '<p>' + (new Date()).toLocaleString() + '</p >'
        ].join('') // html body
      }
      // send mail with defined transport object
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error)
        }
        User.update({ email: email }, { emailCode: emailCode, createdTime: Date.now() }, function (err) {
          if (err) {
            return console.log(err)
          } else {
            // if you don't register in 30 minutes, the data inserted into the database will be automatically deleted
            setTimeout(function () {
              User.findOne({ email: email }, function (err, doc) {
                if (err) {
                  return console.log(err)
                } else if (doc && doc.createdTime === createdTime) {
                  User.remove({ email: email }, function (err) {
                    if (err) {
                      return console.log(err)
                    }
                  })
                }
              })
            }, 30 * 60 * 1000)
            resBody = {
              retcode: 200,
              retdesc: ''
            }
            res.send(resBody)
          }
        })
      })
    }
  })
})

router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ''
  }
  next()
})

router.post('/user/register', async function (req, res, next) {
  var email = req.body.email
  var username = req.body.username
  var password = req.body.password
  var repassword = req.body.repassword
  if (username === '') {
    responseData.code = 1
    responseData.message = "the username can't be empty"
    res.json(responseData)
    return
  }
  if (password === '') {
    responseData.code = 2
    responseData.message = "the password can't be empty"
    res.json(responseData)
    return
  }
  if (password !== repassword) {
    responseData.code = 3
    responseData.message = 'the passwords are not the same'
    res.json(responseData)
    return
  }
  User.update({ email: email }, { username: username, password: password }, function (newUserInfo) {
    responseData.message = 'register successful'
    res.json(responseData)
  })
})
/**
 * login
 */
router.post('/user/login', async function (req, res, next) {
  var username = req.body.username
  var password = req.body.password
  if (username === '' || password === '') {
    responseData.code = 1
    responseData.message = "username or password can't be empty"
    res.json(responseData)
    return
  }
  // search for this user in the database, if exist then login
  User.findOne({
    username: username,
    password: password
  }).then(function (userInfo) {
    if (!userInfo) {
      responseData.code = 2
      responseData.message = 'username or password WRONG'
      res.json(responseData)
      return
    }
    // login
    responseData.message = 'login successful!'
    responseData.userInfo = {
      _id: userInfo._id,
      username: userInfo.username
    }
    req.cookies.set('userInfo', JSON.stringify({
      _id: userInfo._id,
      username: userInfo.username
    }))
    res.json(responseData)
  })
})
/**
 * logout */
router.get('/user/logout', function (req, res, next) {
  req.cookies.set('userInfo', null)
  res.json(responseData)
})
/**
 * comments */
// router.post('/comment/post',function(req,res){
//     var contentId=req.body.contentid;
//     var postData={
//         username:req.userInfo.username,
//         postTime:new Date(),
//         content:req.body.content
//     };
//     Content.findOne({
//         _id:contentId
//     }).then(function(content){
//         content.comments.push(postData);
//         return content.save();
//     }).then(function(newContent){
//         responseData.message='Comment success!';
//         res.json(responseData);
//     });

// });

module.exports = router
