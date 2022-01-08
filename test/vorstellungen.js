process.env.NODE_ENV = 'test';


let chai = require('chai');
let chaiHttp = require('chai-http');
const fetch = require('node-fetch');
let server = require('../server');
let should = chai.should();


let dbConnect = {};
let token = '';

chai.use(chaiHttp);


describe('Show', () => {
    before(done => {
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
    
    beforeEach((done) => {
        dbConnect
        .collection('film')
        .deleteMany(() => done());
    });
  

  describe('/PUT show', () => {
    it('it should GET all shows for a day of one hall', (done) => {
        const query = {
            "saalnummer": 1,
            "startzeit": "2022-08-01T00:00"
          }
      
        chai.request(server)
          .put('/vorstellungen')
          .send(query)
          .set('Authorization', 'Bearer ' + token)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
            done();
          });
    });
  });

  describe('/POST show', () => {
    it('it should POST a show', (done) => {
        const movie = {
            titel: "Spider-Man: No Way Home",
            vorstellungen: []
        }
        
        dbConnect
        .collection('film')
        .insertOne(movie, function (err, _result) {
          if (err) {
            throw new Error('No Db Connection');
          } else {
            const hall = {
                "nummer": 1,
                "sitzplaetze": [
                    {
                        "reihe": "A",
                        "nummer": 1,
                        "sitzart": "einzel",
                        "reserviert": false
                    },
                    {
                        "reihe": "A",
                        "nummer": 2,
                        "sitzart": "einzel",
                        "reserviert": false
                    }
                ]
              }
            
            dbConnect
            .collection('saele')
            .insertOne(hall, function (err, _result) {
              if (err) {
                throw new Error('No Db Connection');
              } else {
                chai.request(server)
                .post('/saele')
                .send(hall)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    if(!err) {
                        const show = {
                          "saal": 1,
                          "startzeit": "2050-12-15T15:00",
                          "film": "Spider-Man: No Way Home"
                        }
                      
                        chai.request(server)
                        .post('/vorstellungen')
                        .send(show)
                        .set('Authorization', 'Bearer ' + token)
                        .end((err, res) => {
                          res.status.should.be.oneOf([201, 400]);
                          done();
                      });
                    } else {
                        done(err);
                    }
                });
            }
            });
        }
        });
    });
  });

  describe('/DELETE/:saal/:startzeit show', () => {
    it('it should DELETE a show given the movie and starting time', (done) => {
        const movie = {
            titel: "Spider-Man: No Way Home",
            vorstellungen: [{
                startzeit: '2030-08-01T15:30',
                saal: 1
            }]
        }
        
        dbConnect
        .collection('film')
        .insertOne(movie, function (err, _result) {
          if (err) {
            throw new Error('No Db Connection');
          } else {
            const query = {
                film: 'Spider-Man: No Way Home'
            }

            chai.request(server)
            .delete(`/vorstellungen/${movie.vorstellungen[0].saal}/${movie.vorstellungen[0].startzeit}`)
            .send(query)
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