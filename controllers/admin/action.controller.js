const { aggregate, mongoID } = require("../../helpers/filter.helper");
const Action = require("../../models/Action");

module.exports = {
    getAction: async (req, res) => {
        const { id, text, deleted } = req.query;

        const action = await aggregate(Action, {
            pagination: req.query,
            filter: {
                _id: mongoID(id),
                deleted,
                search: {
                    value: text,
                    fields: ['name']
                }
            },
            pipeline: []
        });

        return res.success("Action fetched successfully", action)
    },

    addAction: async (req, res) => {
        const { name } = req.body;

        const exists = await Action.findOne({ name });
        if (exists) return res.forbidden("Action already exists.");

        const action = await Action.create({
            name
        });

        return res.success("Action added successfully")
    },

    updateAction: async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;

        const exists = await Action.findOne({ _id: { $ne: id }, name });
        if (exists) return res.forbidden("Action already exists.");

        const action = await Action.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );
        if (!action) return res.notFound("Action not found.");

        return res.success("Action Updated Successfully")
    },

    deleteAction: async (req, res) => {
        const { id, deleted } = req.params;

        const action = await Action.findByIdAndUpdate(
            id,
            { deleted },
            { new: true }
        );
        if (!action) return res.notFound("Action not found.");
        
        return res.success(deleted ? "Action deleted successfully": "Action recovered successfully" )
    }
};
