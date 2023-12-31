const fs = require('fs');
const util = require('util');

// Convert readFile function to promise-based
const readFileAsync = util.promisify(fs.readFile);

// Function to read JSON file asynchronously
const readJSONFile = async (filename) => {
    try {
        const data = await readFileAsync(filename, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

module.exports = {
    readJSONFile,
}