const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');


app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '.public/index.html'))
})

//connect to the database
const db = require('./config/keys').mongoURI



const PORT = process.env.PORT || 3000
app.listen(PORT, function() {
    console.log(`server started on port ${3000}` )
})