const error = (res, status, message, data, extra) => (
    res.status(status).json({
        success: false,
        message,
        data: data ? data : [],
        ...(extra ? extra : {})
    })
)

const responseHandler = (req, res, next) => {
    res.invalid = (message, data, extra) => error(res, 400, message, data, extra);
    res.auth = (message, data, extra) => error(res, 401, message, data, extra);
    res.forbidden = (message, data, extra) => error(res, 403, message, data, extra);
    res.notFound = (message, data, extra) => error(res, 404, message, data, extra);
    res.success = (message, data, extra) => res.status(200).json({
        success: true,
        message,
        data: data ? data : [],
        ...(extra ? extra : {})
    })
    next();
}

module.exports = { responseHandler };