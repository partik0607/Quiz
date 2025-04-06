const  mongoose  = require("mongoose");

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    quiz:{
        type:Array,
    },
    submissions:Array
});

module.exports =mongoose.model('user',userSchema);