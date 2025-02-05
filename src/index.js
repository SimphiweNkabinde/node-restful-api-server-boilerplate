// set environment
require('dotenv').config({path: `.env.${process.env.NODE_ENV || 'development'}`});

// initialize koa
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { ApplicationError } = require('./utils/errors.js');

const app = new Koa();

// routes
const indexRoutes = require('./index/route.js')
const moviesoutes = require('./movie/routes.js');

// setup error handling middleware
app.use(async (ctx, next) => {
    ApplicationError.setContext(ctx)
    await next()
})
app.use(bodyParser())
app.use(indexRoutes.routes());
app.use(moviesoutes.routes());

const server = app.listen(process.env.PORT, () => {
    console.log(`Server listening on port: ${process.env.PORT}`);
}); 

module.exports = server;