'use strict';
var mongoose=  require('mongoose');

module.exports=mongoose.Schema({

    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    
    title: {
        type:String,
        default:''       
    },

    description:{
        type:String,
        default:''      
    },
    
    content:{
        type:String,
        default:''    
    }
});

