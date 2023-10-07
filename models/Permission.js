const mongoose = require("mongoose");

const Permission = new mongoose.Schema({
    name: {
        type: String
    },
    url: {
        type: String
    },
    actions: {
        type: [String]
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Permission', Permission);