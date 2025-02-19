class ApplicationError extends Error {
    static ctx = null;

    /**
     * Set the current Koa context before throwing an error.
     * @param {import("koa").Context} ctx context
     */
    static setContext(ctx) {
        this.ctx = ctx;
    }
    /**
     *
     * @param {number} status status code
     * @param {string} message the error message
     * @param {object} details error details
     */
    constructor(status = 500, message = 'Internal Server Error', details = {}) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);

        ApplicationError.ctx.status = this.status;
        const body = {
            error: {
                name: this.name,
                message,
                status: this.status,
                stack: process.env.NODE_ENV !== 'production' ? this.stack : undefined,
                details: this.details,
            },
        };
        if (this.details) body.error.details = this.details;
        ApplicationError.ctx.body = body;
    }
}

class ValidationError extends ApplicationError {
    constructor(message = 'Invalid request', errors = []) {
        super(400, message, errors.length ? { errors } : {});
    }
}

class NotFoundError extends ApplicationError {
    constructor(message = 'Entity Not found') {
        super(404, message);
    }
}

class ForbiddenError extends ApplicationError {
    constructor(message = 'Forbidden access') {
        super(403, message);
    }
}

class UnauthorizedError extends ApplicationError {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}

export {
    ValidationError,
    NotFoundError,
    ForbiddenError,
    UnauthorizedError,
    ApplicationError,
};
