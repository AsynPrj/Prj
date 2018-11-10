var express = require('express')
var router = express.Router()
var Category = require('../models/Category')
var Content = require('../models/Content')
/**
 * home page
 * */
router.get('/', function (req, res, next) {
  var data = {
    page: Number(req.query.page || 1),
    count: 0,
    limit: 10,
    pages: 0,

    userInfo: req.userInfo,
    categories: []
  }

  /**
     * read all categories
     *  */
  Category.find().then(function (categories) {
    data.categories = categories
    return Content.count()
  }).then(function (count) {
    data.count = count
    // calculate total number of pages
    data.pages = Math.ceil(data.count / data.limit)
    data.page = Math.min(data.page, data.pages)
    data.page = Math.max(data.page, 1)
    var skip = (data.page - 1) * data.limit
    return Category.find().limit(data.limit).skip(skip).populate(['category', 'user'])
  }).then(function (contents) {
    /**
         * read all posts content
         *  */
    data.contents = contents
    // console.log(data);
    res.render('main/index', data)
  })
})
module.exports = router
