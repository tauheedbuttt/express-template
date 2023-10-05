const fs = require('fs');
const path = require('path');
const { Collection, Item, Request, res } = require('postman-collection');

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

router.get('/', jwtVerify, ${routeName}Controller.get${routeName})
router.post('/add', jwtVerify, ${routeName}Controller.add${routeName})
router.delete('/delete/:id', jwtVerify, ${routeName}Controller.delete${routeName})
router.put('/update/:id', jwtVerify, ${routeName}Controller.update${routeName})

module.exports = router
`;

const routeFilePath = path.join(routeFolderPath, routeFileName);
fs.writeFileSync(routeFilePath, routeContent);

// Create the new controller file with dynamic content
const controllerContent = `

module.exports = {
    get${routeName}: async (req, res) => {
        return res.success('${routeName} fetched successfully')
    },

    add${routeName}: async (req, res) => {
        return res.success('${routeName} added successfully')
    },

    update${routeName}: async (req, res) => {
        return res.success('${routeName} Updated Successfully)
    },

    delete${routeName}: async (req, res) => {
        return res.success('${routeName} deleted successfully)
    }
};
`;

const controllerFilePath = path.join(controllerFolderPath, `${routeName.toLowerCase()}.controller.js`);
fs.writeFileSync(controllerFilePath, controllerContent);

// Create a Postman Collection
const collection = new Collection({
    info: {
        name: routeName
    },
});

// Define the routes and their corresponding methods and descriptions
const routes = [
    {

        method: 'GET',
        path: `${route}`,
        description: `Get ${route}`,
        name: `Get ${routeName}`,
    },
    {

        method: 'POST',
        path: `${route}/add`,
        description: `Add ${route}`,
        name: `Add ${routeName}`,
    },
    {

        method: 'PUT',
        path: `${route}/update/:id`,
        description: `Update ${route}`,
        name: `Update ${routeName}`,
    },
    {

        method: 'DELETE',
        path: `${route}/delete/:id`,
        description: `Delete ${route}`,
        name: `Delete ${routeName}`,
    },
];

// Create folders for each route and add requests to the collection
for (const routeInfo of routes) {
    const { method, path, description, name } = routeInfo;

    const folderName = routeName;
    let folder = collection.items.find((item) => item.name === folderName);

    // If the folder doesn't exist, create it
    if (!folder) {
        folder = new Collection();
        folder.name = routeName;
        collection.items.add(folder);
    }

    const request = new Request({
        method,
        url: `{{BaseURL}}/${path}`,
        description,
    });
    request.url.query = [];

    const item = new Item({
        name,
        request,
    });

    folder.items.add(item);
}

// Export the Postman Collection to a JSON file
const postmanFolderPath = path.join(__dirname, '..', 'postman');
const postmanFilePath = path.join(postmanFolderPath, 'routes_collection.json');

createDirectories(postmanFolderPath);

fs.writeFileSync(postmanFilePath, JSON.stringify(collection.toJSON(), null, 2));


console.log(`Route created: ${routeFilePath}`);
console.log(`Controller created: ${controllerFilePath}`);
console.log(`Postman collection exported to: ${postmanFilePath}`);
