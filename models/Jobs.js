const mongoose = require("mongoose");
    
const Jobs = new mongoose.Schema({
    name: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Jobs', Jobs);
    