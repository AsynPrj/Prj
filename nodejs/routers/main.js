'use strict';
var express = require('express');
var router = express.Router();
var Category=require('../models/Category');
var Content=require('../models/Content');


// var data;

// /**
//  * public structures */
// router.use(function(req,res,next){
//     data = {
//     userInfo:req.userInfo,
//     category:[],
//     categories:[],
//     contents:[]
//     };

//     Category.find().then(function(categories){
//         data.categories=categories;
//         next();
//     });
// });

// /**
//  * home page 
//  * */
// router.get('/',function(req,res,next){
//     data.category=req.query.category || '',
//     data.page=Number(req.query.page || 1 );
   
//     data.count=0;
//     data.limit=10;
//     data.pages=0;
//     var where ={};

//     if (category!==''){
//         where.category=data.category;
//     }

//    // console.log(data);
//     /**
//      * read all categories
//      *  */
//     Category.where(where).count().then(function(count){

//         data.count=count;
//         //calculate total number of pages
//         data.pages=Math.ceil(data.count/data.limit);
//         data.page=Math.min(data.page,data.pages);
//         data.page=Math.max(data.page,1);
//         var skip=(data.page-1)*data.limit;
        
//         return Content.find().limit(data.limit).skip(skip).populate(['category','user']).sort({
//             addTime: -1
//         });
//     }).then(function(contents){
//         /**
//          * read all posts content
//          *  */
//         data.contents=contents;
//         //console.log(data);
//         res.render('main/index',data);
//     }); 
// });

/**
 * home page 
 * */
router.get('/',function(req,res,next){
    var data = {
        userInfo: req.userInfo,
        category: req.query.category || '',
        categories: [],

        contents:[],
        contentId:req.query.contentId || '',

        count : 0,
        page : Number ( req.query.page || 1 ),
        limit : 10,
        pages : 0
    };
    var where={};
    if (data.category!==''){
        where.category=data.category;
    }

 
    //read all categories informations
    Category.where(where).find().then(function(categories){
       data.categories=categories;
       return Content.count();
    }).then(function(count){
        data.count=count;
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
        res.render('main/index',data);
    });


});


router.get('/view',function(req,res,next){
   
    data.contentId=req.query.id || '';
    console.log(contentId);
    Content.findOne({
        _id:contentId
    }).then(function(content){
        data.content=content;
        //add Visitor's number
        content.views++;
        content.save();

        res.render('main/view',data);
    });
});

module.exports=router;