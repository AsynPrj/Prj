'use strict'
var express = require('express')
var router = express.Router()
var User = require('../models/User')
var Content = require('../models/Content')
var responseData

router.use(function (_req, _res, next) {
  responseData = {
    code: 0,
    message: ''
  }
  next()
})

router.post('/user/register', async function (req, res, _next) {
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
  // search for this username in the database
  User.findOne({
    username: username
  }).then(function (userInfo) {
    if (userInfo) {
      responseData.code = 4
      responseData.message = 'this username has already exist'
      res.json(responseData)
      return
    }
    var user = new User({
      username: username,
      password: password
    })
    return user.save()
  }).then(function (_newUserInfo) {
    responseData.message = 'register successful'
    res.json(responseData)
  })
})
/**
 * login
 */
router.post('/user/login', async function (req, res, _next) {
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
router.get('/user/logout', function (req, res, _next) {
  req.cookies.set('userInfo', null)
  res.json(responseData)
})

/**
 * comments upload */
router.post('/comment/post', function (req, res) {
  // the id of post content
  var contentId = req.body.contentid || ''
  var postData = {
    username: req.userInfo.username,
    postTime: new Date(),
    content: req.body.content
  }
  // get this post content's Info
  Content.findOne({
    _id: contentId
  }).then(function (content) {
    content.comments.push(postData)
    return content.save()
  }).then(function (newContent) {
    responseData.message = 'Comment success!'
    responseData.data = newContent
    res.json(responseData)
  })
})

module.exports = router
