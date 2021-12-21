const express = require('express');
const dbo = require('../db/conn');
const seats = express.Router();

seats
  .route('/sitzplaetze')
  .get(function (_req, _res) {})
  .post(async function (req, res) {
    const dbConnect = dbo.getDb();

    for (const [index, seat] of req.body.entries()) {
      const seatToReserve = {
        titel: seat.titel,
      };

      const updateQuery = {
        $set: {
          'vorstellungen.$[i].sitzplaetze.$[j].reserviert': seat.user_id,
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

          const result = await dbConnect
            .collection('film')
            .updateOne(seatToUndo, undoQuery, undoArrayFilters);

          console.log(result.modifiedCount);
        }

        res.status(400).send('Already blocked');
        return;
      }
    }

    res.status(200).send('Glückwunsch');
  });

module.exports = seats;
