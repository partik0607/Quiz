const express = require("express");
const req = require("express/lib/request");
const Quiz = require("../model/quiz");
const User = require("../model/user");
const Submission = require("../model/submission")
const clone = require("clone");

const router = express.Router();

const month = ['Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

router.get("/read:id", async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const user = req.session.username;

    const id = req.params.id.split(":")[1];

    if (id.length != 24) {
        res.send("Wrong URL");
    }
    else {
        const quiz = await Quiz.findOne({ _id: id });

        if (!isLoggedIn) {
            res.redirect('/login');
        }
        else if (!quiz) {
            res.send("Wrong URL");
        }
        else {

            var data = {
                username: "",
                fullname: "",
                time: "",
                score: "",
                submision_id: "",
            }

            var details = [];
            console.log(quiz.submission);
            for (let i in quiz.submission) {
                var sub = await Submission.findOne({ _id: quiz.submission[i] });
                data.username = sub.username;
                data.fullname = sub.fullname;
                data.time = sub.total_time;
                data.score = sub.total_score;
                data.submission_id = sub._id;

                var tem = clone(data);
                details.push(tem);

            }

            res.render('read.ejs', { quiz, isLoggedIn, user, details });
        }
    }
});


module.exports = router;