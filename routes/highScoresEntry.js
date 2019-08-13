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
            HighScore.find({}, (err, HighScore) => {
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
    orderedHighScores = topFiveHighToLow(HighScore)
    res.render('highScoresEntry', {
        CurrentScore: CurrentScore[0].score,
        HighScore: orderedHighScores    
    });
}

router.post('/', (req, res) => {
    let highScore = new HighScore()
    CurrentScore.find({}, (err, CurrentScore) => {
        if(err) {
           console.log("error posting score")
            return
        } else {
            highScore.name = req.body.name
            highScore.score = CurrentScore[0].score
            highScore.save( err => {
                console.log(highScore.score)
                console.log(highScore.name)
                if(err) {
                    console.log(err)
                    return
                } else {
                    res.redirect('/highScoresEntry')
                }
            })
        }
    })
})

module.exports = router