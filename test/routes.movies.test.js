import chaiHttp from 'chai-http';
import * as chaiModule from 'chai';
import { expect } from 'chai';

const chai = chaiModule.use(chaiHttp);

import server from '../src/index.js';
// initialize Knex
import knexConfig from '../knexfile.js';
import Knex from 'knex';
import { afterEach, beforeEach, describe, it } from 'mocha';
const knex = Knex(knexConfig);

describe('routes: movies', () => {

    beforeEach(() => knex.migrate.rollback()
        .then(() => knex.migrate.latest())
        .then(() => knex.seed.run()));

    afterEach(() => knex.migrate.rollback());
    describe('GET /api/v1/movies', () => {
        it('should return all movies', (done) => {
            chai.request.execute(server)
                .get('/api/v1/movies')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.data.length).to.equal(3);
                    expect(res.body.data[0]).to.include.keys('id', 'name', 'genre', 'rating', 'explicit');
                    expect(res.body.data[0].genre).to.include.keys('id', 'name');
                    done();
                });
        });
    });

    describe('GET /api/v1/movies/:id', () => {
        it('should return one movie', (done) => {
            chai.request.execute(server)
                .get('/api/v1/movies/1')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.data).to.include.keys('id', 'name', 'genre', 'rating', 'explicit');
                    expect(res.body.data.genre).to.include.keys('id', 'name');
                    done();
                });
        });
        it('should return a 404 response if the movie does not exist', (done) => {
            chai.request.execute(server)
                .get('/api/v1/movies/99999')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.equal(404);
                    expect(res.type).to.equal('application/json');
                    expect(res.body).to.include.keys('error');
                    done();
                });
        });
    });

    describe('POST /api/v1/movies', () => {
        it('should return the movie that was added', (done) => {
            chai.request.execute(server)
                .post('/api/v1/movies')
                .send({
                    name: 'Titanic',
                    genre: 1,
                    rating: 8,
                    explicit: true,
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.equal(201);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.data).to.include.keys('id', 'name', 'genre', 'rating', 'explicit');
                    done();
                });
        });
        it('should return an 400 response if the payload is invalid', (done) => {
            chai.request.execute(server)
                .post('/api/v1/movies')
                .send({ name: 'Titanic' })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('application/json');
                    expect(res.body).to.include.keys('error');
                    done();
                });
        });
    });

    describe('PUT /api/v1/movies/:id', () => {
        it('should return the movie that was updateed', (done) => {
            knex('movies').select('*')
                .then((movies) => {
                    const [movieObject] = movies;
                    chai.request.execute(server)
                        .put(`/api/v1/movies/${movieObject.id}`)
                        .send({ rating: 9 })
                        .end((err, res) => {
                            expect(err).to.be.null;
                            expect(res.status).to.equal(200);
                            expect(res.type).to.equal('application/json');
                            expect(res.body.data).to.include.keys('id', 'name', 'genre', 'rating', 'explicit');
                            const updatedMovieObject = res.body.data;
                            expect(updatedMovieObject.rating).to.not.equal(movieObject.rating);
                            done();
                        });
                });
        });
        it('should return a 404 response if the movie does not exist', (done) => {
            chai.request.execute(server)
                .put('/api/v1/movies/99999')
                .send({ rating: 9 })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.equal(404);
                    expect(res.type).to.equal('application/json');
                    expect(res.body).to.include.keys('error');
                    done();
                });
        });
    });

    describe('DELETE /api/v1/movies:id', () => {
        it('should return the movie that was deleted', (done) => {
            knex('movies').select('*')
                .then((movies) => {
                    const [movieObject] = movies;
                    const lengthBeforeDeletion = movies.length;
                    chai.request.execute(server)
                        .delete(`/api/v1/movies/${movieObject.id}`)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            expect(res.status).to.equal(200);
                            expect(res.type).to.equal('application/json');
                            expect(res.body.data).to.include.keys('id', 'name', 'genre', 'rating', 'explicit');
                            const deletedMovieObject = res.body.data;
                            expect(movieObject.id).to.equal(deletedMovieObject.id);

                            knex('movies').select('*')
                                .then((updatedMovies) => {
                                    expect(updatedMovies.length).to.equal(lengthBeforeDeletion - 1);
                                    done();
                                });

                        });
                });
        });
        it('should return a 404 response if the movie does not exist', (done) => {
            chai.request.execute(server)
                .delete('/api/v1/movies/99999')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.equal(404);
                    expect(res.type).to.equal('application/json');
                    expect(res.body).to.include.keys('error');
                    done();
                });
        });
    });

});
