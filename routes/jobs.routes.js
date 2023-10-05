// Controllers
const JobsController = require("../controllers//jobs.controller");
const { jwtVerify } = require("../middlewares/authentication/jwt.middleware");

const router = require("express").Router();

router.get('/', jwtVerify, JobsController.getJobs)
router.post('/add', jwtVerify, JobsController.addJobs)
router.put('/update/:id', jwtVerify, JobsController.updateJobs)
router.delete(
    '/delete/:id',
    jwtVerify,
    (req, res, next) => { req.params.deleted = true; next(); }
    , JobsController.deleteJobs
)
router.put(
    '/recover/:id',
    jwtVerify,
    (req, res, next) => { req.params.deleted = false; next(); }
    , JobsController.deleteJobs
)

module.exports = router
