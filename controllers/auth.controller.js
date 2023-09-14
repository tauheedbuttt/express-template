const crypto = require('crypto');
const User = require('../models/User');

const response = require('../helpers/response.helper');
const { createToken } = require('../helpers/jwt.helper');
const { uniqueQuery } = require('../helpers/filter.helper');
const { sendEmail } = require('../helpers/email-service.helper');
const { jwtVerify } = require("../middlewares/authentication/jwt.middleware");

module.exports = {
    profile: async (req, res) => {
        return response.success(res, 'Profile fetched successuflly', req.user)
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        // get user
        const user = await User.findOne({ email })
        if (!user) return response.forbidden(res, 'Invalid Email or Password');
        if (user.status != 'Approved') return response.forbidden(res, 'Your account has not been approved yet');

        try {
            // compare password
            await user.comparePassword(password);
        } catch (err) {
            return response.forbidden(res, 'Invalid Email or Password')
        }

        const token = createToken({
            sub: user.id,
            iam: user.role,
            name: user.name
        })

        return response.success(res, 'Login successfull', { token })
    },

    register: async (req, res) => {
        const {
            name,
            email,
            password,
            confirmPassword
        } = req.body;

        if (password != confirmPassword)
            return response.forbidden(res, 'Confirm Password is not same as Password.');

        const unique = [
            {
                field: 'name',
                value: name
            },
            {
                field: 'email',
                value: email
            },
        ]
        const uniqueResult = uniqueQuery(unique);

        const existing = await User.findOne({
            ...uniqueResult.query
        })
        if (existing) return response.forbidden(res, uniqueResult.message)

        const user = new User({
            name,
            email,
            password
        })

        await user.save();
        return response.success(res, 'Registration Successfull', user)
    },

    update: async (req, res) => {
        const { email, name } = req.body;

        const unique = [
            {
                field: 'name',
                value: name
            },
            {
                field: 'email',
                value: email
            },
        ]

        const user = req.user;
        const uniqueResult = uniqueQuery(unique);

        const existing = await User.findOne({
            _id: { $ne: user.id },
            ...uniqueResult.query
        })

        if (existing) return response.forbidden(res, uniqueResult.message)

        user.email = email ? email : user.email;
        user.name = name ? name : user.name;

        await user.save();

        return response.success(res, 'Profile updated successuflly', user)
    },

    forgot: async (req, res) => {
        const { email } = req.body;

        // check if user exists
        const user = await User.findOne({ email })
        if (!user) return response.forbidden(res, 'No account found against this email');

        // generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        const days = 10;
        user.resetPasswordExpire = Date.now() + (days * 60 * 1000);
        const url = `${process.env.CLIENT_ORIGIN}/reset?resetPasswordToken=${user.resetPasswordToken}`
        await user.save({ validateBeforeSave: false });

        await sendEmail("Reset Password", {
            email,
            url
        })

        response.success(res, 'Password reset link sent to email.')
    },

    reset: async (req, res) => {
        const { old_password, new_password, confirm_password, resetPasswordToken } = req.body;

        // validate inputs

        if (resetPasswordToken && old_password) return error(res, 'resetPasswordToken and old_password can not come at the same time');
        if (!new_password) return error(res, 'new_password is missing');
        if (!confirm_password) return error(res, 'confirm_password is missing');
        if (confirm_password != new_password) return error(res, 'confirm_password not same as new_password');

        // Normal Password Reset
        if (!resetPasswordToken) {
            if (!old_password) response.notFound(res, 'old_password is missing');
            return jwtVerify(req, res, async () => {
                try {
                    const user = await User.findById(req.user.id);
                    await user.comparePassword(old_password)
                    user.password = new_password
                    await user.save({ validateBeforeSave: false });
                    response.success(res, 'Password changed successfully.', { changed: true })
                } catch (err) {
                    response.forbidden(res, 'old_password is not same as current password')
                }
            })
        }

        // Forgot Password Reset
        if (!old_password) {
            if (!resetPasswordToken)
                return response.forbidden(res, 'resetPasswordToken is missing')
        }

        // check the resetPasswordToken
        const user = await User.findOne({ resetPasswordToken })
        if (!user) return response.notFound('Invalid reset token')

        // if the token is expired
        if (Date.now() > user.resetPasswordExpire)
            return response.forbidden(res, 'The token is expired')

        // update password and remove token
        user.password = new_password
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false });

        response.success(res, 'Password changed successfully.', { changed: true })
    }
};