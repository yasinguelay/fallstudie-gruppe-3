const express = require('express');
const dbo = require('../db/conn');
const halls = express.Router();


halls.route('/saele')
  .post(function (req, res) {
    const dbConnect = dbo.getDb();
    const newHallToInsert = { 
      nummer: req.body.nummer,
      sitzplaetze: req.body.sitzplaetze
    };
    const uniques = new Set(newHallToInsert.sitzplaetze.map(item => (item.reihe + item.nummer).toLowerCase()));

    if ([...uniques].length === newHallToInsert.sitzplaetze.length) {
      dbConnect
        .collection('saal')
        .insertOne(newHallToInsert, function (err, result) {
          if (err) {
            res.status(400).send('Hall already exists!');
          } else {
            console.log(`Added a new hall with number ${newHallToInsert.nummer}`);
            res.status(201).send();
          }
        });
    } else {
      res.status(400).send('Error: Same seat inserted twice!');
    } 

  });

halls.route('/saele/:nummer')
  .delete((req, res) => {
    const dbConnect = dbo.getDb();
    const hallToDelete = {
      nummer: parseInt(req.params.nummer)
    };

    dbConnect
      .collection('saal')
      .deleteOne(hallToDelete, function (err, _result) {
        if (err) {
          res
            .status(400)
            .send(`Error deleting hall with number ${req.params.nummer}!`);
        } else {
          console.log('Hall deleted');
          res.status(204).send();
        }
      });
  });


module.exports = halls;
