var mongoose=require("mongoose");

module.export=new mongoose.Schema({

    category: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    title: String,
    description: {
        type: String,
    }
    
    }

)