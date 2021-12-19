const express = require('express');
const dbo = require('../db/conn');
const halls = express.Router();

halls.route('/saele').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const newHallToInsert = {
    nummer: req.body.nummer,
    sitzplaetze: req.body.sitzplaetze,
  };
  const uniques = new Set(
    newHallToInsert.sitzplaetze.map((item) =>
      (item.reihe + item.nummer).toLowerCase()
    )
  );

  if ([...uniques].length === newHallToInsert.sitzplaetze.length) {
    dbConnect
      .collection('saal')
      .insertOne(newHallToInsert, function (err, _result) {
        if (err) {
          res
            .status(400)
            .send(`Saal ${newHallToInsert.nummer} wurde bereits angelegt.`);
        } else {
          console.log(`Saal ${newHallToInsert.nummer} wurde angelegt.`);
          res.status(201).send();
        }
      });
  } else {
    res
      .status(400)
      .send(
        `Saal ${newHallToInsert.nummer} konnte nicht angelegt werden. Selber Sitz wurde mehrfach eingefuegt.`
      );
  }
});

halls.route('/saele/:nummer').delete((req, res) => {
  const dbConnect = dbo.getDb();
  const hallToDelete = { nummer: parseInt(req.params.nummer) };

  dbConnect.collection('saal').deleteOne(hallToDelete, function (err, _result) {
    if (err) {
      res
        .status(400)
        .send(`Saal ${hallToDelete.nummer} konnte nicht entfernt werden!`);
    } else {
      console.log(`Saal ${hallToDelete.nummer} wurde entfernt.`);
      res.status(204).send();
    }
  });
});

module.exports = halls;
