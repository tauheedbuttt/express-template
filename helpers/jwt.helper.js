const response = require("./response.helper");

module.exports = {
    handleDecoderesponse: (err) => {
        if (err.name == "TokenExpiredError")
            return response.forbidden(res, "Your request is not authorized as your token is expired.")
        else if (err.name == "JsonWebTokenError")
            return response.forbidden(res, "Your request is not authorized as token is invalid.")
        else
            return response.forbidden(res, err)
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