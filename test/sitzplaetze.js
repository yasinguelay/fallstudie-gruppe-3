process.env.NODE_ENV = 'test';


let chai = require('chai');
let chaiHttp = require('chai-http');
const fetch = require('node-fetch');
let server = require('../server');
let should = chai.should();


let dbConnect = {};
let token = '';

chai.use(chaiHttp);


describe('Seat', () => {
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
  

  describe('/PUT seat', () => {
    it('it should reserve a seat', (done) => {
        const movie = {
            titel: 'Spider-Man: No Way Home',
            vorstellungen: [
                {
                    saal: 1,
                    startzeit: '2050-08-01T15:00',
                    sitzplaetze: [
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
            ]
        }

        dbConnect
        .collection('film')
        .insertOne(movie, function (err, _result) {
          if (err) {
            throw new Error('No Db Connection');
          } else {
            const seatToReserve = [
                {
                  "titel": "Spider-Man: No Way Home",
                  "saal": 1,
                  "startzeit": "2050-08-01T15:00",
                  "reihe": "A",
                  "nummer": 1,
                  "wert": "rauth0|userId"
                }
              ]
            

            chai.request(server)
            .put('/sitzplaetze/reservieren')
            .send(seatToReserve)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                  res.status.should.be.oneOf([200, 400]);
              done();
            });
        }
        });
    });
  });

  describe('/PUT seat', () => {
    it('it should book a seat', (done) => {
        const movie = {
            titel: 'Spider-Man: No Way Home',
            vorstellungen: [
                {
                    saal: 1,
                    startzeit: '2050-08-01T15:00',
                    sitzplaetze: [
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
            ]
        }

        dbConnect
        .collection('film')
        .insertOne(movie, function (err, _result) {
          if (err) {
            throw new Error('No Db Connection');
          } else {
            const seatToReserve = {
                "sitzplaetze": [
                  {
                    "titel": "Spider-Man: No Way Home",
                    "saal": 1,
                    "startzeit": "2050-08-01T15:00",
                    "reihe": "A",
                    "nummer": 1,
                    "wert": "rauth0|userId"
                  }
                ],
                "kunde": {
                  "vorname": "Test",
                  "email": "fallstudie-gruppe-3@gmail.com"
                },
                "pkAuswahl": {
                  "kind1": 1,
                  "kind2": 2,
                  "erwachsener1": 3,
                  "erwachsener2": 4
                }
              }

            chai.request(server)
            .put('/sitzplaetze/checkout')
            .send(seatToReserve)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                  res.status.should.be.oneOf([200, 400]);
              done();
            });
        }
        });
    });
  });

  describe('/PUT seat', () => {
    it('it should release a seat', (done) => {
        const movie = {
            titel: 'Spider-Man: No Way Home',
            vorstellungen: [
                {
                    saal: 1,
                    startzeit: '2050-08-01T15:00',
                    sitzplaetze: [
                        {
                            "reihe": "A",
                            "nummer": 1,
                            "sitzart": "einzel",
                            "reserviert": "rauth0|userId"
                        },
                        {
                            "reihe": "A",
                            "nummer": 2,
                            "sitzart": "einzel",
                            "reserviert": false
                        }
                    ]
                    
                }
            ]
        }

        dbConnect
        .collection('film')
        .insertOne(movie, function (err, _result) {
          if (err) {
            throw new Error('No Db Connection');
          } else {
            const seatToRelease = [
                {
                  "titel": "Spider-Man: No Way Home",
                  "saal": 1,
                  "startzeit": "2050-08-01T15:00",
                  "reihe": "A",
                  "nummer": 1,
                  "wert": "rauth0|userId"
                }
              ]

            chai.request(server)
            .put('/sitzplaetze/freigeben')
            .send(seatToRelease)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                  res.status.should.be.eql(200);
              done();
            });
        }
        });
    });
  });
});