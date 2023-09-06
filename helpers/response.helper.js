const error = (res, message, status) => (
    res.status(status).json({
        success: false,
        message,
        data: [],
    })
)

module.exports = {
    invalid: (res, message) => error(res, message, 400),
    auth: (res, message) => error(res, message, 401),
    forbidden: (res, message) => error(res, message, 403),
    notFound: (res, message) => error(res, message, 404),
    success: (res, message, data) => res.status(200).json({
        success: true,
        message: message,
        data: data ? data : [],
    })
}