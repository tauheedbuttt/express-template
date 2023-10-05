const fs = require('fs');
const path = require('path');

module.exports = (routeParts, routeFileName, routeName) => {
    // Define the base folder for controllers (outside the "scripts" folder)
    const controllersBaseFolder = path.join(__dirname, '..', 'controllers');

    // Calculate the relative path to controllers, middlewares, and constants based on the depth of the route
    const relativePath = Array(routeParts.length + 1).fill('..').join('/');

    const controllerFolderPath = path.join(controllersBaseFolder, ...routeParts);

    // Create the necessary directories recursively for both routes and controllers
    const createDirectories = (folderPath) => {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
    };

    createDirectories(controllerFolderPath);

    // Create the new controller file with dynamic content
    const controllerContent = `const ${routeName} = require("${relativePath}/models/${routeName}.js");

module.exports = {
    get${routeName}: async (req, res) => {
        return res.success("${routeName} fetched successfully")
    },

    add${routeName}: async (req, res) => {
        return res.success("${routeName} added successfully")
    },

    update${routeName}: async (req, res) => {
        return res.success("${routeName} Updated Successfully")
    },

    delete${routeName}: async (req, res) => {
        return res.success("${routeName} deleted successfully")
    }
};
`;

    const controllerFilePath = path.join(controllerFolderPath, `${routeName.toLowerCase()}.controller.js`);
    fs.writeFileSync(controllerFilePath, controllerContent);

    console.log(`Controller created: ${controllerFilePath}`);
}