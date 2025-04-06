const { default: mongoose } = require("mongoose");
const  Mongoose = require("mongoose");

const quizSehema=new Mongoose.Schema({
    
    question:Array,
    title:String,
    startDate:Date,
    endDate:Date,
    date:Date,
    author:String,
    submittor:{
        type:Array
    },
    submission:Array,
    avg_time:Array,
    avg_score:Array,
    count:{
        type:Number,
        default:0,
    },

});

module.exports=mongoose.model('quiz',quizSehema);