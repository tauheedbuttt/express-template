// Controllers
const ActionController = require("../../controllers/admin/action.controller");
const { jwtVerify } = require("../../middlewares/authentication/jwt.middleware");
const { validate } = require("../../validations/validator");
const { check } = require("../../validations//admin/action.validation");

const router = require("express").Router();

router.get(
    '/', 
    jwtVerify(), 
    ActionController.getAction
)

router.post(
    '/add', 
    jwtVerify(), 
    validate(check('add')), 
    ActionController.addAction
)

router.put(
    '/update/:id', 
    jwtVerify(), 
    validate(check('update')), 
    ActionController.updateAction
)

router.delete(
    '/delete/:id',
    jwtVerify(),
    (req, res, next) => { req.params.deleted = true; next(); }
    , ActionController.deleteAction
)

router.put(
    '/recover/:id',
    jwtVerify(),
    (req, res, next) => { req.params.deleted = false; next(); }
    , ActionController.deleteAction
)

module.exports = router
