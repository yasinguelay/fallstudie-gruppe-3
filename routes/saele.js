const checkJwt = require('../middleware/authz.middleware');
const checkPermissions = require('../middleware/permissions.middleware');
const express = require('express');
const dbo = require('../db/conn');
const halls = express.Router();

halls
  .route('/saele')
  .post([checkJwt, checkPermissions('alter:cinema')], function (req, res) {
    // #swagger.tags = ['Saal']
    // #swagger.description = 'Saal anlegen.'

    /* #swagger.parameters['newHall'] = {
               in: 'body',
               description: 'Anzulegender Saal.',
               required: true,
               type: 'object',
               schema: { $ref: "#/definitions/SaalAnlegen" }
        } */

    /* #swagger.responses[201] */
    /* #swagger.responses[400] */

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
              .send(`Saal ${newHallToInsert.nummer} wurde bereits angelegt!`);
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

halls
  .route('/saele/:nummer')
  .delete([checkJwt, checkPermissions('alter:cinema')], (req, res) => {
    // #swagger.tags = ['Saal']
    // #swagger.description = 'Saal löschen.'

    const dbConnect = dbo.getDb();
    const hallToDelete = { nummer: parseInt(req.params.nummer) };

    dbConnect
      .collection('saal')
      .deleteOne(hallToDelete, function (err, _result) {
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
