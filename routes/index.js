// All Routes

const routes = [
    { to: 'auth', router: require('./auth.routes') },
]


const router = require("express").Router();

routes.forEach(route => router.use(`/api/${route.to}`, route.router))

router.get("/", require("../controllers").welcome);

module.exports = router