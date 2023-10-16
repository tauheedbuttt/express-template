const mongoose = require("mongoose");

const Action = new mongoose.Schema({
    permission: {
        type: mongoose.Types.ObjectId,
        ref: 'Permission'
    },
    name: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Action', Action);
