import chaiHttp, { request } from 'chai-http';
import { expect, use } from 'chai';
import { after, afterEach, beforeEach, describe, it } from 'mocha';
import Knex from 'knex';
import knexConfig from '../knexfile.js';
import app from '../src/index.js';

use(chaiHttp);
const knex = Knex(knexConfig);
const server = app.listen();
const requester = await request.execute(server).keepOpen();

describe('routes: genres', () => {

    beforeEach(() => knex.migrate.rollback()
        .then(() => knex.migrate.latest())
        .then(() => knex.seed.run()));

    afterEach(() => knex.migrate.rollback());

    after(() => {
        requester.close();
    });

    describe('GET /api/v1/genres', () => {
        it('should return all genres', (done) => {
            requester
                .get('/api/v1/genres')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.data.length).to.equal(3);
                    expect(res.body.data[0]).to.include.keys('id', 'name');
                    done();
                });
        });
    });

    describe('GET /api/v1/genres/:id', () => {
        it('should return a single genre', (done) => {
            requester
                .get('/api/v1/genres/1')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.data).to.include.keys('id', 'name');
                    done();
                });
        });

        it('should return 404 error if the genre does not exist', (done) => {
            requester
                .get('/api/v1/genres/9999')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.equal(404);
                    expect(res.type).to.equal('application/json');
                    expect(res.body).to.include.keys('error');
                    done();
                });
        });
    });

    describe('POST /api/v1/genres', () => {
        it('should return the genre that was created', (done) => {
            requester
                .post('/api/v1/genres')
                .send({ name: 'comedy' })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.equal(201);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.data).to.include.keys('id', 'name');
                    done();
                });
        });
        it('should return 400 error if the payload is invalid', (done) => {
            requester
                .post('/api/v1/genres')
                .send({ type: 'new genre' })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('application/json');
                    expect(res.body).to.include.keys('error');
                    done();
                });
        });
        it('should return a 400 error if the genre name already exists', (done) => {
            knex('genres').select('name')
                .then((genres) => {
                    const [genre] = genres;
                    requester
                        .post('/api/v1/genres')
                        .send({ name: genre.name })
                        .end((err, res) => {
                            expect(err).to.be.null;
                            expect(res).to.have.status(400);
                            expect(res.type).to.equal('application/json');
                            expect(res.body).to.have.key('error');
                            done();
                        });
                });
        });
    });

    describe('PUT /api/v1/genres/:id', () => {
        it('should return the genre that was updated', (done) => {
            knex('genres').select('*')
                .then((genres) => {
                    const [genreObject] = genres;
                    requester
                        .put(`/api/v1/genres/${genreObject.id}`)
                        .send({ name: 'scifi/romance' })
                        .end((err, res) => {
                            expect(err).to.be.null;
                            expect(res.status).to.equal(200);
                            expect(res.type).to.equal('application/json');
                            expect(res.body.data).to.include.keys('id', 'name');
                            const updatedGenreObject = res.body.data;
                            expect(updatedGenreObject.name).to.not.equal(genreObject.name);
                            done();
                        });
                });
        });
        it('should return 404 error if the genre does not exist', (done) => {
            requester
                .put('/api/v1/genres/99999')
                .send({ name: 'scifi/romance' })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.equal(404);
                    expect(res.type).to.equal('application/json');
                    expect(res.body).to.include.keys('error');
                    done();
                });
        });
        it('should return a 400 error if the genre name already exists', (done) => {
            knex('genres').select('name', 'id')
                .then((genres) => {
                    const [genre1, genre2] = genres;
                    requester
                        .put(`/api/v1/genres/${genre2.id}`)
                        .send({ name: genre1.name })
                        .end((err, res) => {
                            expect(err).to.be.null;
                            expect(res).to.have.status(400);
                            expect(res.type).to.equal('application/json');
                            expect(res.body).to.have.key('error');
                            done();
                        });
                });
        });
    });

    describe('DELETE /api/v1/genres:id', () => {
        it('should return the genre that was deleted', (done) => {
            knex('genres').select('*')
                .then((genres) => {
                    const [genreObject] = genres;
                    const lengthBeforeDeletion = genres.length;
                    requester
                        .delete(`/api/v1/genres/${genreObject.id}`)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            expect(res.status).to.equal(200);
                            expect(res.type).to.equal('application/json');
                            expect(res.body.data).to.include.keys('id', 'name');
                            const deletedGenreObject = res.body.data;
                            expect(genreObject.id).to.equal(deletedGenreObject.id);

                            knex('genres').select('*')
                                .then((updatedGenres) => {
                                    expect(updatedGenres.length).to.equal(lengthBeforeDeletion - 1);
                                    done();
                                });

                        });
                });
        });
        it('should return 404 error if the genre does not exist', (done) => {
            requester
                .delete('/api/v1/genres/99999')
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
