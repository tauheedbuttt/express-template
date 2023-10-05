const mongoose = require("mongoose");
    
const Jobs = new mongoose.Schema({
    name: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Jobs', Jobs);
    