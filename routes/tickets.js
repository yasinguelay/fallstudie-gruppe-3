const express = require('express');
const dbo = require('../db/conn');
const shows = express.Router();


shows.route('/vorstellungen')
  .post(async function (req, res) {
    const dbConnect = dbo.getDb();
    const movieToUpdate = {
      titel: req.body.film
    };

    const hall = await dbConnect
      .collection('saal')
      .findOne({
        nummer: req.body.saal
      });

    const newShowToInsert = {
      $push: {
        vorstellungen: {
          saal: req.body.saal,
          startzeit: req.body.startzeit,
          sitzplaetze: hall.sitzplaetze
        }
      }
    };

    dbConnect
      .collection('film')
      .updateOne(movieToUpdate, newShowToInsert, function (err, result) {
        if (err) {
          res.status(400).send('Error inserting show!');
        } else {
          console.log(`Added a new show`);
          res.status(204).send();
        }
      });
  });

  shows.route('/vorstellungen/:saal/:startzeit')
  .delete(function (req, res) {
    const dbConnect = dbo.getDb();
    const showToDelete = {
      $pull: {
        vorstellungen: {
          saal: parseInt(req.params.saal),
          startzeit: parseInt(req.params.startzeit)
        }
      }
    };

    dbConnect
      .collection('film')
      .updateOne({ titel: req.body.movie }, showToDelete, function (err, _result) {
        if (err) {
          res
            .status(400)
            .send(`Error deleting movie with name ${req.params.movie}!`);
        } else {
          console.log('Movie deleted');
          res.status(204).send();
        }
      });
  });


module.exports = shows;
