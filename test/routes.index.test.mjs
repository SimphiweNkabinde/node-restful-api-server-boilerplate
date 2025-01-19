import { use, expect } from "chai";
import chaiHttp from 'chai-http';
const chai = use(chaiHttp);

// console.log(chai);


import server from '../src/index.js';

describe('routes: index', () => {
    
    describe('GET /', () => {
        it('should return json', (done) => {
            chai.request.execute(server)
            .get('/')
            .end((err, res) => {                
                expect(err).to.be.null;
                expect(res.status).to.equal(200);
                expect(res.type).to.equal('application/json');
                expect(res.body.status).to.equal('success');
                expect(res.body.message).to.equal('hello, world');
                done();
            })
        });
    });
});