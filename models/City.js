
const mongoose = require('mongoose');

const City = new mongoose.Schema({
    name: {
        type: String,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    country: {
        type: mongoose.Types.ObjectId,
        ref: 'Country'
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model("City", City);