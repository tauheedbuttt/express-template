
const Country = require('../models/Country');
const City = require('../models/City');

const { aggregate, mongoID } = require("../helpers/filter.helper");

module.exports = {
    getCountries: async (req, res) => {
        const { text, id } = req.query;

        const countries = await aggregate(Country, {
            pagination: req.query,
            sort: { name: 1 },
            filter: {
                _id: mongoID(id),
                search: {
                    value: text,
                    fields: [
                        'name'
                    ]
                }
            },
            pipeline: []
        });

        return res.success("Countries fetched successfully", countries);
    },

    getCities: async (req, res) => {
        const { text, country, id } = req.query;

        const cities = await aggregate(City, {
            pagination: req.query,
            sort: { name: 1 },
            filter: {
                _id: mongoID(id),
                country: mongoID(country),
                search: {
                    value: text,
                    fields: [
                        'name',

                    ]
                }
            },
            pipeline: []
        });

        return res.success("Cities fetched successfully", cities);
    },
};