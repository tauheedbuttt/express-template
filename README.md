# Express Template

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey)
![License](https://img.shields.io/badge/license-MIT-blue)

A boilerplate to kickstart an Express.JS project from scratch. It will provide you with multiple reusable features and won't have to rewrite the same boring code again.

## Table of Contents

- [Features](#Features)
- [Getting Started](#Getting-Started)
- [Dynamic Routing](#Dynamic-Routing)
- [Pagination and Filteration](#Pagination-and-Filteration)
- [Response Structure](#Response-Structure)
- [Contributing](#Contributing)
- [License](#License)

## Features

- Dynamic endpoint routing for flexible URL handling
- Functionality for dynamic endpoint creation
- Helper files for streamlined MongoDB queries and pagination
- Roles-based authentication for access control
- Multer and Nodemailer setup for file uploading and email functionality
- Socket.io for real-time communication
- Error handling middlewares for robust error management.
- Response structure middleware for consistent response formatting.
- Validation through express-validator for data validation and sanitization.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/tauheedbuttt/express-template.git
```

2. Install dependencies:

```bash
cd express-template
npm install
```

3. Start the server:

```bash
npm run dev
```

4. Visit http://localhost:5000 in your browser.

## Dynamic Routing

To create a dynamic route, follow these steps:

1. Open your command prompt or terminal.
2. Run the following command to generate the necessary files for your route:

```bash
npm run route admin/jobs
```

Here `admin/jobs` is the endpoint name. It will be called as `localhost:5000/api/admin/jobs`

It will have following CRUD endpoints:

| Method  | URL                       | Description            |
| ------- | ------------------------- | ---------------------- |
| `GET`   | `/admin/jobs`             | Retrieve all jobs.     |
| `POST`  | `/admin/jobs/add`         | Create a new job.      |
| `PUT`   | `/admin/jobs/update/:id`  | Update job by id.      |
| `DELTE` | `/admin/jobs/delete/:id`  | Delete job by id.      |
| `PUT`   | `/admin/jobs/recover/:id` | Undo Delete job by id. |

## Pagination and Filteration

Following code is used to query the MongoDB with pagination and filteration.

```javascript
const { id, text } = req.query;

const data = await aggregate(Model, {
  pagination: req.query,
  filter: {
    _id: mongoID(id),
    search: {
      value: text,
      fields: ["name"],
    },
  },
  pipeline: [],
});
```

The following object is an example for the value passed in in `pagination` field:

```javascript
{
    pagination:{
        page: 1,
        limit: 10
    },
}
```

The following object is an example for the value passed in in `filter` field:

```javascript
{
    // Search using this
    search:{
        value: value_to_be_searched,
        fields:[
            "name",
            "user.name",
            ...//other fields that will be searched on
        ]
    },

    // filter on the range provided
    range:{
        min: 20000,
        max: 30000,
        field: "price"
    }

    // filter on the date provided
    date:{
        value: new Date(),
        field: "createdAt"
    }

    //other filters
}
```

In the `pipeline` field, pass any pipeline that mongoose supports.
Only after that pipeline will the filters and pagination be applied

The following JSON object is an example response:

```json
{
    "items": [...],
    "page": 1,
    "limit": 10,
    "pages": 5,
    "total": 50
}
```

## Response Structure

You can use the following functions in the `res` object to send the response from the api.

```javascript
const controller = (req, res) => {
  res.invalid(message, data, extra);
  res.auth(message, data, extra);
  res.forbidden(message, data, extra);
  res.notFound(message, data, extra);
  res.success(message, data, extra);
};
```

Example response send to the use

```javascript
{
  "success": true, //if error response, this is false
  "message": "Done successfully",
  "data": []
  ...extra
}
```

## Contributing

Contributions are welcome! If you'd like to add new features, improve existing ones, or report issues, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
