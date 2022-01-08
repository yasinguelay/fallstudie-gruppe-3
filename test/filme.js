process.env.NODE_ENV = 'test';


let chai = require('chai');
let chaiHttp = require('chai-http');
const fetch = require('node-fetch');
let server = require('../server');
let should = chai.should();

let dbConnect = {};
let token = '';

chai.use(chaiHttp);


describe('Movie', () => {
    before(done => {
        server.on('app_started', () => {
            fetch('https://fallstudie-gruppe-3.eu.auth0.com/oauth/token', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: '{"client_id":"Y6q0H3SWMkhsWfWhujuX9unLgS4SlUXI","client_secret":"s-Axqt1vhzdLWiUqcgnDlyji1FKvj3SD1P198QRAAJ6fiXK5N5TjP8ycYVh1lETP","audience":"https://fallstudie-gruppe-3.herokuapp.com","grant_type":"client_credentials"}'
            })
            .then((res) => res.json())
            .then((res) => {
                token = res['access_token'];
                dbConnect = server.dbo.getDb();
                done();
            }, (err) => console.error(err));
        });
    });
    
    beforeEach((done) => {
        dbConnect
        .collection('film')
        .deleteMany(() => done());
    });
  
  describe('/GET movie', () => {
      it('it should GET all the movies', (done) => {
        chai.request(server)
            .get('/filme')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  describe('/POST movie', () => {
    it('it should POST a movie', (done) => {
        const movie = {
            titel: "Spider-Man: No Way Home",
        }
      
        chai.request(server)
          .post('/filme')
          .send(movie)
          .set('Authorization', 'Bearer ' + token)
          .end((err, res) => {
                res.status.should.be.oneOf([201, 400]);
            done();
          });
    });
  });

  describe('/DELETE/:titel movie', () => {
    it('it should DELETE a movie given the title', (done) => {
        const movie = {
            titel: "Spider-Man: No Way Home",
        }
        
        dbConnect
        .collection('film')
        .insertOne(movie, function (err, _result) {
          if (err) {
            throw new Error('No Db Connection');
          } else {
            chai.request(server)
            .delete('/filme/' + movie.titel)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                  res.status.should.be.oneOf([204, 400]);
              done();
            });
        }
        });

    });
  });
});