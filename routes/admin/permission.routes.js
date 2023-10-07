// Controllers
const PermissionController = require("../../controllers/admin/permission.controller");
const { jwtVerify } = require("../../middlewares/authentication/jwt.middleware");
const { validate } = require("../../validations/validator");
const { check } = require("../../validations//admin/permission.validation");

const router = require("express").Router();

router.get(
    '/',
    jwtVerify("Super Admin"),
    PermissionController.getPermission
)

router.post(
    '/add',
    jwtVerify("Super Admin"),
    validate(check('add')),
    PermissionController.addPermission
)

router.put(
    '/update/:id',
    jwtVerify("Super Admin"),
    validate(check('update')),
    PermissionController.updatePermission
)

router.delete(
    '/delete/:id',
    jwtVerify("Super Admin"),
    (req, res, next) => { req.params.deleted = true; next(); }
    , PermissionController.deletePermission
)

router.put(
    '/recover/:id',
    jwtVerify("Super Admin"),
    (req, res, next) => { req.params.deleted = false; next(); }
    , PermissionController.deletePermission
)

module.exports = router
