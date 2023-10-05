module.exports = {
    pageValues: (query, filter, collection) => {
        const limit = query.limit ? parseInt(query.limit) : 10;
        const page = query.page ? parseInt(query.page) : 1;
        const skip = page == 1 ? 0 : (limit * page - limit);

        return { page, limit, skip }
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