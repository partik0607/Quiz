const { default: mongoose } = require("mongoose");
const  Mongoose = require("mongoose");

const submissionSehema=new Mongoose.Schema({
    username: {
        type:String,
    },
    fullname: {
        type:String,
    },
    score: {
        type:Number
    },
    time_taken: {
        type:Number
    },
    answer: {
        type:Array,
        required:true,
    },

    time:{
        type:Array
    },
    submissionDate:Date,
    quiz:String,
    total_score:Number,
    total_time:Number,
    count:{
        type:Number,
        default:0
    }
    


});

module.exports=mongoose.model('submission',submissionSehema);