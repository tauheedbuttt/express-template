const { aggregate, mongoID } = require("../helpers/filter.helper.js");
const Jobs = require("../models/Jobs.js");

module.exports = {
    getJobs: async (req, res) => {
        const { id, text } = req.query;

        const jobs = await aggregate(Jobs, {
            pagination: req.query,
            filter: {
                _id: mongoID(id),
                search: {
                    value: text,
                    fields: ['name']
                }
            },
            pipeline: []
        });

        return res.success("Jobs fetched successfully", jobs)
    },

    addJobs: async (req, res) => {
        const { name } = req.body;

        const exists = await Jobs.findOne({ name });
        if (exists) return res.forbidden("Jobs already exists.");

        const jobs = await Jobs.create({
            name
        });

        return res.success("Jobs added successfully")
    },

    updateJobs: async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;

        const exists = await Jobs.findOne({ _id: { $ne: id }, name });
        if (exists) return res.forbidden("Jobs already exists.");

        const jobs = await Jobs.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );
        if (!jobs) return res.notFound("Jobs not found.");

        return res.success("Jobs Updated Successfully")
    },

    deleteJobs: async (req, res) => {
        const { id, deleted } = req.params;

        const jobs = await Jobs.findByIdAndUpdate(
            id,
            { deleted },
            { new: true }
        );
        if (!jobs) return res.notFound("Jobs not found.");
        
        return res.success(deleted ? "Jobs deleted successfully": "Jobs recovered successfully" )
    }
};
