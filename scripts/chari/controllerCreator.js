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
    const controllerContent = `const { aggregate, mongoID } = require("${relativePath}/helpers/filter.helper");
const ${routeName} = require("${relativePath}/models/${routeName}");

module.exports = {
    get${routeName}: async (req, res) => {
        const { id, text, deleted } = req.query;

        const ${routeName.toLowerCase()} = await aggregate(${routeName}, {
            pagination: req.query,
            filter: {
                _id: mongoID(id),
                deleted,
                search: {
                    value: text,
                    fields: ['name']
                }
            },
            pipeline: []
        });

        return res.success("${routeName} fetched successfully", ${routeName.toLowerCase()})
    },

    add${routeName}: async (req, res) => {
        const { name } = req.body;

        const exists = await ${routeName}.findOne({ name });
        if (exists) return res.forbidden("${routeName} already exists.");

        const ${routeName.toLowerCase()} = await ${routeName}.create({
            name
        });

        return res.success("${routeName} added successfully")
    },

    update${routeName}: async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;

        const exists = await ${routeName}.findOne({ _id: { $ne: id }, name });
        if (exists) return res.forbidden("${routeName} already exists.");

        const ${routeName.toLowerCase()} = await ${routeName}.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );
        if (!${routeName.toLowerCase()}) return res.notFound("${routeName} not found.");

        return res.success("${routeName} Updated Successfully")
    },

    delete${routeName}: async (req, res) => {
        const { id, deleted } = req.params;

        const ${routeName.toLowerCase()} = await ${routeName}.findByIdAndUpdate(
            id,
            { deleted },
            { new: true }
        );
        if (!${routeName.toLowerCase()}) return res.notFound("${routeName} not found.");
        
        return res.success(deleted ? "${routeName} deleted successfully": "${routeName} recovered successfully" )
    }
};
`;

    const controllerFilePath = path.join(controllerFolderPath, `${routeName.toLowerCase()}.controller.js`);
    fs.writeFileSync(controllerFilePath, controllerContent);

    console.log(`Controller created: ${controllerFilePath}`);
}