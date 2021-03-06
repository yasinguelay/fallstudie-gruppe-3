const checkJwt = require('../middleware/authz.middleware');
const checkPermissions = require('../middleware/permissions.middleware');
const express = require('express');
const dbo = require('../db/conn');
const shows = express.Router();

shows
  .route('/vorstellungen')
  .put(function (req, res) {
    // #swagger.tags = ['Vorstellung']
    // #swagger.description = 'Vorstellungen für einen Tag abrufen.'
    /* #swagger.requestBody = {
               required: true,
               content: {
                 "application/json": {
                   schema: { $ref: "#/definitions/VorstellungenAbrufen" }
                 }
                }
        } */
    /* #swagger.responses[200] = { 
               content: {
                 "application/json": {
                   schema: { $ref: "#/definitions/Vorstellungen" }
                 }
               }
        } */

    const dbConnect = dbo.getDb();
    const queryPipeline = [
      {
        $unwind: '$vorstellungen',
      },
      {
        $match: {
          'vorstellungen.saal': req.body.saalnummer,
          'vorstellungen.startzeit': {
            $gte: req.body.startzeit.substring(0, 10),
          },
        },
      },
      {
        $sort: {
          'vorstellungen.startzeit': 1,
        },
      },
      {
        $addFields: {
          startzeit: '$vorstellungen.startzeit',
        },
      },
      {
        $project: {
          _id: 0,
          titel: 1,
          startzeit: 1,
        },
      },
    ];

    dbConnect
      .collection('film')
      .aggregate(queryPipeline)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send('Fehler beim Abrufen der Vorstellungen!');
        } else {
          res.json(result);
        }
      });
  })
  .post(
    [checkJwt, checkPermissions('alter:cinema')],
    async function (req, res) {
      // #swagger.tags = ['Vorstellung']
      // #swagger.description = 'Vorstellung anlegen.'
      /* #swagger.requestBody = {
               required: true,
               content: {
                 "application/json": {
                   schema: { $ref: "#/definitions/VorstellungAnlegen" }
                 }
                }
        } */

      // #swagger.security = [{bearerAuth: []}]

      const dbConnect = dbo.getDb();
      const cinemaOpeningTime = '12:30';
      const cinemaClosingTime = '23:30';
      const breakAfterShow = 10;
      const movieToUpdate = {
        titel: req.body.film,
      };

      const projection = [
        { $unwind: '$vorstellungen' },
        {
          $match: {
            'vorstellungen.saal': req.body.saal,
            'vorstellungen.startzeit': {
              $gte: req.body.startzeit.substring(0, 10),
            },
          },
        },
        { $sort: { 'vorstellungen.startzeit': -1 } },
        { $addFields: { startzeit: '$vorstellungen.startzeit' } },
        { $project: { _id: 0, dauer: 1, startzeit: 1 } },
      ];

      let film, hall;

      try {
        film = await dbConnect.collection('film').findOne(movieToUpdate);

        hall = await dbConnect.collection('saal').findOne({
          nummer: req.body.saal,
        });
      } catch (e) {
        res.status(400).send('Vorstellung konnte nicht angelegt werden!');
      }

      const newShowToInsert = {
        $push: {
          vorstellungen: {
            saal: req.body.saal,
            startzeit: req.body.startzeit,
            sitzplaetze: hall.sitzplaetze,
          },
        },
      };

      let sameDaySameHallShows;

      try {
        sameDaySameHallShows = await dbConnect
          .collection('film')
          .aggregate(projection)
          .toArray();
      } catch (e) {
        res.status(400).send('Vorstellung konnte nicht angelegt werden!');
        return;
      }

      const newShowStartTime = new Date(req.body.startzeit);
      const newShowEndTime = new Date(
        newShowStartTime.getTime() + 60000 * (film.dauer + breakAfterShow)
      );
      const toLocaleTimeStringLimitation = [
        'de-DE',
        { hour: '2-digit', minute: '2-digit' },
      ];

      if (
        newShowEndTime.toLocaleTimeString(...toLocaleTimeStringLimitation) >
          cinemaClosingTime ||
        newShowStartTime.toLocaleTimeString(...toLocaleTimeStringLimitation) <
          cinemaOpeningTime
      ) {
        res
          .status(400)
          .send(
            'Vorstellung kann nicht ausserhalb der Öffnungszeiten angelegt werden!'
          );
      } else if (sameDaySameHallShows.length === 0) {
        dbConnect
          .collection('film')
          .updateOne(movieToUpdate, newShowToInsert, function (err, _result) {
            if (err) {
              res.status(400).send('Fehler beim Anlegen der Vorstellung!');
            } else {
              console.log(`Vorstellung wurde angelegt.`);
              res.status(201).send();
            }
          });
      } else {
        for (const [index, value] of sameDaySameHallShows.entries()) {
          const previousShowEndTime = new Date(
            new Date(value.startzeit).getTime() +
              60000 * (value.dauer + breakAfterShow)
          );
          const nextShowStartTime =
            index === 0
              ? null
              : new Date(sameDaySameHallShows[index - 1].startzeit);

          if (
            (newShowStartTime >= previousShowEndTime &&
              nextShowStartTime === null) ||
            (newShowStartTime >= previousShowEndTime &&
              newShowEndTime <= nextShowStartTime) ||
            (newShowEndTime <= new Date(value.startzeit) &&
              index === sameDaySameHallShows.length - 1)
          ) {
            dbConnect
              .collection('film')
              .updateOne(
                movieToUpdate,
                newShowToInsert,
                function (err, _result) {
                  if (err) {
                    res
                      .status(400)
                      .send('Fehler beim Anlegen der Vorstellung!');
                  } else {
                    console.log(`Vorstellung wurde angelegt.`);
                    res.status(201).send();
                  }
                }
              );

            return;
          }
        }

        res.status(400).send('Vorstellung passt nicht in den Zeitplan!');
      }
    }
  );

shows
  .route('/vorstellungen/:saal/:startzeit')
  .delete([checkJwt, checkPermissions('alter:cinema')], function (req, res) {
    // #swagger.tags = ['Vorstellung']
    // #swagger.description = 'Vorstellung löschen.'
    /* #swagger.parameters = { 
               in: 'path',
               name: 'startzeit',
               type: 'string',
               description: 'Format: 2021-12-19T00:00',
        } */
    /* #swagger.requestBody = {
               required: true,
               content: {
                 "application/json": {
                   schema: { $ref: "#/definitions/VorstellungLöschen" }
                 }
                }
        } */

    // #swagger.security = [{bearerAuth: []}]

    const dbConnect = dbo.getDb();
    const showToDelete = { titel: req.body.film };
    const showToDeleteQuery = {
      $pull: {
        vorstellungen: {
          saal: parseInt(req.params.saal),
          startzeit: req.params.startzeit,
        },
      },
    };

    dbConnect
      .collection('film')
      .updateOne(showToDelete, showToDeleteQuery, function (err, _result) {
        if (err) {
          res.status(400).send('Fehler beim Entfernen der Vorstellung!');
        } else {
          console.log('Vorstellung entfernt.');
          res.status(204).send();
        }
      });
  });

module.exports = shows;
