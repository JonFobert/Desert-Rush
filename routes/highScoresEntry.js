const express = require('express')
const router = express.Router()
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')

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
        HighScore.find({}, (err, HighScore) => {
            orderedHighScores = topFiveHighToLow(HighScore)
            res.render('highScoresEntry', {
                CurrentScore: CurrentScore[0].score,
                HighScore: orderedHighScores
            })
        })
    })
})

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