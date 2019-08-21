const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');

//set up body-parser
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

//bring in mongoose models
let HighScore = require('../models/highScore');
let CurrentScore = require('../models/currentScore')

router.get('/', (req, res) => {
    query = HighScore.find({})
    query.limit(5);
    query.sort({'score': -1});
    query.exec((err, HighScore) => {
        if(err) {
            console.log(err)
        } else {
            renderWithScores(res, HighScore)
        }
    })
});

function renderWithScores(res, HighScore) {
    res.render('highScores', {
        HighScore: HighScore 
    });
}

router.get('/:id', (req, res) => {
    CurrentScore.find({id: req.params.id}, (err, CurrentScore) => {
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
                    console.log(CurrentScore)
                    renderWithScoresAndId(res, CurrentScore, HighScore, req.params.id)
                }
            });
        }
    });
});

function renderWithScoresAndId(res, CurrentScore, HighScore, id) {
    res.render('highScoresEntry', {
        CurrentScore: CurrentScore[0].score,
        HighScore: HighScore,
        id: id
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

router.post('/:id', (req, res) => {
    let highScore = new HighScore()
    CurrentScore.find({id: req.params.id}, (err, newHighScore) => {
        if(err) {
           console.log("error posting score")
            return
        } else {
            const uppercaseName = req.body.name.toUpperCase()
            highScore.name = uppercaseName
            highScore.score = newHighScore[0].score
            highScore.save( err => {
                console.log(highScore.score)
                console.log(highScore.name)
                if(err) {
                    console.log(err)
                    return
                } else {
                    res.redirect('/highScores')
                }
            })
        }
    })
})

module.exports = router