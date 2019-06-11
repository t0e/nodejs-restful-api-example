const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, require: true }
})

module.exports = mongoose.model('Movies', movieSchema);
