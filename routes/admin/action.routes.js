// Controllers
const ActionController = require("../../controllers/admin/action.controller");
const { jwtVerify } = require("../../middlewares/authentication/jwt.middleware");
const { validate } = require("../../validations/validator");
const { check } = require("../../validations//admin/action.validation");

const router = require("express").Router();

router.get(
    '/',
    jwtVerify("Super Admin"),
    ActionController.getAction
)

router.post(
    '/add',
    jwtVerify("Super Admin"),
    validate(check('add')),
    ActionController.addAction
)

router.put(
    '/update/:id',
    jwtVerify("Super Admin"),
    validate(check('update')),
    ActionController.updateAction
)

router.delete(
    '/delete/:id',
    jwtVerify("Super Admin"),
    (req, res, next) => { req.params.deleted = true; next(); }
    , ActionController.deleteAction
)

router.put(
    '/recover/:id',
    jwtVerify("Super Admin"),
    (req, res, next) => { req.params.deleted = false; next(); }
    , ActionController.deleteAction
)

module.exports = router
