class ApplicationError extends Error {
    static ctx = null;
    
    /**
     * Set the current Koa context before throwing an error.
     * @param {import("koa").Context} ctx context
     */
    static setContext(ctx) {
        this.ctx = ctx
    }
    /**
     * 
     * @param {number} status status code
     * @param {string} message the error message
     */
    constructor(status, message) {
        super(message);
        this.status = status
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)

        ApplicationError.ctx.status = this.status
        ApplicationError.ctx.body = {
            error: {
                name: this.name,
                message,
                stack: process.env.NODE_ENV !== "production" ? this.stack : undefined
            }
        }
    }
}

class ValidationError extends ApplicationError {
    constructor(message = "Invalid request") {
        super(400, message);
    }
}

class NotFoundError extends ApplicationError {
    constructor(message = "Entity Not found") {
        super(404, message);
    }
}

class ForbiddenError extends ApplicationError {
    constructor(message = "Forbidden access") {
        super(403, message)
    }
}

class UnauthorizedError extends ApplicationError {
    constructor(message = "Unauthorized") {
        super(401, message)
    }
}

module.exports = {
    ValidationError,
    NotFoundError,
    ForbiddenError,
    UnauthorizedError,
    ApplicationError 
}