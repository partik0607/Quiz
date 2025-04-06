const express = require("express");
const req = require("express/lib/request");
const Quiz = require("../model/quiz");
const User = require("../model/user");
const Submission = require("../model/submission");
var quiz;
var pointer = 0, len = 0;
const router = express.Router();

const month = ['Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


function scoreAchived(data, solution) {

    var c = 0, t = 0;
    if (data.option1[1] == 'on') {
        t++;
        if (solution.option1)
            c++;
    }
    else {
        if (solution.option1)
            return 0;
    }

    if (data.option2[1] == 'on') {
        t++;
        if (solution.option2)
            c++;
    }
    else {
        if (solution.option2)
            return 0;
    }

    if (data.option3[1] == 'on') {
        t++;
        if (solution.option3)
            c++;
    }
    else {
        if (solution.option3)
            return 0;
    }

    if (data.option4[1] == 'on') {
        t++;
        if (solution.option4)
            c++;
    }
    else {
        if (solution.option4)
            return 0;
    }
    // console.log("in solutionScore",c,t);
    if (t == 0)
        return data.score
    return ((c / t) * data.score).toFixed(2);
}

router.get("/quiz:id", async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const user = req.session.username;

    const id = req.params.id.split(":")[1];

    quiz = await Quiz.findOne({ _id: id });

    const d = new Date();
    const u = await Quiz.findOne({
        _id: id,
        submittor: {
            $in: [user]
        }
    })
    if (d < quiz.startDate && d > quiz.endDate) {
        res.send("This is not a right time");
    }
    // else if(u!=null)
    // {
    //     console.log(u);
    //     res.send("Why again");
    // }
    else {
        len = quiz.question.length;
        res.render('quiz.ejs', { isLoggedIn, user, quiz });
    }

    // console.log(quiz);
});

async function update(ans_id, id) {

    var answer = await Submission.findOne({ _id: ans_id });
    var q = await Quiz.findOne({ _id: id });

    var c = q.question.length - answer.time.length;
    if (c < 0) {
        var solution = {
            option1: NULL,
            option2: NULL,
            option3: NULL,
            option4: NULL,
            score: 0,
            time_taken: 0
        }
        var data = [], time = [];
        for (let i = 0; i < c; i++) {
            time.push(0);
            data.push(solution);
        }
        answer = await Submission.findOneAndUpdate({ _id: ans_id },
            {
                $push: {
                    answer: data,
                    time: time
                }
            }
        );
    }
    c = q.count;

    if (c == 0) {
        console.log("In new avg");
        var data = [], time = [];
        for (let i = 0; i < len; i++) {
            time.push(answer.answer[i].time_taken);
            data.push(answer.answer[i].score);
        }
        c++;
        q = await Quiz.findOneAndUpdate({ _id: id },
            {
                avg_score: data,
                avg_time: time,
                count: c,
            });
        return;
    }

    var data = [], time = [];
    for (let i = 0; i < len; i++) {
        var t = (quiz.avg_time[i] * c + answer.answer[i].time_taken) / (c + 1);
        var s = (quiz.avg_score[i] * c + answer.answer[i].score) / (c + 1);
        time.push(t.toFixed(2));
        data.push(s.toFixed(2));
    }
    c++;
    q = await Quiz.findOneAndUpdate({ _id: id },
        {
            avg_score: data,
            avg_time: time,
            count: c
        });

    return;





}

router.post("/start-quiz:id", async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const user = req.session.username;

    const id = req.params.id.split(":")[1];
    const ans_id = req.body.ans_id;

    if (!quiz) {
        res.send("Wrong URL");
    }
    else {

        pointer = Number(req.body.pointer);

        var data = {
            question: quiz.question[pointer].question,
            option1: quiz.question[pointer].option1,
            option2: quiz.question[pointer].option2,
            option3: quiz.question[pointer].option3,
            option4: quiz.question[pointer].option4,
            mcq: quiz.question[pointer].mcq,
            score: Number(quiz.question[pointer].score),
            timer: Number(quiz.question[pointer].timer)
        }

        var time_taken = data.timer - Number(req.body.timer1);

        var solution = {
            option1: req.body.answer1,
            option2: req.body.answer2,
            option3: req.body.answer3,
            option4: req.body.answer4,
            score: 0,
            time_taken: time_taken
        }
        const val = scoreAchived(data, solution);
        solution.score = Number(val);
        const total_score = Number(req.body.total_score) + Number(val);
        const total_time = Number(req.body.total_time) + time_taken;

        var answer = await Submission.findOne({ _id: ans_id });

        var ans_len = answer.count;

        if (ans_len != pointer) {
            res.send("Quiz over for you");
        }
        else {
            answer = await Submission.findOneAndUpdate({ _id: ans_id },
                {
                    $push: {
                        answer: solution,
                        time: time_taken,
                    },
                    total_score: total_score,
                    total_time: total_time,
                    count: pointer + 1,
                });

            pointer++;


            if (pointer == len) {
                update(ans_id, id);
                answer = await Submission.findOne({ _id: id });
                const statement = "Congratulation for completing quiz check full details here.";
                res.render("final", { isLoggedIn, user, statement, id, ans_id, total_score, total_time });

            }
            else {
                data = {
                    question: quiz.question[pointer].question,
                    option1: quiz.question[pointer].option1,
                    option2: quiz.question[pointer].option2,
                    option3: quiz.question[pointer].option3,
                    option4: quiz.question[pointer].option4,
                    mcq: quiz.question[pointer].mcq,
                    score: quiz.question[pointer].score,
                    timer: quiz.question[pointer].timer
                }
                const content = "this is content";
                const time = data.timer;
                const title = quiz.title;
                res.render('start-quiz.ejs', { isLoggedIn, user, data, title, pointer, time, content, id, ans_id, total_score, total_time });

            }
        }
    }
});

router.post("/now-start-quiz:id", async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const user = req.session.username;

    const id = req.params.id.split(":")[1];
    const fullname = req.body.fullName;

    if (id.length != 24) {
        res.send("Wrong URL");
    }
    else {

        quiz = await Quiz.findOne({ _id: id });

        if (!quiz) {
            res.send("Wrong URL");
        }
        else {

            const answer = await Submission.create(
                {
                    username: user,
                    fullname: fullname,
                    quiz: id,
                    submissionDate: new Date()
                }
            )
            console.log(answer);
            if (isLoggedIn) {
                var u = await User.findOneAndUpdate({ username: user }, {
                    $push: {
                        submission: answer._id,
                    }
                });
            }
            var q = await Quiz.findOneAndUpdate({ _id: id },
                {
                    $push: {
                        submittor: user,
                        submission: answer._id,
                    }
                });
            pointer = 0;
            var data = {
                question: quiz.question[pointer].question,
                option1: quiz.question[pointer].option1,
                option2: quiz.question[pointer].option2,
                option3: quiz.question[pointer].option3,
                option4: quiz.question[pointer].option4,
                mcq: quiz.question[pointer].mcq,
                score: quiz.question[pointer].score,
                timer: quiz.question[pointer].timer,
            }
            const content = "Make any rough work here";
            const time = data.timer;
            const title = quiz.title;
            const ans_id = answer._id;
            const total_score = 0;
            const total_time = 0;

            res.render('start-quiz.ejs', { isLoggedIn, user, data, title, pointer, time, content, id, ans_id, total_score, total_time });
        }
    }
});



module.exports = router;