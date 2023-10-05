const routeCreator = require('./routeCreator');
const modelCreator = require('./modelCreator');
const controllerCreator = require('./controllerCreator');
const postmanCreator = require('./postmanCreator');
const validationCreator = require('./validationCreator');

// Get the route argument from the command line
const route = process.argv[2];

if (!route) {
    console.error('Please provide a route argument, e.g., "admin/jobs".');
    process.exit(1);
}

// Split the route string into parts using the slash as a delimiter
const routeParts = route.split('/');

// Extract the route file name (the last part of the route)
const routeFileName = routeParts.pop() + '.routes.js';

// Get the route name (capitalize the first letter)
const routeName = routeFileName.charAt(0).toUpperCase() + routeFileName.slice(1, -10); // Remove ".routes.js" and capitalize

routeCreator(routeParts, routeFileName, routeName);
controllerCreator(routeParts, routeFileName, routeName);
modelCreator(routeParts, routeFileName, routeName);
postmanCreator(routeParts, routeFileName, routeName, route);
validationCreator(routeParts, routeFileName, routeName, route);