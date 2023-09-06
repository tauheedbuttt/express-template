const jwt = require("jsonwebtoken");
const response = require("../../helpers/response.helper");
const { handleDecodeErrors } = require("../../helpers/jwt.helper");

const jwtVerify = (req, res, next) => {
  const token = req.headers["Authorization"]?.replace("Bearer ", "");;
  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    async function (err, decoded) {
      if (err) return handleDecodeErrors(err)

      const { sub, iam, name } = decoded;
      next();
    }
  );
};

//exports
module.exports = {
  jwtVerify,
};
