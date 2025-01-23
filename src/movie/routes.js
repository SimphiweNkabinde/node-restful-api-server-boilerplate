const Router = require('koa-router');
const router = new Router();
const movieController = require('./controller.js');
const { create: createMovieSchema, update: updateMovieSchema } = require('./schemas.js');
const { validationError, notFound } = require('../utils/errorResponse.js');

const BASEURL = '/api/v1/movies';

router.get(BASEURL, async (ctx) => {
    try {
        const movies = await movieController.getAll();
        ctx.body = {
            data: movies
        }
    } catch (error) {
        console.log(error);
    }
})

router.get(`${BASEURL}/:id`, async (ctx) => {
    try {
        const movie = await movieController.getOne(ctx.params.id)
        if (!movie.length) {
            notFound(ctx, 'movie not found');
        } else {
            ctx.body = {data: movie[0]}
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
        await createMovieSchema.validate(ctx.request.body, { stripUnknown: true })
        .then(value => strippedBody = value);
    } catch (error) {
        return validationError(ctx, error.message);
    }

    try {
        const movie = await movieController.create(strippedBody);
        ctx.status = 201;
        ctx.body = { data: movie[0] };
    } catch (error) {
        // UNIQUE CONSTRAINT VIOLATION error
        if (error.code == 23505)
            return validationError(ctx, error.detail)
        
        throw error;
    }
})

router.put(`${BASEURL}/:id`, async (ctx) => {
    // validation
    let strippedBody;
    try {
        //strip unknown fields to avoid COLUMN DOES NOT EXIST error from ORM query
        await updateMovieSchema.validate(ctx.request.body, { stripUnknown: true })
        .then(value => strippedBody = value);
    } catch (error) {
        return validationError(ctx, error.message);
    }
    try {
        const movie = await movieController.update(ctx.params.id, strippedBody);
        if (!movie.length) {
            notFound(ctx, 'movie not found');
        } else {
            ctx.body = {data: movie[0]}
        }
    } catch (error) {
        // UNIQUE CONSTRAINT VIOLATION error
        if (error.code == 23505)
            return validationError(ctx, error.detail)
        
        throw error;
    }
})

router.delete(`${BASEURL}/:id`, async (ctx) => {
    try {
        const movie = await movieController.remove(ctx.params.id)
        if (!movie.length) {
            notFound(ctx, 'movie not found');
        } else {
            ctx.body = {data: movie[0]}
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;