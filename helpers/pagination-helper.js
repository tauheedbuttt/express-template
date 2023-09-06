module.exports = {
    pageValues: async (query, filter, collection, pipeline) => {
        const limit = query.limit ? parseInt(query.limit) : 10;
        const page = query.page ? parseInt(query.page) : 1;
        const skip = page == 1 ? 0 : (limit * page - limit);

        const count = await collection.count(filter);
        const pages = limit == 0 ? 1 : Math.ceil(count / limit);
        const values = { limit, page, skip, pages, count };
        return values
    },
    pageResponse: (items, page, limit, pages, total) => {
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