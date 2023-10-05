const Jobs = require("../models/Jobs.js");

module.exports = {
    getJobs: async (req, res) => {
        return res.success("Jobs fetched successfully")
    },

    addJobs: async (req, res) => {
        return res.success("Jobs added successfully")
    },

    updateJobs: async (req, res) => {
        return res.success("Jobs Updated Successfully")
    },

    deleteJobs: async (req, res) => {
        return res.success("Jobs deleted successfully")
    }
};
