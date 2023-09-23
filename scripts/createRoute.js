const fs = require('fs');
const path = require('path');

// Get the route argument from the command line
const route = process.argv[2];

if (!route) {
    console.error('Please provide a route argument, e.g., "admin/jobs".');
    process.exit(1);
}

// Define the base folder for routes (outside the "scripts" folder)
const routesBaseFolder = path.join(__dirname, '..', 'routes');
// Define the base folder for controllers (outside the "scripts" folder)
const controllersBaseFolder = path.join(__dirname, '..', 'controllers');
// Define the base folder for helpers (outside the "scripts" folder)
const helpersBaseFolder = path.join(__dirname, '..', 'helpers');

// Split the route string into parts using the slash as a delimiter
const routeParts = route.split('/');

// Extract the route file name (the last part of the route)
const routeFileName = routeParts.pop() + '.routes.js';

// Calculate the relative path to controllers, middlewares, and helpers based on the depth of the route
const relativePath = Array(routeParts.length + 1).fill('..').join('/');
const controllersRelativePath = `${relativePath}/controllers`;
const helpersRelativePath = `${relativePath}/helpers`;

// Get the route name (capitalize the first letter)
const routeName = routeFileName.charAt(0).toUpperCase() + routeFileName.slice(1, -10); // Remove ".routes.js" and capitalize

// Build the full path to the new route file
const routeFolderPath = path.join(routesBaseFolder, ...routeParts);
const controllerFolderPath = path.join(controllersBaseFolder, ...routeParts);

// Create the necessary directories recursively for both routes and controllers
const createDirectories = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

createDirectories(routeFolderPath);
createDirectories(controllerFolderPath);

// Create the new route file with dynamic content
const routeContent = `// Controllers
const ${routeName}Controller = require("${controllersRelativePath}/${routeParts.join('/')}/${routeName.toLowerCase()}.controller");
const { jwtVerify } = require("${relativePath}/middlewares/authentication/jwt.middleware");

const router = require("express").Router();

router.get('/', jwtVerify, ${routeName}Controller.get${routeName}s)
router.post('/add', jwtVerify, ${routeName}Controller.add${routeName})
router.delete('/delete/:id', jwtVerify, ${routeName}Controller.delete${routeName})
router.put('/update/:id', jwtVerify, ${routeName}Controller.update${routeName})

module.exports = router
`;

const routeFilePath = path.join(routeFolderPath, routeFileName);
fs.writeFileSync(routeFilePath, routeContent);

// Create the new controller file with dynamic content
const controllerContent = `const response = require("${helpersRelativePath}/response.helper");

module.exports = {
    get${routeName}s: async (req, res) => {
        return response.success(
            res,
            '${routeName}s fetched successfully',
        )
    },

    add${routeName}: async (req, res) => {
        return response.success(
            res,
            '${routeName}s fetched successfully',
        )
    },

    update${routeName}: async (req, res) => {
        return response.success(
            res,
            '${routeName} Updated Successfully'
        )
    },

    delete${routeName}: async (req, res) => {
        return response.success(
            res,
            '${routeName} deleted successfully'
        )
    }
};
`;

const controllerFilePath = path.join(controllerFolderPath, `${routeName.toLowerCase()}.controller.js`);
fs.writeFileSync(controllerFilePath, controllerContent);

console.log(`Route created: ${routeFilePath}`);
console.log(`Controller created: ${controllerFilePath}`);
