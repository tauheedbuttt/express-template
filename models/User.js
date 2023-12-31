
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    // Basic Fields
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    password: {
        type: String,
    },
    image: {
        type: String,
    },
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'Role'
    },
    status: {
        type: String,
        enum: ['Approved', 'Pending', 'Blocked', 'Deleted'],
        default: 'Pending'
    },
    deleted: {
        type: Boolean,
        default: false,
    },

    // For Password Reset
    resetPasswordToken: String,
    resetPasswordExpire: Number
}, { timestamps: true });

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        })
    })
});

userSchema.methods.comparePassword = function (candidatePassword) {
    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) return reject(err);
            if (!isMatch) return reject(false);
            return resolve(true);
        });
    })
}

module.exports = mongoose.model("User", userSchema);