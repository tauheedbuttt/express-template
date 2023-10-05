const jwt = require("jsonwebtoken");

module.exports = {
    handleDecodeErrors: ({ err, res, next }) => {
        if (err.name == "TokenExpiredError")
            return next
                ? next(new Error("Your request is not authorized as your token is expired."))
                : res.forbidden("Your request is not authorized as your token is expired.")
        else if (err.name == "JsonWebTokenError")
            return next
                ? next(new Error("Your request is not authorized as token is invalid."))
                : res.forbidden("Your request is not authorized as token is invalid.")
        else
            return next
                ? next(new Error(err))
                : res.forbidden(err)
    },

    createToken: (data) => {
        const token = jwt.sign(
            data,
            process.env.JWT_SECRET_KEY,
            { expiresIn: "30d" }
        );
        return token;
    }
}