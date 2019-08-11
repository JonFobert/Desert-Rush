let mongoose = require('mongoose');

// High Score Schema
let currentScoreSchema = mongoose.Schema({
    score: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('CurrentScore', currentScoreSchema)