// Controllers
const AuthController = require("../controllers/auth.controller");

// Middlewares
const { jwtVerify } = require("../middlewares/authentication/jwt.middleware");

// Validators

const { check } = require("../validations/auth.validation");
const { validate } = require("../validations/validator");

const router = require("express").Router();

router.post(
    "/login",
    validate(check('login')),
    AuthController.login
);

router.post(
    "/register",
    validate(check('register')),
    AuthController.register
);

router.post(
    '/forgot',
    AuthController.forgot
)

router.get(
    "/profile",
    jwtVerify,
    AuthController.profile
);

router.put(
    "/update",
    jwtVerify,
    AuthController.update
);

router.put(
    '/forgot',
    AuthController.forgot
)

router.put(
    '/reset',
    AuthController.reset
)

module.exports = router
