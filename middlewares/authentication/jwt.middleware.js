const jwt = require("jsonwebtoken");
const { handleDecodeErrors } = require("../../helpers/jwt.helper");
const User = require("../../models/User");

const jwtVerify = (req, res, next) => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");;
  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    async function (err, decoded) {
      if (err) return handleDecodeErrors({ err, res })

      const { sub, iam, name } = decoded;

      const user = await User
        .findOne({
          _id: sub,
          status: 'Approved'
        })
        .select('-password');

      if (!user) return res.auth('Unauthorized')

      req.user = user;

      next();
    }
  );
};

//exports
module.exports = {
  jwtVerify,
};
