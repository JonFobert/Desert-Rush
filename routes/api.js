const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');

//set up body-parser
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

//bring in mongoose models
let HighScore = require('../models/highScore');
let CurrentScore = require('../models/currentScore')

router.put('/player', (req, res) => {
    CurrentScore.findOneAndUpdate({}, req.body, {new: true}, (err, newScore) => {
        if (err) {
            console.log("Error!")
        } else {
            res.json({msg: 'Score Updated in DB', newScore})
        }
    })
})

router.post('/player', (req, res) => {
    let currentScore = new CurrentScore()
    currentScore.score = req.body.score;

    currentScore.save( err => {
        if(err) {
            console.log(err)
            return
        } else {
            console.log('updated current Score')
        }
    })
})

module.exports = router