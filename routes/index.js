const router = require("express").Router();
const fs = require("fs")

router.get("/", require("../controllers").welcome);

const routes = fs.readdirSync(__dirname)
    .filter((file) => file.indexOf(".") !== 0 && file.includes('routes'))
    .map(item => item.split('.routes.js')[0])

routes.forEach(route => router.use(
    `/api/${route}`,
    require(`./${route}.routes`)
))
module.exports = router