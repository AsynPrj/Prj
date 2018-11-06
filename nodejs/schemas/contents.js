
var mongoose=  require('mongoose');

module.exports=mongoose.Schema({

    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content' ,
    },
    
    title: {
        type:String,
        default:'',       
    },

    discription:{
        type:String,
        default:'',       
    },
    
    content:{
        type:String,
        default:'',     
    }
});

