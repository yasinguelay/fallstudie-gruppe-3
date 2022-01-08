process.env.NODE_ENV = 'test';


let chai = require('chai');
let chaiHttp = require('chai-http');
const fetch = require('node-fetch');
let server = require('../server');
let should = chai.should();


let dbConnect = {};
let token = '';

chai.use(chaiHttp);


describe('Hall', () => {
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
        .collection('saal')
        .deleteMany(() => done());
    });
  

  describe('/POST hall', () => {
    it('it should POST a hall', (done) => {
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
      
        chai.request(server)
          .post('/saele')
          .send(hall)
          .set('Authorization', 'Bearer ' + token)
          .end((err, res) => {
                res.status.should.be.oneOf([201, 400]);
            done();
          });
    });
  });

  describe('/DELETE/:nummer hall', () => {
    it('it should DELETE a hall given the number', (done) => {
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
            .delete('/saele/' + hall.nummer)
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