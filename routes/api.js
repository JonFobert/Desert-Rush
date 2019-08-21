const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');

//set up body-parser
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

//bring in mongoose models
let HighScore = require('../models/highScore');
let CurrentScore = require('../models/currentScore')

router.post('/player/:id', function(req, res) {
    let newScore = new CurrentScore(
        {
            id: req.params.id,
            score: 0
        }
    );
    newScore.save(function (err) {
        if (err) {
            console.log(err) 
        } else {
            res.render('index', {
                CurrentScore: newScore.score
            })
        }
    })
})

router.put('/player/:id', (req, res) => {
    CurrentScore.findOneAndUpdate({id: req.params.id}, req.body, {new: true}, (err, newScore) => {
        if (err) {
            console.log("Error!")
        } else {
            res.json({msg: 'Score Updated in DB', newScore})
        }
    })
})

module.exports = router