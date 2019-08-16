const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');

//set up body-parser
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

//bring in mongoose models
let HighScore = require('../models/highScore');
let CurrentScore = require('../models/currentScore')

function topFiveHighToLow(array) {
    return array.sort((a, b) => {
        return b.score-a.score
    })
    .slice(0, 5)
}

router.get('/', (req, res) => {
    CurrentScore.find({}, (err, CurrentScore) => {
        if(err) {
            console.log(err)
        } else {
            query = HighScore.find({})
            query.limit(5);
            query.sort({'score': -1});
            query.exec((err, HighScore) => {
                if(err) {
                    console.log(err)
                } else {
                    renderWithScores(res, CurrentScore, HighScore)
                }
            });
        }
    });
});

function renderWithScores(res, CurrentScore, HighScore) {
    res.render('highScores', {
        CurrentScore: CurrentScore[0].score,
        HighScore: HighScore 
    });
}

function zeroOutScoreThenRedirect(res, req) {
    CurrentScore.findOneAndUpdate({}, {score: 0}, {new: true}, (err, newScore) => {
        if (err) {
            console.log("Error!")
        } else {
            console.log(newScore)
            res.redirect('/highScores')
        }
    })
}

router.post('/', (req, res) => {
    let highScore = new HighScore()
    CurrentScore.find({}, (err, newHighScore) => {
        if(err) {
           console.log("error posting score")
            return
        } else {
            highScore.name = req.body.name
            highScore.score = newHighScore[0].score
            highScore.save( err => {
                console.log(highScore.score)
                console.log(highScore.name)
                if(err) {
                    console.log(err)
                    return
                } else {
                    zeroOutScoreThenRedirect(res, req)
                }
            })
        }
    })
})

module.exports = router