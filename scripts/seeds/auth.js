const User = require("../../models/User");
const Role = require("../../models/Role");


module.exports = {
    storeAuth: async () => {
        const existingRole = await Role.findOne();
        var role = null;
        if (!existingRole) {
            role = await Role.create({
                "name": "Super Admin",
                "permissions": [],
                "deleted": false,
                "editable": false,
            })
        }

        const existingUser = await User.findOne();
        if (!existingUser) {
            const admin = await User.create({
                "_id": "652140837c3771d0bedc6ca7",
                "email": "test@test.com",
                "name": "Super Admin",
                "status": "Approved",
                "password": "$2b$10$YdEreojwCq2.FCvuz7tE2Ofh0GtWdF2b6W1m3PW2Uj2avF68dgHaa",
                "updatedAt": "2023-10-08T16:02:41.531Z",
                "deleted": false,
                "country": "6502dc77cccbb801093d5ee8",
                "image": "https://static.vecteezy.com/system/resources/previews/005/005/788/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg",
                role
            });
        }
    },
}