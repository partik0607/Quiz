const express = require("express");
const req = require("express/lib/request");
const Quiz = require("../model/quiz");
const User = require("../model/user");
const Submission = require("../model/submission");
const clone = require("clone");


const router = express.Router();

const month = ['Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

router.get("/details:id", async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const user = req.session.username;

    const id = req.params.id.split(":")[1];
    if (id.length != 24) {
        res.send("Wrong URL");
    }
    else {

        const ans = await Submission.findOne({ _id: id });

        if (!ans) {
            res.send("Wrong URL");
        }
        else {
            var data = {
                question: "",option1: "",option2: "",option3: "",option4: "",
                answer1: "",answer2: "",answer3: "",answer4: "",avg_time: "",
                avg_score: "",time: "",score: "",mx_score: "",mx_time: ""
            }
            var details = [];

            const q_id = ans.quiz;
            const q = await Quiz.findOne({ _id: q_id });
            const submissionTime = ans.submissionDate;

            const title = q.title;
            var len = ans.time.length;
            const username = ans.fullname;
            for (let i = 0; i < len; i++) {
                data.question = q.question[i].question;
                data.option1 = q.question[i].option1;
                data.option2 = q.question[i].option2;
                data.option3 = q.question[i].option3;
                data.option4 = q.question[i].option4;
                data.avg_score = q.avg_score[i];
                data.avg_time = q.avg_time[i];
                data.answer1 = ans.answer[i].option1;
                data.answer2 = ans.answer[i].option2;
                data.answer3 = ans.answer[i].option3;
                data.answer4 = ans.answer[i].option4;

                data.score = ans.answer[i].score;
                data.time = ans.answer[i].time_taken;
                data.mx_score = q.question[i].score;
                data.mx_time = q.question[i].timer;


                var tem = clone(data);
                details.push(tem);

            }

            res.render('details.ejs', { isLoggedIn, user, month, details, submissionTime, id, title, username });
        }
    }
});


module.exports = router;