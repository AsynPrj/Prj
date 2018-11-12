'use strict';
var express = require('express');
var router = express.Router();
var swig = require('swig');
var Category=require('../models/Category');
var Content=require('../models/Content');

var data;
/**
 * public structures */
router.use(function(req,res,next){
    data = {
        userInfo: req.userInfo,
        categories: []
    };

    Category.find().then(function(categories){
            data.categories=categories;
            // select catergory
            next();
        });

});

/**
 * home page 
 * */
router.get('/',async function(req,res,next){

    data.category=req.query.category || '';
    data.page=Number(req.query.page || 1 );
    data.count=0;
    data.limit=10;
    data.pages=0;

    var where={};
    if (data.category!==''){
         where.category=data.category;
     }
        /**
         * read all categories
         *  */
    
        Content.where(where).count().then(function(count){
        data.count=count;
        //calculate total number of pages
        data.pages=Math.ceil(data.count/data.limit);
        data.page=Math.min(data.page,data.pages);
        data.page=Math.max(data.page,1);
        var skip=(data.page-1)*data.limit;
        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({
            addTime: -1
        });
    }).then(function(contents){
        /**
         * read all posts content
         *  */
        data.contents=contents;
        //console.log(data);
        res.render('main/index',data);
    }); 
});

router.get('/view',async function(req,res,next){
    var id=req.query.contentid || '';
    //console.log(req.query.contentid);
    Content.findOne({
        _id:id
    }).then(function(content){
        data.content=content;
        //add Visitor's number
        content.views++;
        content.save();
        res.render('main/view',data);
    });
});

module.exports=router;