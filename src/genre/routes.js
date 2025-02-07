const Router = require('koa-router');
const router = new Router();
const genreController = require('./controller.js');
const { create: createGenreSchema, update: updateGenreSchema } = require('./schemas.js');
const { ValidationError, NotFoundError } = require('../utils/errors.js');

const BASEURL = '/api/v1/genres';

router.get(BASEURL, async (ctx) => {
    try {
        const genres = await genreController.getAll();
        ctx.body = {
            data: genres
        }
    } catch (error) {
        console.log(error);
    }
})

router.get(`${BASEURL}/:id`, async (ctx) => {
    try {
        const genre = await genreController.getOne(ctx.params.id)
        if (!genre.length) {
            return new NotFoundError('genre not found');
        } else {
            ctx.body = {data: genre[0]}
        }

    } catch (error) {
        console.log(error);
    }
})
router.post(BASEURL, async (ctx) => {
    // validation
    let strippedBody;
    try {
        //strip unknown fields to avoid COLUMN DOES NOT EXIST error from ORM query
        await createGenreSchema.validate(ctx.request.body, { stripUnknown: true })
        .then(value => strippedBody = value);
    } catch (error) {
        return new ValidationError(error.message)
    }

    try {
        const genre = await genreController.create(strippedBody);
        ctx.status = 201;
        ctx.body = { data: genre[0] };
    } catch (error) {
        // UNIQUE CONSTRAINT VIOLATION error
        if (error.code == 23505) {
            return new ValidationError(error.detail)
        }
        
        throw error;
    }
})

router.put(`${BASEURL}/:id`, async (ctx) => {
    // validation
    let strippedBody;
    try {
        //strip unknown fields to avoid COLUMN DOES NOT EXIST error from ORM query
        await updateGenreSchema.validate(ctx.request.body, { stripUnknown: true })
        .then(value => strippedBody = value);
    } catch (error) {
        return new ValidationError(error.message);
    }
    try {
        const genre = await genreController.update(ctx.params.id, strippedBody);
        if (!genre.length) {
            return new NotFoundError('genre not found');
        } else {
            ctx.body = {data: genre[0]}
        }
    } catch (error) {
        // UNIQUE CONSTRAINT VIOLATION error
        if (error.code == 23505)
            return new ValidationError(error.detail)
        
        throw error;
    }
})

router.delete(`${BASEURL}/:id`, async (ctx) => {
    try {
        const genre = await genreController.remove(ctx.params.id)
        if (!genre.length) {
            return new NotFoundError('genre not found');
        } else {
            ctx.body = {data: genre[0]}
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;