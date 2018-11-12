'use strict'

// load all required modules
// entry of this application
var express = require('express')
var swig = require('swig')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var Cookies = require('cookies')
var User = require('./models/User')

// var multer=require('multer'); //use to upload file by browser
// var fs = require('fs');

// create application named 'app' => NodeJS Http.createSever();
var app = express()

// static file hosting
app.use('/public', express.static(__dirname + '/public'))

// define the type of this mudule engine which is 'html'
app.engine('html', swig.renderFile)

// set the directory to store the module engine, the first element must be 'views'
app.set('views', './views')
// register the module engine
app.set('view engine', 'html')
// choose not auto-save cache
swig.setDefaults({ cache: false })

app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {
  req.cookies = new Cookies(req, res)
  req.userInfo = {}
  if (req.cookies.get('userInfo')) {
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'))
      User.findById(req.userInfo._id).then(function (userInfo) {
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin)
        next()
      })
    } catch (e) { next() }
  } else {
    next()
  }
})

app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))

// connect to mongoose and the listen to 8888
mongoose.connect('mongodb://localhost:27017/blog', function (err) {
  if (err) {
    console.log('fail to connect to the database.')
  } else {
    console.log('success to connect to the database.')
    app.listen(8888)
  }
})
