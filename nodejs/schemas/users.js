var mongoose = require('mongoose')

module.exports = mongoose.Schema({
  username: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
})
