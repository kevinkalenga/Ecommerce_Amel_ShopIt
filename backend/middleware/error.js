import ErrorHandler from "../utils/errorHandler.js"

export default (err, req, res, next) => {
    // Les erreurs contenant le statuscode

    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal server error"
    }

    res.status(error.statusCode).json({
        message: error.message
    })
}