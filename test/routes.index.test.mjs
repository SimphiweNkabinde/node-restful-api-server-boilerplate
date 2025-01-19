import { should, use } from "chai";
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
                should.not.exist(err);
                res.status.should.eql(200);
                res.type.should.eql('application/json');
                res.body.status.should.equal('success');
                res.body.message.should.eql('hello, world');
                done();
            })
        });
    });
});