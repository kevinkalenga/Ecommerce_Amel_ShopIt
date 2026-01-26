import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
    // Crée un objet d'erreur
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal server error"
    };

    // CastError = mauvais format d'ID MongoDB
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        error = new ErrorHandler(message, 404);
    }

    // Erreur de validation Mongoose
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((value) => value.message);
        error = new ErrorHandler(message, 400);
    }

    // Erreur de duplication (email, nom, etc.)
    if (err.code === 11000) { // le code MongoDB pour duplication est 11000, pas 1000
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error = new ErrorHandler(message, 400);
    }

    // JWT invalide
    if (err.name === "JsonWebTokenError") {
        const message = "JSON Web Token is invalid. Try Again!";
        error = new ErrorHandler(message, 400);
    }

    // JWT expiré
    if (err.name === "TokenExpiredError") {
        const message = "JSON Web Token is expired. Try Again!";
        error = new ErrorHandler(message, 400);
    }

    // Environnement développement
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        return res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err.stack
        });
    }

    // Environnement production
    return res.status(error.statusCode).json({
        message: error.message
    });
};
