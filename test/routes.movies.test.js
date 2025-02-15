import chaiHttp, { request } from 'chai-http';
import { should as chaiShould, use } from 'chai';
import app from '../src/index.js';
import knexConfig from '../knexfile.js';
import Knex from 'knex';
import { after, afterEach, beforeEach, describe, it } from 'mocha';
const should = chaiShould();

use(chaiHttp);
const knex = Knex(knexConfig);
const server = app.listen();
const requester = await request.execute(server).keepOpen();

describe('routes: movies', () => {

    beforeEach(() => knex.migrate.rollback()
        .then(() => knex.migrate.latest())
        .then(() => knex.seed.run()));

    afterEach(() => knex.migrate.rollback());

    after(() => {
        requester.close();
    });

    describe('GET /api/v1/movies', () => {
        it('should return all movies', (done) => {
            knex('movies').select()
                .then((movies) => {
                    requester
                        .get('/api/v1/movies')
                        .end((err, res) => {
                            should.not.exist(err);
                            should.exist(res);
                            res.should.have.status(200);
                            res.type.should.be.equal('application/json');
                            res.body.should.have.property('data');
                            res.body.data.should.be.an('array');
                            res.body.data.should.have.lengthOf(movies.length);
                            res.body.data.forEach((movie) => movie.should.have.all.keys('id', 'name', 'genre', 'rating', 'explicit', 'createdAt', 'updatedAt'));
                            res.body.data.forEach((movie) => movie.genre.should.have.all.keys('id', 'name'));
                            done();
                        });
                });
        });
    });

    describe('GET /api/v1/movies/:id', () => {
        it('should return a single movie', (done) => {
            knex('movies').select()
                .then((movie) => {
                    requester
                        .get(`/api/v1/movies/${movie[0].id}`)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(200);
                            res.type.should.be.equal('application/json');
                            res.body.should.have.property('data');
                            res.body.data.should.be.an('object');
                            res.body.data.should.have.all.keys('id', 'name', 'genre', 'rating', 'explicit', 'createdAt', 'updatedAt');
                            res.body.data.genre.should.have.all.keys('id', 'name');
                            done();
                        });
                });
            ;
        });
        it('should return 404 error if the movie does not exist', (done) => {
            requester
                .get('/api/v1/movies/99999')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(404);
                    res.type.should.be.equal('application/json');
                    res.body.should.have.property('error');
                    res.body.error.should.be.an('object');
                    res.body.error.should.have.all.keys('name', 'message', 'status', 'stack');
                    res.body.error.should.have.status(404);
                    res.body.error.name.should.equal('NotFoundError');
                    done();
                });
        });
    });

    describe('POST /api/v1/movies', () => {
        it('should return the movie that was created', (done) => {
            const payload = {
                name: 'Titanic',
                genre: 1,
                rating: 8,
                explicit: true,
            };
            requester
                .post('/api/v1/movies')
                .send(payload)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(201);
                    res.type.should.be.equal('application/json');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('object');
                    res.body.data.should.have.all.keys('id', 'name', 'genre', 'rating', 'explicit', 'createdAt', 'updatedAt');
                    res.body.data.name.should.equal(payload.name);
                    res.body.data.genre.should.equal(payload.genre);
                    res.body.data.rating.should.equal(payload.rating);
                    res.body.data.explicit.should.equal(payload.explicit);
                    done();
                });
        });
        it('should return 400 error if the payload is malformed', (done) => {
            requester
                .post('/api/v1/movies')
                .send({ name: 'Test movie name' })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(400);
                    res.type.should.be.equal('application/json');
                    res.body.should.have.property('error');
                    res.body.error.should.be.an('object');
                    res.body.error.should.have.all.keys('name', 'message', 'status', 'stack');
                    res.body.error.should.have.status(400);
                    res.body.error.name.should.equal('ValidationError');

                    requester
                        .post('/api/v1/movies')
                        .send({ name: 'Test movie name', explicit: false, rating: 3, genre: 999 })
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(400);
                            res.type.should.be.equal('application/json');
                            res.body.should.have.property('error');
                            res.body.error.should.be.an('object');
                            res.body.error.should.have.all.keys('name', 'message', 'status', 'stack');
                            res.body.error.should.have.status(400);
                            res.body.error.name.should.equal('ValidationError');

                            requester
                                .post('/api/v1/movies')
                                .send({ name: 'Test movie name', explicit: false, rating: -5, genre: 1 })
                                .end((err, res) => {
                                    should.not.exist(err);
                                    res.should.have.status(400);
                                    res.type.should.be.equal('application/json');
                                    res.body.should.have.property('error');
                                    res.body.error.should.be.an('object');
                                    res.body.error.should.have.all.keys('name', 'message', 'status', 'stack');
                                    res.body.error.should.have.status(400);
                                    res.body.error.name.should.equal('ValidationError');
                                    done();
                                });
                        });
                });
        });
        it('should return 400 error if the movie name already exists', (done) => {
            knex('movies').select('name')
                .then((movies) => {
                    const [movie] = movies;
                    requester
                        .post('/api/v1/movies')
                        .send({
                            name: movie.name,
                            explicit: false,
                            genre: 1,
                            rating: 4,
                        })
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(400);
                            res.type.should.be.equal('application/json');
                            res.body.should.have.property('error');
                            res.body.error.should.be.an('object');
                            res.body.error.should.have.all.keys('name', 'message', 'status', 'stack');
                            res.body.error.should.have.status(400);
                            res.body.error.name.should.equal('ValidationError');
                            done();
                        });
                });
        });
    });

    describe('PUT /api/v1/movies/:id', () => {
        it('should return the movie that was updated', (done) => {
            knex('movies').select('*')
                .then((movies) => {
                    const [movie1] = movies;
                    const payload = { rating: 9, name: 'test update movie name' };
                    requester
                        .put(`/api/v1/movies/${movie1.id}`)
                        .send(payload)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(200);
                            res.type.should.be.equal('application/json');
                            res.body.should.have.property('data');
                            res.body.data.should.be.an('object');
                            res.body.data.should.have.all.keys('id', 'name', 'genre', 'rating', 'explicit', 'createdAt', 'updatedAt');
                            res.body.data.id.should.equal(movie1.id);
                            const keysUpdated = Object.keys(payload);
                            keysUpdated.forEach((key) => res.body.data[key].should.equal(payload[key]));
                            done();
                        });
                });
        });
        it('should return 404 error if the movie does not exist', (done) => {
            requester
                .put('/api/v1/movies/99999')
                .send({ rating: 9 })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(404);
                    res.type.should.be.equal('application/json');
                    res.body.should.have.property('error');
                    res.body.error.should.be.an('object');
                    res.body.error.should.have.all.keys('name', 'message', 'status', 'stack');
                    res.body.error.should.have.status(404);
                    res.body.error.name.should.equal('NotFoundError');
                    done();
                });
        });
        it('should return 400 error if the movie name already exists', (done) => {
            knex('movies').select('name', 'id')
                .then((movies) => {
                    const [movie1, movie2] = movies;
                    requester
                        .put(`/api/v1/movies/${movie2.id}`)
                        .send({ name: movie1.name })
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(400);
                            res.type.should.be.equal('application/json');
                            res.body.should.have.property('error');
                            res.body.error.should.be.an('object');
                            res.body.error.should.have.all.keys('name', 'message', 'status', 'stack');
                            res.body.error.should.have.status(400);
                            res.body.error.name.should.equal('ValidationError');
                            done();
                        });
                });
        });
    });

    describe('DELETE /api/v1/movies/:id', () => {
        it('should return the movie that was deleted', (done) => {
            knex('movies').select('*')
                .then((movies) => {
                    const [movie1] = movies;
                    requester
                        .delete(`/api/v1/movies/${movie1.id}`)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(200);
                            res.type.should.be.equal('application/json');
                            res.body.should.have.property('data');
                            res.body.data.should.be.an('object');
                            res.body.data.should.have.all.keys('id', 'name', 'genre', 'rating', 'explicit', 'createdAt', 'updatedAt');
                            res.body.data.id.should.equal(movie1.id);
                            knex('movies')
                                .select()
                                .then((moviesAfterDelete) => {
                                    moviesAfterDelete.should.have.lengthOf(movies.length - 1);
                                    done();
                                });
                        });
                });
        });
        it('should return 404 error if the movie does not exist', (done) => {
            requester
                .delete('/api/v1/movies/99999')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(404);
                    res.type.should.be.equal('application/json');
                    res.body.should.have.property('error');
                    res.body.error.should.be.an('object');
                    res.body.error.should.have.all.keys('name', 'message', 'status', 'stack');
                    res.body.error.should.have.status(404);
                    res.body.error.name.should.equal('NotFoundError');
                    done();
                });
        });
    });

});
