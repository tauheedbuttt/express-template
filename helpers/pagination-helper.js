const paramsObjectParser = (obj) => {
    const fields = Object.keys(obj)
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                paramsObjectParser(obj[key], fields);
            } else if (fields.includes(key)) {
                obj[key] = parseInt(obj[key]);
            }
        }
    }
}
module.exports = {
    pageValues: (query, filter, collection) => {
        const limit = query.limit ? parseInt(query.limit) : 10;
        const page = query.page ? parseInt(query.page) : 1;
        const skip = page == 1 ? 0 : (limit * page - limit);
        let sort = query.sort;
        let fields = query.fields;
        if (sort) paramsObjectParser(sort);
        if (fields) paramsObjectParser(fields);

        return { page, limit, skip, sort, fields }
    },
    pageResponse: (items, page, limit, total) => {
        total = total ? total : 0;
        const pages = limit == 0 ? 1 : Math.ceil(total / limit);
        return ({
            items,
            page,
            limit,
            pages: (pages ? pages : 0),
            total
        })
    },
    aggregatePage: (page, limit, skip) => (
        {
            '$facet': {
                metadata: [{ $count: "total" }, { $addFields: { page } }],
                data: [{ $skip: skip }, ...(limit ? [{ $limit: limit }] : [])]
            }
        }
    ),
    paginate: (array, page, limit) => {
        return array ? array.slice(page * limit, page * limit + limit) : [];
    }
}