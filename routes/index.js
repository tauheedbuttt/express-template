const router = require("express").Router();
const fs = require("fs")
const path = require("path")

router.get("/", require("../controllers").welcome);

const routes = [];
function getRoutes(directory, baseUrl = "") {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const folderName = path.basename(filePath);
            getRoutes(filePath, `${baseUrl}/${folderName}`);
        } else if (file.endsWith(".routes.js")) {
            routes.push(`${baseUrl}/${file.replace(".routes.js", "")}`)
        }
    });
}

getRoutes(__dirname)

routes.forEach(route => {
    router.use(
        `/api${route}`,
        require(`./${route}.routes`)
    );
})
module.exports = router