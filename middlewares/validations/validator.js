const { validationResult } = require("express-validator");

module.exports = {
  validate: (validations) => {
    return async (req, res, next) => {
      await Promise.all(validations.map((validation) => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      var errorArray = new Array();
      errors.array().forEach((element) => {
        errorArray.unshift(element.msg);
      });

      return res
        .status(422)
        .json({ success: false, message: errorArray, data: [] });
    };
  },

  folder: (name) => {
    return async (req, res, next) => {
      req.folder = name;
      next();
    };
  },
};
