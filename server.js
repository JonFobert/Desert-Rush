//To DO: two possible ideas:
//  * after getting a high score display just the name entry. Post the name entry and score. res.redirect to a Home. Also add menu bar for navigation
//  OR
//  * after getting a high score display name field and high scores. just push the high score. at the same time post. Refresh to start a new game.

const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

//bring in mongoose models
let HighScore = require('./models/highScore');
let CurrentScore = require('./models/currentScore')

//set template engine to ejs
app.set('view engine', 'ejs')

//set the static folder
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    HighScore.find({}, (err, articles) => {
        if(err) {
            console.log(err)
        } else {
            let topFive = 
                articles
                .sort((a, b) => {
                    return b.score-a.score
                })
                .slice(0, 5)
            console.log(topFive)
                res.render('index')
        }
    })
})




app.get('/highScores', (req, res) => {
    res.render('highScores')
})



//Set up body parser for JSON
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//connect to the database
const db = require('./config/keys').mongoURI

mongoose
    .connect(db,{useNewUrlParser: true})
    .then(() => console.log("MongoDb connected"))
    .catch(err => console.log(err))

app.put('/api/player', (req, res) => {
    CurrentScore.findOneAndUpdate({}, req.body, {new: true}, (err, newScore) => {
        if (err) {
            console.log("Error!")
        } else {
            res.json({msg: 'Score Updated in DB', newScore})
        }
    })
})

app.post('/api/player', (req, res) => {
    let currentScore = new CurrentScore()
    currentScore.score = req.body.score;

    currentScore.save( err => {
        if(err) {
            console.log("im an error")
            return
        } else {
            console.log('updated current Score')
        }
    })
})


app.post('/', (req, res) => {
    let highScore = new HighScore()
    highScore.name = req.body.name;
    highScore.score = 4;

    highScore.save( err => {
        if(err) {
            console.log("im an error")
            return
        } else {
            res.redirect('/')
        }
    })
})

function topFiveHighToLow(array) {
    return array.sort((a, b) => {
        return b.score-a.score
    })
    .slice(0, 5)
}

app.get('/highScoresEntry', (req, res) => {
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

app.post('/highScoresEntry', (req, res) => {
    let highScore = new HighScore()
    CurrentScore.find({}, (err, CurrentScore) => {
        if(err) {
           console.log("error posting score")
            return
        } else {
            highScore.name = req.body.name
            highScore.score = CurrentScore[0].score
            highScore.save( err => {
                //highScore.score = CurrentScore[0].score
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

const PORT = process.env.PORT || 3000

app.listen(PORT, function() {
    console.log(`server started on port ${3000}`)
})