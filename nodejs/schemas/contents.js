'use strict';
var mongoose=  require('mongoose');

module.exports=mongoose.Schema({
   
    _id:{
        type:mongoose.Schema.Types.ObjectId
    },
    //the category of ariticle
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    //post title
    title: {
        type:String,
        default:''       
    },
    //author id
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //added time of the article,default the current time
    addTime:{
        type:Date,
        default: new Date()
    },
    //Views(Visitors)
    views:{
        type: Number,
        default:0
    },
    //description of the article (show in home page)
    description:{
        type:String,
        default:''      
    },
    //the content of the ariticle (hided in home page)
    content:{
        type:String,
        default:''    
    }
});

