module.exports = {
    preAggregate: function () {
        const field = {
            $addFields: { id: { $toString: '$_id' } }
        };
        this.pipeline().unshift(field);
    }
}