let mongoose = require('mongoose');

// High Score Schema
let highScoreSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('HighScore', highScoreSchema)