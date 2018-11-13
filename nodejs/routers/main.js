'use strict'
var express = require('express')
var router = express.Router()
var Category = require('../models/Category')
var Content = require('../models/Content')

var data

/**
 * public structures */
router.use(function (req, _res, next) {
  data = {
    userInfo: req.userInfo,
    categories: [],
    category: '',
    author: ''

  }

  Category.find().then(function (categories) {
    data.categories = categories
    // select catergory
    next()
  })
})

/**
 * home page
 * */
router.get('/', async function (req, res, _next) {
  data.category = req.query.category || ''
  data.page = Number(req.query.page || 1)
  data.count = 0
  data.limit = 10
  data.pages = 0
  var where = {}
  if (data.category !== '') {
    where.category = data.category
  }
  /**
         * read all categories
         *  */

  Content.where(where).count().then(function (count) {
    data.count = count
    // calculate total number of pages
    data.pages = Math.ceil(data.count / data.limit)
    data.page = Math.min(data.page, data.pages)
    data.page = Math.max(data.page, 1)
    var skip = (data.page - 1) * data.limit
    return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
      addTime: -1
    })
  }).then(function (contents) {
    /**
         * read all posts content
         *  */
    data.contents = contents
    // console.log(data);
    res.render('main/index', data)
  })
})

router.get('/view', async function (req, res, _next) {
  var id = req.query.contentid || ''
  Content.findOne({
    _id: id
  }).populate(['category', 'user']).then(function (content) {
    data.content = content
    data.category = content.category.name
    data.author = content.user.username

    // add Visitor's number
    content.views++
    content.save()
    var where = {}
    if (content.category !== '') {
      where.category = content.category
    }

    Content.findOne({ _id: { $gt: content._id } }).sort({ _id: 1 }).then(function (content) {
      data.prevcontent = content
    }).then(function () {
      Content.findOne({ _id: { $lt: content._id } }).sort({ _id: -1 }).then(function (content) {
        data.nextcontent = content
      }).then(function () {
        Content.where(where).find().sort({
          addTime: -1
        }).then(function (contents) {
          data.contents = contents
          res.render('main/view', data)
        })
      })
    })
  })
})
module.exports = router
