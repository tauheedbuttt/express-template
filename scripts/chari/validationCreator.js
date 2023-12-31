const fs = require('fs');
const path = require('path');

module.exports = (routeParts, routeFileName, routeName) => {
    // Define the base folder for validations (outside the "scripts" folder)
    const validationsBaseFolder = path.join(__dirname, '../..', 'validations');

    // Calculate the relative path to validations based on the depth of the route
    const relativePath = Array(routeParts.length + 1).fill('..').join('/');

    // Build the full path to the new validation file
    const validationFolderPath = path.join(validationsBaseFolder, ...routeParts);

    // Create the necessary directories recursively for validations
    const createDirectories = (folderPath) => {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
    };

    createDirectories(validationFolderPath);

    // Create the new validation file with dynamic content
    const validationContent = `const { check } = require("express-validator");

exports.check = (method) => {
    switch (method) {
        case "add": {
            return [
                check("name")
                    .notEmpty()
                    .withMessage("Name cannot be empty"),
            ];
        }
        case "update": {
            return [];
        }
    }
};    
`;

    const validationFilePath = path.join(validationFolderPath, `${routeName.toLowerCase()}.validation.js`);
    fs.writeFileSync(validationFilePath, validationContent);

    console.log(`Validation created: ${validationFilePath}`);
};
