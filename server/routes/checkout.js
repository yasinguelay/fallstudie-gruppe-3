const express = require('express');
const dbo = require('../db/conn');
const checkout = express.Router();

checkout
  .route('/checkout')
  .get(function (req, res) {
    const dbConnect = dbo.getDb();

    for (const [, seat] of req.body.entries()) {
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
            'j.reserviert': true,
          },
        ],
      };

      dbConnect
        .collection('film')
        .updateOne(seatToReserve, updateQuery, arrayFilters);
    }

    res.status(200).send('Glückwunsch');
  })
  .post(async function (_req, _res) {});

module.exports = checkout;
