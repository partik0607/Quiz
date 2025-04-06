const express=require("express");
const bodyparser=require("body-parser");
const mongodb=require("mongoose");
const path=require("path");
const session = require("express-session");
const MongoDBStore=require("connect-mongodb-session")(session);
const req = require("express/lib/request");
const { appendFile } = require("fs");
const port =process.env.PORT || 3000;

const pass="punitQuiz";
const MONGODB_URI="mongodb+srv://punit:punitQuiz@cluster0.xi7p7.mongodb.net/?retryWrites=true&w=majority";

const app=express();

const store=new MongoDBStore({uri:MONGODB_URI,collection:"sessions"});
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.set("view engine","ejs");
app.use(session({secret: "my secret", resave: false, saveUninitialized: false, store: store}));


const authRoutes=require("./routers/auth");
const createRoutes=require("./routers/create-quiz");
const profileRoutes=require("./routers/profile");
const readRoutes=require("./routers/read");
const quizRoutes=require("./routers/quiz");
const detailsRoutes=require("./routers/details");





app.get("/",async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    
    if(isLoggedIn)
    {
        res.redirect("/profile");
    }
    else
        res.redirect("/signup");
    
});

app.use(authRoutes);
app.use(createRoutes);
app.use(profileRoutes);
app.use(readRoutes);
app.use(quizRoutes);
app.use(detailsRoutes);



app.listen(port,()=>{
    console.log("connected at ",port);
});

mongodb.connect(MONGODB_URI,()=>{

    console.log("connected to mongoose");
});

