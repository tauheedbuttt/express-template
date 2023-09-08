const jwt = require("jsonwebtoken");
const response = require("../../helpers/response.helper");
const { handleDecoderesponse } = require("../../helpers/jwt.helper");

const jwtVerify = (socket, next) => {
    const token = socket.handshake?.query?.token;
    jwt.verify(
        token,
        process.env.JWT_SECRET_KEY,
        async function (err, decoded) {
            if (err) return handleDecoderesponse({ err, next });
            const { sub } = decoded;
            next()
        }
    );
};

//exports
module.exports = {
    jwtVerify,
};
