const express = require('express');
const dbo = require('../db/conn');
const routes = express.Router();


routes.route('/filme')
  .get(async function (_req, res) {
    const dbConnect = dbo.getDb();

    dbConnect
      .collection('film')
      .find({})
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send('Error fetching listings!');
        } else {
          res.json(result);
        }
      });
  })
  .post(function (req, res) {
    const dbConnect = dbo.getDb();
    const matchDocument = {
      titel: req.body.titel,
      dauer: req.body.dauer
    };

    dbConnect
      .collection('film')
      .insertOne(matchDocument, function (err, result) {
        if (err) {
          res.status(400).send('Error inserting matches!');
        } else {
          console.log(`Added a new match with id ${result.insertedId}`);
          res.status(204).send();
        }
      });
  });
routes.route('/filme')
  .get(async function (_req, res) {
    const dbConnect = dbo.getDb();

    dbConnect
      .collection('film')
      .find({})
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send('Error fetching listings!');
        } else {
          res.json(result);
        }
      });
  })
  .post(function (req, res) {
    const dbConnect = dbo.getDb();
    const matchDocument = {
      titel: req.body.titel,
      dauer: req.body.dauer
    };

    dbConnect
      .collection('film')
      .insertOne(matchDocument, function (err, result) {
        if (err) {
          res.status(400).send('Error inserting matches!');
        } else {
          console.log(`Added a new match with id ${result.insertedId}`);
          res.status(204).send();
        }
      });
  });

routes.route('/filme/update').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const listingQuery = { titel: req.body.titel };
  const updates = {
    $set: {
      dauer: req.body.dauer,
    },
  };

  dbConnect
    .collection('film')
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating likes on listing with id ${listingQuery.id}!`);
      } else {
        console.log('1 document updated');
      }
    });
});

routes.route('/filme/delete').delete((req, res) => {
  const dbConnect = dbo.getDb();
  const listingQuery = { titel: req.body.titel };

  dbConnect
    .collection('film')
    .deleteOne(listingQuery, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error deleting listing with id ${listingQuery.listing_id}!`);
      } else {
        console.log('1 document deleted');
      }
    });
});


routes.route('/saele')
  .get(async function (_req, res) {
    const dbConnect = dbo.getDb();

    dbConnect
      .collection('saal')
      .find({})
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send('Error fetching listings!');
        } else {
          res.json(result);
        }
      });
  })
  .post(function (req, res) {
    const dbConnect = dbo.getDb();
    const matchDocument = {
      nummer: req.body.nummer,
      sitze: req.body.sitze
    };

    dbConnect
      .collection('saal')
      .insertOne(matchDocument, function (err, result) {
        if (err) {
          res.status(400).send('Error inserting matches!');
        } else {
          console.log(`Added a new match with id ${result.insertedId}`);
          res.status(204).send();
        }
      });
  });


/*   routes.route('/vorstellung')
  .get(async function (_req, res) {
    const dbConnect = dbo.getDb();
    const matchDocument = {}

    dbConnect
      .collection('film')
      .find({})
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send('Error fetching listings!');
        } else {
          res.json(result);
        }
      });
  })
  .post(function (req, res) {
    const dbConnect = dbo.getDb();
    const matchDocument = {
      nummer: req.body.nummer,
      sitze: req.body.sitze
    };

    dbConnect
      .collection('film')
      .insertOne(matchDocument, function (err, result) {
        if (err) {
          res.status(400).send('Error inserting matches!');
        } else {
          console.log(`Added a new match with id ${result.insertedId}`);
          res.status(204).send();
        }
      });
  }); */

module.exports = routes;
