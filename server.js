//To DO: two possible ideas:
//  * after getting a high score display just the name entry. Post the name entry and score. res.redirect to a Home. Also add menu bar for navigation
//  OR
//  * after getting a high score display name field and high scores. just push the high score. at the same time post. Refresh to start a new game.

const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

//set the static folder
app.use(express.static(path.join(__dirname, 'public')))

//retrieve index.html when on the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/highScores', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/highScores.html'))
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

let HighScore = require('./models/highScore');

app.post('/', (req, res) => {
    let highScore = new HighScore()
    highScore.name = req.body.name;
    highScore.score = 43;

    highScore.save( err => {
        if(err) {
            console.log(err)
            return
        } else {
            console.log(res)
        }
    })
})


const PORT = process.env.PORT || 3000

app.listen(PORT, function() {
    console.log(`server started on port ${3000}`)
})