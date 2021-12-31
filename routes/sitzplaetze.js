const express = require('express');
const dbo = require('../db/conn');
const seats = express.Router();

seats
  .route('/sitzplaetze/reservieren')
  .get(function (_req, _res) {})
  .post(async function (req, res) {
    const dbConnect = dbo.getDb();

    const undoAfterBlockTime = function () {
      for (const [, seat] of req.body.entries()) {
        const undoSeatAfterTimeout = {
          titel: seat.titel,
        };

        const undoAfterTimeoutQuery = {
          $set: {
            'vorstellungen.$[i].sitzplaetze.$[j].reserviert': false,
          },
        };

        const undoAfterTimeoutArrayFilters = {
          arrayFilters: [
            {
              'i.saal': seat.saal,
              'i.startzeit': seat.startzeit,
            },
            {
              'j.reihe': seat.reihe,
              'j.nummer': seat.nummer,
              'j.reserviert': true,
            },
          ],
        };

        dbConnect
          .collection('film')
          .updateOne(
            undoSeatAfterTimeout,
            undoAfterTimeoutQuery,
            undoAfterTimeoutArrayFilters
          );
      }
    };

    for (const [index, seat] of req.body.entries()) {
      const seatToReserve = {
        titel: seat.titel,
      };

      const updateQuery = {
        $set: {
          'vorstellungen.$[i].sitzplaetze.$[j].reserviert': true,
        },
      };

      const arrayFilters = {
        arrayFilters: [
          {
            'i.saal': seat.saal,
            'i.startzeit': seat.startzeit,
          },
          {
            'j.reihe': seat.reihe,
            'j.nummer': seat.nummer,
            'j.reserviert': false,
          },
        ],
      };

      const result = await dbConnect
        .collection('film')
        .updateOne(seatToReserve, updateQuery, arrayFilters);

      if (result.modifiedCount === 0) {
        for (let i = 0; i < index; i++) {
          const seatToUndo = {
            titel: req.body[i].titel,
          };

          const undoQuery = {
            $set: {
              'vorstellungen.$[i].sitzplaetze.$[j].reserviert': false,
            },
          };

          const undoArrayFilters = {
            arrayFilters: [
              {
                'i.saal': req.body[i].saal,
                'i.startzeit': req.body[i].startzeit,
              },
              {
                'j.reihe': req.body[i].reihe,
                'j.nummer': req.body[i].nummer,
              },
            ],
          };

          dbConnect
            .collection('film')
            .updateOne(seatToUndo, undoQuery, undoArrayFilters);

          console.log(result.modifiedCount);
        }

        res.status(400).send('Already blocked');
        return;
      }
    }

    res.status(200).send('Glückwunsch');
    setTimeout(undoAfterBlockTime, 30 * 1000);
  });

module.exports = seats;
