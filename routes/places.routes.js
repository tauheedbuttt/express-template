// Controllers
const PlacesController = require("../controllers/places.controller");

const router = require("express").Router();

router.get('/countries', PlacesController.getCountries)
router.get('/cities', PlacesController.getCities)

module.exports = router