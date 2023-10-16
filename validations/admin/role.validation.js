const { check } = require("express-validator");

exports.check = (method) => {
    switch (method) {
        case "add": {
            return [
                check("name")
                    .notEmpty()
                    .withMessage("Name cannot be empty"),
                check("permissions")
                    .notEmpty()
                    .withMessage("Permissions cannot be empty"),
            ];
        }
        case "update": {
            return [];
        }
    }
};    
