const { default: mongoose } = require("mongoose");
const { pageValues, aggregatePage, pageResponse } = require("./pagination-helper");

const filterOptions = (options, collection) => {
    const filter = {};
    Object.keys(options).forEach((key) => {
        const value = options[key];
        if (value == null || value != undefined) return;

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
}
const uniqueQuery = (unique) => {
    const query = unique
        .map(item => {
            if (!item.value) return null;
            const query = {};
            query[`${item.field}`] = item.value
            return query;
        })
        .filter(item => item);

    const message = `Account already exists for this ${unique
        .filter(item => item.value)
        .map(item => item.field)
        .join('/')
        }`;

    return {
        query: query.length == 0 ? {} : { '$or': query },
        message
    }
}
const mongoID = (id) => {
    return mongoose.Types.ObjectId.isValid(id)
        ? new mongoose.Types.ObjectId(id)
        : undefined
}

const aggregate = async (model, options) => {
    const filter = filterOptions(options.filter, model);
    const { limit, page, skip, pages, count } = await pageValues(options.pagination, filter, model);
    const data = await model.aggregate([
        ...(options.pipeline ? options.pipeline : []),
        {
            $match: { ...filter, deleted: false }
        },
        {
            $sort: { _id: -1 }
        },
        aggregatePage(page, limit, skip)
    ]);
    return pageResponse(data[0].data, page, limit, pages, count);
}

const find = async (model, options) => {
    const filter = filterOptions(options.filter, model);
    const { limit, page, skip, pages, count } = await pageValues(options.pagination, filter, model);
    const data = await model.find(filter).skip(skip).limit(limit).sort('-id').populate(options.populate)
    return pageResponse(data, page, limit, pages, count);
}

module.exports = {
    aggregate,
    find,
    uniqueQuery,
    mongoID
}