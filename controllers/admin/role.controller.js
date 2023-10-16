const { aggregate, mongoID } = require("../../helpers/filter.helper");
const Role = require("../../models/Role");
const Permission = require("../../models/Permission");

const validatePermission = async (permissions) => {
    if (!permissions || permissions?.length == 0) return "";

    // check if array of duplicate permissions is passed
    const duplicatePermissions = new Set(permissions.map(item => item.permission));
    if (duplicatePermissions.size != permissions.length)
        return "Duplicate permissions are not allowed.";

    // check if permissions provided exists
    const existingPermissions = await Permission
        .aggregate([
            {
                $match: {
                    _id: { $in: permissions.map(item => mongoID(item.permission)) }
                }
            },
            {
                $lookup: {
                    from: "actions",
                    localField: "_id",
                    foreignField: "permission",
                    as: "actions",
                    pipeline: [{ $project: { name: 1 } }]
                }
            }
        ])
    if (existingPermissions.length != permissions.length)
        return "One or more permissions do not exist.";

    // check if actions provided inside the permissions array exists
    for (const permission of existingPermissions) {
        const passedPermission = permissions?.find(item => permission._id.equals(item.permission))
        const actions = passedPermission.actions;
        const existingActions = actions?.filter(action => permission.actions.map(item => item._id.toString()).includes(action))
        if (existingActions?.length != actions.length)
            return "One or more actions do not exist for " + permission.name;
    }
}

module.exports = {
    getRole: async (req, res) => {
        const { id, text, deleted } = req.query;

        const role = await aggregate(Role, {
            pagination: req.query,
            filter: {
                _id: mongoID(id),
                deleted,
                search: {
                    value: text,
                    fields: ['name']
                }
            },
            pipeline: [
                {
                    $unwind: "$permissions"
                },
                {
                    $lookup: {
                        from: "permissions",
                        localField: "permissions.permission",
                        foreignField: "_id",
                        as: "permissions.permission",
                        pipeline: [
                            { $project: { name: 1, url: 1 } }
                        ]
                    }
                },
                {
                    $unwind: "$permissions.permission"
                },
                {
                    $lookup: {
                        from: "actions",
                        localField: "permissions.actions",
                        foreignField: "_id",
                        as: "permissions.actions",
                        pipeline: [
                            { $project: { name: 1 } }
                        ]
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        permissions: {
                            permission: "$permissions.permission",
                            actions: "$permissions.actions",
                        },
                        deleted: 1,
                        editable: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        __v: 1
                    }
                },
            ]
        });

        return res.success("Role fetched successfully", role)
    },

    addRole: async (req, res) => {
        const { name, permissions } = req.body;

        // check if duplicates are allowed
        const exists = await Role.findOne({ name });
        if (exists) return res.forbidden("Role already exists.");

        const message = await validatePermission(permissions);
        if (message) return res.forbidden(message);

        const role = await Role.create({
            name,
            permissions
        });

        return res.success("Role added successfully", role)
    },

    updateRole: async (req, res) => {
        const { id } = req.params;
        const { name, permissions } = req.body;

        const exists = await Role.findOne({ _id: { $ne: id }, name });
        if (exists) return res.forbidden("Role already exists.");

        const message = await validatePermission(permissions);
        if (message) return res.forbidden(message);

        const role = await Role.findByIdAndUpdate(
            id,
            { name, permissions },
            { new: true }
        );
        if (!role) return res.notFound("Role not found.");

        return res.success("Role Updated Successfully")
    },

    deleteRole: async (req, res) => {
        const { id, deleted } = req.params;

        const role = await Role.findByIdAndUpdate(
            id,
            { deleted },
            { new: true }
        );
        if (!role) return res.notFound("Role not found.");

        return res.success(deleted ? "Role deleted successfully" : "Role recovered successfully")
    }
};
