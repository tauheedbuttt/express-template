const { storePlaces } = require("./places");

module.exports = {
    seed: () => {
        storePlaces();
    }
}