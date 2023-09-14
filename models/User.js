
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
    imageURL: {
        type: String,
    },
    socketID: {
        type: String,
    },
    role: {
        type: String,
        default: 'vendor'
    },
    status: {
        type: String,
        enum: ['Approved', 'Pending', 'Blocked', 'Deleted'],
        default: 'Pending'
    },

    // For Password Reset
    resetPasswordToken: String,
    resetPasswordExpire: Number
}, { timestamps: true });

//                                                      ----------------------------------------------------
//                                                                       HASHING TECHNIQUES
//                                                      ----------------------------------------------------
// // --------------------------------------HASH THE Password BEFORE SAVING IN DB----------------------------------------
// // called before save() call
userSchema.pre('save', function (next) {
    const user = this;

    // if no modification done, dont SALT it
    if (!user.isModified('password')) {
        return next();
    }

    // SALT the password
    // if pass = "admin"
    // SALT will convert it into "adminsdbfjkhsdbkj"
    // 10 shows the length of random generated string
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        // hash the code with the SALT genereated earlier
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            // set the code as hashed from
            user.password = hash;
            next();
        })
    })
});

// // --------------------------------------COMPARE Password WITH HASHED FORM----------------------------------------
userSchema.methods.comparePassword = function (candidatePassword) {
    const user = this; //SALTed code inside mongoDB
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            // incase of error
            if (err) {
                return reject(err);
            }
            // incase passwords dont match
            if (!isMatch) {
                return reject(false);
            }
            // codes matched
            return resolve(true);
        });
    })
}

module.exports = mongoose.model("User", userSchema);