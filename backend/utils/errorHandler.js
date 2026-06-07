class ErrorHandler extends Error {
    // super is the constructor of the parent class which is Error
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        
        // To get complete error stack
        Error.captureStackTrace(this, this.constructor)
    }
}

export default ErrorHandler;