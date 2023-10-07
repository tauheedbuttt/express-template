// Controllers
const RoleController = require("../../controllers/admin/role.controller");
const { jwtVerify } = require("../../middlewares/authentication/jwt.middleware");
const { validate } = require("../../validations/validator");
const { check } = require("../../validations//admin/role.validation");

const router = require("express").Router();

router.get(
    '/',
    jwtVerify("Super Admin"),
    RoleController.getRole
)

router.post(
    '/add',
    jwtVerify("Super Admin"),
    validate(check('add')),
    RoleController.addRole
)

router.put(
    '/update/:id',
    jwtVerify("Super Admin"),
    validate(check('update')),
    RoleController.updateRole
)

router.delete(
    '/delete/:id',
    jwtVerify("Super Admin"),
    (req, res, next) => { req.params.deleted = true; next(); }
    , RoleController.deleteRole
)

router.put(
    '/recover/:id',
    jwtVerify("Super Admin"),
    (req, res, next) => { req.params.deleted = false; next(); }
    , RoleController.deleteRole
)

module.exports = router
