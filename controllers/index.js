const response = require('../helpers/response.helper');

module.exports = {
    welcome: (req, res) => {
        return response.success(res, 'Hello World!')
    }
}