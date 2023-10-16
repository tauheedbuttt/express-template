const routeCreator = require('./routeCreator');
const modelCreator = require('./modelCreator');
const controllerCreator = require('./controllerCreator');
const postmanCreator = require('./postmanCreator');
const validationCreator = require('./validationCreator');

// Get the route argument from the command line
const route = process.argv[2];
const skipArgs = process.argv.filter(item => item.includes('--skip'))[0];

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

// Function to check if a creator should be skipped
function shouldSkip(creator) {
    return skipArgs?.includes(creator);
}

const creators = [
    {
        name: 'route',
        callback: () => routeCreator(routeParts, routeFileName, routeName)
    },
    {
        name: 'controller',
        callback: () => controllerCreator(routeParts, routeFileName, routeName)
    },
    {
        name: 'model',
        callback: () => modelCreator(routeParts, routeFileName, routeName)
    },
    {
        name: 'postman',
        callback: () => postmanCreator(routeParts, routeFileName, routeName, route)
    },
    {
        name: 'validation',
        callback: () => validationCreator(routeParts, routeFileName, routeName, route)
    }
]

creators.forEach((item) => {
    if (!shouldSkip(item.name))
        item.callback();
})