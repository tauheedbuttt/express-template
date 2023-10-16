const fs = require('fs');
const path = require('path');

module.exports = (routeParts, routeFileName, routeName) => {
    // Define the base folder for routes (outside the "scripts" folder)
    const routesBaseFolder = path.join(__dirname, '..', 'routes');

    // Calculate the relative path to controllers, middlewares, and constants based on the depth of the route
    const relativePath = Array(routeParts.length + 1).fill('..').join('/');

    // Build the full path to the new route file
    const routeFolderPath = path.join(routesBaseFolder, ...routeParts);

    // Create the necessary directories recursively for both routes and controllers
    const createDirectories = (folderPath) => {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
    };

    createDirectories(routeFolderPath);

    // Create the new route file with dynamic content
    const routeContent = `// Controllers
const ${routeName}Controller = require("${relativePath}/controllers/${routeParts.join('/')}/${routeName.toLowerCase()}.controller");
const { jwtVerify } = require("${relativePath}/middlewares/authentication/jwt.middleware");
const { validate } = require("${relativePath}/validations/validator");
const { check } = require("${relativePath}/validations//${routeParts.join('/')}/${routeName.toLowerCase()}.validation");

const router = require("express").Router();

router.get(
    '/', 
    jwtVerify(), 
    ${routeName}Controller.get${routeName}
)

router.post(
    '/add', 
    jwtVerify(), 
    validate(check('add')), 
    ${routeName}Controller.add${routeName}
)

router.put(
    '/update/:id', 
    jwtVerify(), 
    validate(check('update')), 
    ${routeName}Controller.update${routeName}
)

router.delete(
    '/delete/:id',
    jwtVerify(),
    (req, res, next) => { req.params.deleted = true; next(); }
    , ${routeName}Controller.delete${routeName}
)

router.put(
    '/recover/:id',
    jwtVerify(),
    (req, res, next) => { req.params.deleted = false; next(); }
    , ${routeName}Controller.delete${routeName}
)

module.exports = router
`;

    const routeFilePath = path.join(routeFolderPath, routeFileName);
    fs.writeFileSync(routeFilePath, routeContent);

    console.log(`Route created: ${routeFilePath}`);
}
