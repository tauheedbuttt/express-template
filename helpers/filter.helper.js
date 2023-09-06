const { default: mongoose } = require("mongoose");

module.exports = {
    filterOptions: (options, collection, aggregate = true) => {
        const filter = {};
        Object.keys(options).forEach((key) => {
            const value = options[key];
            if (!value) return;

            if (key == 'search') {
                if (!value?.value) return
                filter['$or'] = [
                    { id: { $regex: value.value, $options: 'i' } }
                ]
                value.fields.forEach((field) => {
                    if (field == '-id') {
                        filter['$or'] = filter['$or'].filter(item => !item.id)
                        return;
                    }
                    const temp = {};
                    const type = collection.prototype.schema.obj[field]?.type;
                    const number = isNaN(value.value) ? '' : Number(value.value)
                    temp[field] = (type && typeof type() == 'number')
                        ? number
                        : { $regex: value.value, $options: 'i' };
                    filter['$or'].push(temp)
                })
            }
            else if (key == 'range') {
                if ((value?.min || value?.max)) {
                    filter[value.field] = {
                        ...(
                            value.min
                                ? { $gte: parseInt(value.min) }
                                : {}
                        ),
                        ...(
                            value.max
                                ? { $lte: parseInt(value.max) }
                                : {}
                        ),
                    }
                }
            }
            else if (key == 'date') {
                const iso = value.value;
                if (!iso) return

                const start = new Date(iso);
                start.setUTCHours(0, 0, 0, 0);

                const end = new Date(start);
                end.setDate(end.getDate() + 1);
                start.setUTCHours(0, 0, 0, 0);

                const greater = {};
                const lesser = {};

                greater[value.field] = { '$gte': start };
                lesser[value.field] = { '$lt': end };

                filter['$and'] = [greater, lesser]
            }
            else filter[key] = value;
        })
        return filter
    },
}