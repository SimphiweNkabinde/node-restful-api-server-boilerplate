import Router from 'koa-router';
const router = new Router();
import movieController from './controller.js';
import { create as createMovieSchema, update as updateMovieSchema } from './schemas.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

const BASEURL = '/api/v1/movies';

router.get(BASEURL, async(ctx) => {
    try {
        const movies = await movieController.getAll();
        ctx.body = { data: movies };
    } catch (error) {
        console.log(error);
    }
});

router.get(`${BASEURL}/:id`, async(ctx) => {
    try {
        const movie = await movieController.getOne(ctx.params.id);
        if (movie === null) {
            return new NotFoundError('movie not found');
        }
        ctx.body = { data: movie };


    } catch (error) {
        console.log(error);
    }
});
router.post(BASEURL, async(ctx) => {
    // validation
    let strippedBody;
    try {
        // strip unknown fields to avoid COLUMN DOES NOT EXIST error from ORM query
        await createMovieSchema.validate(ctx.request.body, { stripUnknown: true })
            .then((value) => strippedBody = value);
    } catch (error) {
        return new ValidationError(error.message);
    }

    try {
        const movie = await movieController.create(strippedBody);
        ctx.status = 201;
        ctx.body = { data: movie[0] };
    } catch (error) {
        // UNIQUE CONSTRAINT VIOLATION error
        if (error.code === 23505) {
            return new ValidationError(error.detail);
        }
        if (error.code === 23503) {
            if (error.detail.includes('Key (genre_id)=')) {
                return new ValidationError('The specified genre does not exist');
            }
        }

        throw error;
    }
});

router.put(`${BASEURL}/:id`, async(ctx) => {
    // validation
    let strippedBody;
    try {
        // strip unknown fields to avoid COLUMN DOES NOT EXIST error from ORM query
        await updateMovieSchema.validate(ctx.request.body, { stripUnknown: true })
            .then((value) => strippedBody = value);
    } catch (error) {
        return new ValidationError(error.message);
    }
    try {
        const movie = await movieController.update(ctx.params.id, strippedBody);
        if (!movie.length) {
            return new NotFoundError('movie not found');
        }
        ctx.body = { data: movie[0] };

    } catch (error) {
        // UNIQUE CONSTRAINT VIOLATION error
        if (error.code === 23505) {
            return new ValidationError(error.detail);
        }
        if (error.code === 23503) {
            if (error.detail.includes('Key (genre_id)=')) {
                return new ValidationError('The specified genre does not exist');
            }
        }

        throw error;
    }
});

router.delete(`${BASEURL}/:id`, async(ctx) => {
    try {
        const movie = await movieController.remove(ctx.params.id);
        if (!movie.length) {
            return new NotFoundError('movie not found');
        }
        ctx.body = { data: movie[0] };

    } catch (error) {
        console.log(error);
    }
});

export default router;
