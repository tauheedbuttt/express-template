const { storePlaces } = require("./places");
const { storeAuth } = require("./auth");

module.exports = {
    seed: () => {
        storePlaces();
        storeAuth();
    }
}