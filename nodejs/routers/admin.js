var express = require('express');
var router = express.Router();
var swig = require('swig');
var User=require('../models/User');
var Category=require('../models/Category');
var bodyParser=require('body-parser');

router.use (function(req,res,next){
    if(!req.userInfo.isAdmin){
        res.send('sorry, only the admin can enter this page');
        return;
    }
    next();
});
router.get('/',function(req,res,next){
    res.render('admin/index',{
        userInfo:req.userInfo
    });
});

//see all the users
router.get('/user',function(req,res,next){
    var page=Number(req.query.page||1);
    var limit=10;  
    var pages=0;
    User.count().then(function(count){
        pages=Math.ceil(count/limit);
        page=Math.min(page,pages);
        page=Math.max(page,1);
        var skip=(page-1)*limit;
        User.find().limit(limit).skip(skip).then(function(users){       
            res.render('admin/user_index',{
             userInfo:req.userInfo,
             users:users,
             page:page,
             pages:pages,
             count:count,
             limit:limit,
            });
        });
    }); 
});

//see all categories
router.get('/category',function(req,res,next){

    var page=Number(req.query.page||1);
    var limit=10;  
    var pages=0;

    Category.count().then(function(count){
        
        pages=Math.ceil(count/limit);
        page=Math.min(page,pages);
        page=Math.max(page,1);
        var skip=(page-1)*limit;
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){       
            res.render('admin/category_index',{
             userInfo:req.userInfo,
             categories:categories,
             page:page,
             pages:pages,
             count:count,
             limit:limit,
            });
        });
    }); 
});


//add a category
router.get('/category/add',function(req,res,next){
    res.render('admin/category_add',{
         userInfo:req.userInfo,        
       });
    //    next();
});

// save a category
router.post('/category/add',function(req,res,next){
    var name= req.body.name || '';
    if(name==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'name can not be empty',
        });
    }
    Category.findOne({
        name:name,
    }).then(function(rs){
        if(rs){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'this category has already exist.'
            })
            return Promise.reject();         
            }else{
                return new Category({
                    name:name
                }).save();
        }
    }).then(function(newCategory){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'succeed in saving this category.',
            url: 'admin/category'
        })
    });
  
});

//edit a category
router.get('/category/edit',function(req,res,next){
    var id = req.query.id;
    Category.findOne({
        _id:id,
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'this category does not exist.'
            }); 
            // return Promise.reject();         
            }else{
                res.render('admin/category_edit',{
                    userInfo:req.userInfo,
                    category:category
                }); 
        }
    }); 
});

//save the edit of category
router.post('/category/edit',function(req,res,next){
    var id= req.query.id || '';
    var name= req.body.name || '';
    Category.findOne({
        _id:id,
    }).then(function(category){    
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'this category does not exist.'
            });  
            return Promise.reject();             
            }else{
                if(category.name==name){
                    res.render('admin/success',{
                        userInfo:req.userInfo,
                        message:'succeed in editing this category.',
                        url:'/admin/category'
                    }); 
                }else{
                    return Category.findOne({
                        _id:{$ne:id},
                        name:name,
                    });
                }
            }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'category with this name has already exist.',
            });
            return Promise.reject();             
        }else{
            return Category.update(
                {_id:id},
                {name:name}
            );           
        }
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'succeed in editing this category.',
            url:'/admin/category'
        }); 
    })
});


//delete a category
router.get('/category/delete',function(req,res,next){
    var id= req.query.id || '';
    Category.remove({
       _id:id
    }).then(function(rs){      
            res.render('admin/success',{
                userInfo:req.userInfo,
                message:'delete successful.',
                url:'/admin/category'
            });            
    }); 
});

//homepage of the blog content
router.get('/content',function(req,res,next){
    res.render('admin/content_index',{
        userInfo:req.userInfo,
    });            
});

//add blog content
router.get('/content/add',function(req,res,next){
    res.render('admin/content_add',{
        userInfo:req.userInfo,
    });            
});

module.exports=router;