function validationError(ctx, msg) {
    ctx.status = 400
    ctx.body = {
        data: null,
        error: {
            name: 'ValidationError',
            message: msg
        }
    }
}

function notFound(ctx, msg) {
    ctx.status = 404;
    ctx.body = { 
        data: null,
        error: {
            name: 'NotFoundError',
            message: msg
        }
    }
}

module.exports = {
    validationError,
    notFound
}