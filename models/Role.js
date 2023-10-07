const mongoose = require("mongoose");

const Role = new mongoose.Schema({
    name: {
        type: String
    },
    permissions: [{
        permission: {
            type: mongoose.Types.ObjectId,
            ref: 'Permission'
        },
        actions: [{
            type: mongoose.Types.ObjectId,
            ref: 'Action'
        }]
    }],
    deleted: {
        type: Boolean,
        default: false
    },
    editable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Role', Role);
