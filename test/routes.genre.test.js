import chaiHttp, { request } from 'chai-http';
import { should as chaiShould, use } from 'chai';
import { after, afterEach, beforeEach, describe, it } from 'mocha';
import Knex from 'knex';
import knexConfig from '../knexfile.js';
import app from '../src/index.js';
const should = chaiShould();

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
            knex('genres').select()
                .then((genres) => {
                    requester
                        .get('/api/v1/genres')
                        .end((err, res) => {
                            should.not.exist(err);
                            should.exist(res);
                            res.should.have.status(200);
                            res.type.should.be.equal('application/json');
                            res.body.should.have.property('data');
                            res.body.data.should.be.an('array');
                            res.body.data.should.have.lengthOf(genres.length);
                            res.body.data.forEach((genre) => genre.should.have.all.keys('id', 'name', 'createdAt', 'updatedAt'));
                            done();
                        });
                });

        });
    });

    describe('GET /api/v1/genres/:id', () => {
        it('should return a single genre', (done) => {
            requester
                .get('/api/v1/genres/1')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.type.should.be.equal('application/json');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('object');
                    res.body.data.should.have.all.keys('id', 'name', 'createdAt', 'updatedAt');
                    done();
                });
        });

        it('should return 404 error if the genre does not exist', (done) => {
            requester
                .get('/api/v1/genres/9999')
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

    describe('POST /api/v1/genres', () => {
        it('should return the genre that was created', (done) => {
            const payload = { name: 'test genre' };
            requester
                .post('/api/v1/genres')
                .send(payload)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(201);
                    res.type.should.be.equal('application/json');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('object');
                    res.body.data.should.have.all.keys('id', 'name', 'createdAt', 'updatedAt');
                    res.body.data.name.should.equal(payload.name);
                    done();
                });
        });
        it('should return 400 error if the payload is malformed', (done) => {
            requester
                .post('/api/v1/genres')
                .send({ type: 'new genre' })
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
                        .post('/api/v1/genres')
                        .send({ name: ' ' })
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
                                .post('/api/v1/genres')
                                .send({ name: null })
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

        it('should return 400 error if the genre name already exists', (done) => {
            knex('genres').select('name')
                .then((genres) => {
                    const [genre] = genres;
                    requester
                        .post('/api/v1/genres')
                        .send({ name: genre.name })
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

    describe('PUT /api/v1/genres/:id', () => {
        it('should return the genre that was updated', (done) => {
            knex('genres').select('*')
                .then((genres) => {
                    const [genre1] = genres;
                    const payload = { name: 'test update genre name' };
                    requester
                        .put(`/api/v1/genres/${genre1.id}`)
                        .send(payload)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(200);
                            res.type.should.be.equal('application/json');
                            res.body.should.have.property('data');
                            res.body.data.should.be.an('object');
                            res.body.data.should.have.all.keys('id', 'name', 'createdAt', 'updatedAt');
                            res.body.data.id.should.equal(genre1.id);
                            const keysUpdated = Object.keys(payload);
                            keysUpdated.forEach((key) => res.body.data[key].should.equal(payload[key]));
                            done();
                        });
                });
        });
        it('should return 404 error if the genre does not exist', (done) => {
            requester
                .put('/api/v1/genres/99999')
                .send({ name: 'scifi/romance' })
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
        it('should return 400 error if the genre name already exists', (done) => {
            knex('genres').select('name', 'id')
                .then((genres) => {
                    const [genre1, genre2] = genres;
                    requester
                        .put(`/api/v1/genres/${genre2.id}`)
                        .send({ name: genre1.name })
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

    describe('DELETE /api/v1/genres:id', () => {
        it('should return the genre that was deleted', (done) => {
            knex('genres').select('*')
                .then((genres) => {
                    const [genre1] = genres;
                    requester
                        .delete(`/api/v1/genres/${genre1.id}`)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(200);
                            res.type.should.be.equal('application/json');
                            res.body.should.have.property('data');
                            res.body.data.should.be.an('object');
                            res.body.data.should.have.all.keys('id', 'name', 'createdAt', 'updatedAt');
                            res.body.data.id.should.equal(genre1.id);
                            knex('genres')
                                .select()
                                .then((genresAfterDelete) => {
                                    genresAfterDelete.should.have.lengthOf(genres.length - 1);
                                    done();
                                });

                        });
                });
        });
        it('should return 404 error if the genre does not exist', (done) => {
            requester
                .delete('/api/v1/genres/99999')
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
