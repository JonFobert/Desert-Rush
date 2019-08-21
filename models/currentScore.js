let mongoose = require('mongoose');

// High Score Schema
let currentScoreSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('CurrentScore', currentScoreSchema)