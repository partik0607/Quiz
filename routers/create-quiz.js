const express = require("express");
const { route } = require("express/lib/application");
const createController  = require("../controllers/createController");
const req = require("express/lib/request");
const router=express.Router();

router.get("/create-quiz",(req,res)=>{
    
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;

    res.render("create-quiz",{isLoggedIn,user});
});

router.post("/makequiz:id",createController.makeQuiz);

router.post("/create-quiz:id",createController.createQuiz);



module.exports=router;