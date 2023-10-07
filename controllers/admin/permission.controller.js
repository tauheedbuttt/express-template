const { aggregate, mongoID } = require("../../helpers/filter.helper");
const Permission = require("../../models/Permission");

module.exports = {
    getPermission: async (req, res) => {
        const { id, text, deleted } = req.query;

        const permission = await aggregate(Permission, {
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

        return res.success("Permission fetched successfully", permission)
    },

    addPermission: async (req, res) => {
        const { name, actions, url } = req.body;

        const exists = await Permission.findOne({ name });
        if (exists) return res.forbidden("Permission already exists.");

        // check if duplicate array of strings in actions
        const duplicate = new Set(actions.map(action => action.toLowerCase()));
        if (duplicate.size != actions.length) return res.forbidden("Duplicate actions not allowed.");

        const permission = await Permission.create({
            name,
            actions,
            url
        });

        return res.success("Permission added successfully")
    },

    updatePermission: async (req, res) => {
        const { id } = req.params;
        const { name, actions, url } = req.body;

        const exists = await Permission.findOne({ _id: { $ne: id }, name });
        if (exists) return res.forbidden("Permission already exists.");

        if (actions?.length > 0) {
            // check if duplicate array of strings in actions
            const duplicate = new Set(actions.map(action => action.toLowerCase()));
            if (duplicate.size != actions.length) return res.forbidden("Duplicate actions not allowed.");
        }

        const permission = await Permission.findByIdAndUpdate(
            id,
            { name, actions, url },
            { new: true }
        );
        if (!permission) return res.notFound("Permission not found.");

        return res.success("Permission Updated Successfully")
    },

    deletePermission: async (req, res) => {
        const { id, deleted } = req.params;

        const permission = await Permission.findByIdAndUpdate(
            id,
            { deleted },
            { new: true }
        );
        if (!permission) return res.notFound("Permission not found.");

        return res.success(deleted ? "Permission deleted successfully" : "Permission recovered successfully")
    }
};
