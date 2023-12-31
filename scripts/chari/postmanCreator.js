const fs = require('fs');
const path = require('path');
const { Collection, Item, Request, res } = require('postman-collection');

module.exports = (routeParts, routeFileName, routeName, route) => {
    const postmanFolderPath = path.join(__dirname, '../..', 'postman');

    // Create the necessary directories recursively for both routes and controllers
    const createDirectories = (folderPath) => {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
    };
    createDirectories(postmanFolderPath);


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
            params: {
                page: 1,
                limit: 10,
                id: 0,
                deleted: false,
                text: "Test",
                'sort[createdAt]': -1,
                'fields[name]': 1,

            }
        },
        {

            method: 'POST',
            path: `${route}/add`,
            description: `Add ${route}`,
            name: `Add ${routeName}`,
            body: { name: "Test" }
        },
        {

            method: 'PUT',
            path: `${route}/update/:id`,
            description: `Update ${route}`,
            name: `Update ${routeName}`,
            body: { name: "Test" }
        },
        {

            method: 'DELETE',
            path: `${route}/delete/:id`,
            description: `Delete ${route}`,
            name: `Delete ${routeName}`,
        },
        {

            method: 'PUT',
            path: `${route}/recover/:id`,
            description: `Recover ${route}`,
            name: `Recover ${routeName}`
        },
    ];

    // Create folders for each route and add requests to the collection
    for (const routeInfo of routes) {
        const { method, path, description, name } = routeInfo;

        const folderName = routeName;
        let folder = collection.items.find((item) => item.name === folderName);

        // If the folder doesn't exist, create it
        if (!folder) {
            folder = new Collection({ name: routeName });
            collection.items.add(folder);
        }

        const body = {
            ...(!routeInfo.body ? {} : {
                mode: 'raw',
                raw: JSON.stringify(routeInfo.body)
            })
        }

        const request = new Request({
            method,
            url: `{{BaseURL}}/${path}`,
            description,
            body
        });
        request.url.query = [];
        if (routeInfo.params)
            request.url.query = Object.keys(routeInfo.params).map(key => ({ key, value: routeInfo.params[key] }))

        // if (routeInfo.params) {
        //     Object.keys(routeInfo.params).map(key => {
        //         request.url.query.add({ key, value: routeInfo.params[key] })
        //     })
        // }

        const item = new Item({
            name,
            request,
        });

        folder.items.add(item);
    }

    // Export the Postman Collection to a JSON file
    const postmanFilePath = path.join(postmanFolderPath, 'routes_collection.json');

    fs.writeFileSync(postmanFilePath, JSON.stringify(collection.toJSON(), null, 2));

    console.log(`Postman collection exported to: ${postmanFilePath}`);
}
