const fs = require('fs');
const path = require('path');

module.exports = (routeParts, routeFileName, routeName) => {
    // Define the base folder for controllers (outside the "scripts" folder)
    const modelBaseFolder = path.join(__dirname, '..', 'models');

    // Build the full path to the new route file
    const modelFolderPath = path.join(modelBaseFolder);

    // Create the necessary directories recursively for both routes and controllers
    const createDirectories = (folderPath) => {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
    };

    createDirectories(modelFolderPath);

    // Create the new model file with dynamic content
    const modelsContent = `const mongoose = require("mongoose");
    
const ${routeName} = new mongoose.Schema({
    name: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('${routeName}', ${routeName});
    `;

    const modelsFilePath = path.join(modelFolderPath, `${routeName}.js`);
    fs.writeFileSync(modelsFilePath, modelsContent);

    console.log(`Model created: ${modelsFilePath}`);
}