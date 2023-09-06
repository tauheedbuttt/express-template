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
    case "profile": {
      return [
        check("email")
          .optional(true)
          .isEmail()
          .withMessage("Invalid email address")
          .normalizeEmail(),
        // check("password")
        //   .isLength({ min: 6 })
        //   .withMessage("Password must be atleast 6 chars long!"),
      ]
    }
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
      ];
    }
    case "register": {
      return [
        check("name")
          .notEmpty()
          .isString()
          .withMessage("Name cannot be empty."),
        check("email")
          .notEmpty()
          .withMessage("Email address cannot be empty")
          .bail()
          .isEmail()
          .withMessage("Invalid email address")
          .bail()
          .normalizeEmail(),
        check("phone")
          .notEmpty()
          .isString()
          .withMessage("Phone number is required"),
        check("dateOfJoining")
          .notEmpty()
          .isString()
          .withMessage("Date of Joining cannot be empty."),
        check("areaOfOperation")
          .notEmpty()
          .isString()
          .withMessage("Area of Operation cannot be empty."),
        ...documentValidator()
        // check("password")
        //   .notEmpty()
        //   .withMessage("Password cannot be empty")
        //   .bail()
        //   .isLength({ min: 7 })
        //   .withMessage("Password length should be greater than 6"),
        // check('gender').notEmpty().withMessage('Please select your gender.'),
        // check("designation")
        //   .notEmpty()
        //   .withMessage("Designation can not be empty."),
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
    case "updatePassword": {
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
          .withMessage(
            "Password cannot be empty"
          ) /*.isString().withMessage('New password must be string!')*/
          .bail()
          .isLength({ min: 6 })
          .withMessage("Password must be atleast 6 chars long!"),
        check("otp")
          .notEmpty()
          .withMessage("OTP cannot be empty")
          .bail()
          .isNumeric()
          .withMessage("OTP must be numeric")
          .bail()
          .isLength({
            min: 6,
            max: 6,
          })
          .withMessage("OTP must be 6 digits long!"),
      ];
    }
    case "bank": {
      return [
        check("bankName")
          .isString()
          .notEmpty()
          .withMessage("Bank Name cannot be empty."),
        check("accountTitle")
          .notEmpty()
          .isString()
          .withMessage("Account Title cannot be empty"),
        check("accountNumber")
          .notEmpty()
          .isNumeric()
          .withMessage("Account Number cannot be empty"),
        check("iban").notEmpty().isString().withMessage("IBAN cannot be empty"),
      ];
    }
    case "complaint": {
      return [
        check("project")
          .isString()
          .notEmpty()
          .withMessage("Project cannot be empty."),
        // check("issueDate")
        //   .isString()
        //   .notEmpty()
        //   .withMessage("Issue Date cannot be empty."),
        check("issueDetails")
          .isString()
          .notEmpty()
          .withMessage("Issue Details cannot be empty."),
      ];
    }
    case "document": {
      return [
        check("sale").notEmpty().isString().withMessage("Sale cannot be empty"),
      ];
    }
  }
};
