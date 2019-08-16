const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

//bring in mongoose models
//HighScore now IS the mongoose model for highScore
let HighScore = require('./models/highScore');
let CurrentScore = require('./models/currentScore')

//set template engine to ejs
app.set('view engine', 'ejs')

//set the static folder
app.use(express.static(path.join(__dirname, 'public')))

//reroute highScoren=sEntry routes to the js file in the routes folder
//get rid of the /highScoreEntry in highScoreEntry.js routes
let highScores = require('./routes/highScores')
app.use('/highScores', highScores)

let api = require('./routes/api')
app.use('/api', api)








//Set up body parser for JSON
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//connect to the database
const db = require('./config/keys').mongoURI

mongoose
    .connect(db,{useNewUrlParser: true})
    .then(() => console.log("MongoDb connected"))
    .catch(err => console.log(err))


app.get('/', (req, res) => {
    CurrentScore.findOneAndUpdate({}, {score: 0}, {new: true}, (err, newScore) => {
        console.log(newScore)
        if (err) {
            console.log("Error!")
        } else {
            res.render('index', {
                CurrentScore: newScore.score
            })
        }
    })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, function() {
    console.log(`server started on port ${3000}`)
})