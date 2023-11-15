const jwt = require("jsonwebtoken");
const { handleDecodeErrors } = require("../../helpers/jwt.helper");
const User = require("../../models/User");

const jwtVerify = (socket, next) => {
    const token = socket.handshake?.query?.token;
    jwt.verify(
        token,
        process.env.JWT_SECRET_KEY,
        async function (err, decoded) {
            if (err) return handleDecodeErrors({ err, next });
            const { sub } = decoded;


            const user = await User
                .findOne({
                    _id: sub,
                    status: 'Approved'
                })
                .select('-password');

            if (!user) return next(new Error("Unauthorized"))


            next()
        }
    );
};

//exports
module.exports = {
    jwtVerify,
};
