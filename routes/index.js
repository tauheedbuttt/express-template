const { welcome } = require("../controllers");

const router = require("express").Router();

router.get("/", welcome);

module.exports = router