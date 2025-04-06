const req = require("express/lib/request");
const { default: mongoose, Mongoose } = require("mongoose");
const quiz = require("../model/quiz");
const User = require("../model/user");


exports.getInputForm = (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const user = req.session.username;

    if (!isLoggedIn) {
        res.redirect("/login");
    }
    else
        res.render("create-post.ejs", { isLoggedIn, user });
};

exports.makeQuiz = async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const user = req.session.username;

    if (!isLoggedIn) {
        res.redirect("/");
    }
    else {

        var title = req.body.title;
        var id = req.params.id.split(":")[1];
        var data = {
            question: "", option1: "", option2: "", option3: "",
            option4: "", mcq: false, score: 20, timer: 120,
        }
        data.question = req.body.question;
        data.option1 = [req.body.option1, req.body.answer1];
        data.option2 = [req.body.option2, req.body.answer2];
        data.option3 = [req.body.option3, req.body.answer3];
        data.option4 = [req.body.option4, req.body.answer4];
        data.mcq = req.body.mcq;
        data.timer = Number(req.body.timer);
        data.score = Number(req.body.score);
        console.log();

        if (!title) {
            const q = await quiz.findByIdAndUpdate({ _id: id },
                {
                    $push: {
                        question: data,
                        avg_score: 0,
                        avg_time: 0,

                    }
                });
        }
        else {
            const p = await quiz.create({
                title: title,
                question: data,
                author: user,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                avg_score: 0,
                avg_time: 0,

                date: new Date(),
            })
            id = p._id;
        }
        score = data.score,
            timer = data.timer,
            res.render("add_question", { isLoggedIn, user, id, timer, score });
    }
};

exports.createQuiz = async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const user = req.session.username;

    var id = req.params.id.split(":")[1];
    if (!isLoggedIn) {
        res.redirect("/login");
    }
    else if (id.length != 24) {
        res.send("Wrong URL");
    }
    else {

        const u = await User.findOneAndUpdate({ username: user },
            {
                $push: {
                    quiz: id,
                }
            });

        res.redirect('/');
    }


};