const { check } = require("express-validator");

const documentValidator = () => {

  const types = ['CNIC', 'Passport']

  const cnic = (
    check("documentNumber")
      .if(check('documentType').equals('CNIC'))
      .notEmpty()
      .withMessage("CNIC cannot be empty.")
      .bail()
      .isNumeric()
      .withMessage("CNIC must have only numeric values")
      .bail()
      .isLength({ min: 13, max: 13 })
      .withMessage("CNIC has to be of 13 characters.")
      .bail()
  );

  const passport = (
    check("documentNumber")
      .if(check('documentType').equals('Passport'))
      .notEmpty()
      .withMessage("Passport cannot be empty.")
      .bail()
      .isLength({ min: 10, max: 10 })
      .withMessage("Passport has to be of 10 characters.")
      .bail()
  )

  return [
    check("documentType")
      .notEmpty()
      .withMessage("Document Type cannot be empty.")
      .isIn(types)
      .withMessage(`Document Type can only be ${types.join(', ')}.`),
    cnic,
    passport
  ]
}

exports.check = (method) => {
  switch (method) {
    case "login": {
      return [
        check("email")
          .notEmpty()
          .withMessage("Email address cannot be empty")
          .bail()
          .isEmail()
          .withMessage("Invalid email address")
          .bail()
          .normalizeEmail(),
        check("password")
          .notEmpty()
          .withMessage("Password cannot be empty"),
      ];
    }
    case "register": {
      return [
        check("name")
          .notEmpty()
          .withMessage("Name cannot be empty."),
        check("email")
          .notEmpty()
          .withMessage("Email address cannot be empty")
          .bail()
          .isEmail()
          .withMessage("Invalid email address")
          .bail()
          .normalizeEmail(),
        check("password")
          .notEmpty()
          .withMessage("Password cannot be empty")
          .bail()
          .isLength({ min: 6 })
          .withMessage("Password length should be greater than 6"),
        check("confirmPassword")
          .notEmpty()
          .withMessage("Confirm Password cannot be empty"),
      ];
    }
    case "forgotAccount": {
      return [
        check("email")
          .notEmpty()
          .withMessage("Email address cannot be empty")
          .bail()
          .isEmail()
          .withMessage("Invalid email address")
          .bail()
          .normalizeEmail(),
      ];
    }
    case "changePassword": {
      return [
        check("oldPassword")
          .notEmpty()
          .withMessage("Old Password cannot be empty"),
        check("password")
          .notEmpty()
          .withMessage("Password cannot be empty")
          .bail()
          .isLength({ min: 6 })
          .withMessage("Password length should be greater than 6"),
        check("confirmPassword")
          .notEmpty()
          .withMessage("Confirm Password cannot be empty"),
      ];
    }
  }
};
