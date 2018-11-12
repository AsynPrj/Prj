'use strict'
var mongoose = require('mongoose')

module.exports = mongoose.Schema({
  username: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  email: String,
  emailCode: String,
  createdTime: Number
})
