// set environment
import * as dotenv from 'dotenv'
dotenv.config({path: `.env.${process.env.NODE_ENV || 'development'}`});

// initialize koa
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { ApplicationError } from './utils/errors.js';

const app = new Koa();

// routes
import indexRoutes from './index/route.js';
import movieRoutes from './movie/routes.js';
import genreRoutes from './genre/routes.js';

// setup error handling middleware
app.use(async (ctx, next) => {
    ApplicationError.setContext(ctx)
    await next()
})
app.use(bodyParser())
app.use(indexRoutes.routes());
app.use(movieRoutes.routes());
app.use(genreRoutes.routes());

const server = app.listen(process.env.PORT, () => {
    console.log(`Server listening on port: ${process.env.PORT}`);
}); 

export default server;