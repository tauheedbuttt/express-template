const jwt = require("jsonwebtoken");
const response = require("./response.helper");

module.exports = {
    handleDecodeErrors: ({ err, res, next }) => {
        if (err.name == "TokenExpiredError")
            return next
                ? next(new Error("Your request is not authorized as your token is expired."))
                : response.forbidden(res, "Your request is not authorized as your token is expired.")
        else if (err.name == "JsonWebTokenError")
            return next
                ? next(new Error("Your request is not authorized as token is invalid."))
                : response.forbidden(res, "Your request is not authorized as token is invalid.")
        else
            return next
                ? next(new Error(err))
                : response.forbidden(res, err)
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