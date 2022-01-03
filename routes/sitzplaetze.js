const express = require('express');
const nodemailer = require('nodemailer');
const dbo = require('../db/conn');
const seats = express.Router();

seats.route('/sitzplaetze/reservieren').put(async function (req, res) {
  // #swagger.tags = ['Sitzplatz']
  // #swagger.description = 'Sitzplatz reservieren.'

  /* #swagger.parameters['seats'] = {
               in: 'body',
               description: 'Zu reservierende Sitze.',
               required: true,
               type: 'object',
               schema: { $ref: "#/definitions/SitzeReservieren" }
        } */

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
            'j.reserviert': seat.wert,
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
        'vorstellungen.$[i].sitzplaetze.$[j].reserviert': seat.wert,
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

    let result;

    try {
      result = await dbConnect
        .collection('film')
        .updateOne(seatToReserve, updateQuery, arrayFilters);
    } catch (e) {
      continue;
    }

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
      }

      res.status(400).send('Already blocked');
      return;
    }
  }

  res.status(200).send('Reserved');
  setTimeout(undoAfterBlockTime, 5 * 60 * 1000);
});

seats.route('/sitzplaetze/checkout').put(async function (req, res) {
  // #swagger.tags = ['Sitzplatz']
  // #swagger.description = 'Sitzplatz buchen.'

  /* #swagger.parameters['seats'] = {
               in: 'body',
               description: 'Zu buchende Sitze.',
               required: true,
               type: 'object',
               schema: { $ref: "#/definitions/SitzeBuchen" }
        } */

  const dbConnect = dbo.getDb();

  for (const [index, seat] of req.body[0].entries()) {
    const seatToReserve = {
      titel: seat.titel,
    };

    const updateQuery = {
      $set: {
        'vorstellungen.$[i].sitzplaetze.$[j].reserviert':
          seat.wert.substring(1),
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
          'j.reserviert': { $in: [false, seat.wert] },
        },
      ],
    };

    let result;

    try {
      result = await dbConnect
        .collection('film')
        .updateOne(seatToReserve, updateQuery, arrayFilters);
    } catch (e) {
      res.status(400).send('Probieren Sie es später erneut!');
      return;
    }

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
      }

      res.status(400).send('Already blocked');
      return;
    }
  }

  let tickets = '';

  for (const [index, ticket] of req.body[0].entries()) {
    tickets += `${index + 1}) Reihe: ${ticket.reihe}, Nummer: ${
      ticket.nummer
    }\n`;
  }

  (async () => {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Fallstudie Gruppe 3" <fallstudie.gruppe.3@gmail.com>', // sender address
      to: req.body[3], // list of receivers
      subject: 'Buchungsbestätigung', // Subject line
      text:
        `Hallo ${
          req.body[2]
        },\n\nmit dieser E-Mail erhältst Du Deine Tickets für folgende Vorstellung:\n\nFilm: ${
          req.body[0][0].titel
        }, Saal: ${req.body[0][0].saal}, Datum: ${new Date(
          req.body[0][0].startzeit
        ).toLocaleString('de-DE', {
          weekday: 'long',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}\n\nBitte begleiche den offenen Betrag von ${req.body[1].toLocaleString(
          undefined,
          { minimumFractionDigits: 2 }
        )} € vor Ort.\n\nDeine Tickets:\n\n` +
        tickets +
        `\nViele Grüße\n\nDein Team vom Kino 3`, // plain text body
      // html: "<b>Hello world?</b>", // html body
    });

    console.log('Message sent: %s', info.messageId);
  })().catch(console.error);

  res.status(200).send('Booked');
});

seats.route('/sitzplaetze/freigeben').put(async function (req, res) {
  // #swagger.tags = ['Sitzplatz']
  // #swagger.description = 'Sitzplatz freigebn.'

  /* #swagger.parameters['seats'] = {
               in: 'body',
               description: 'Zu freigebende Sitze.',
               required: true,
               type: 'object',
               schema: { $ref: "#/definitions/SitzeReservieren" }
        } */

  const dbConnect = dbo.getDb();

  for (const [, seat] of req.body.entries()) {
    const seatToReserve = {
      titel: seat.titel,
    };

    const updateQuery = {
      $set: {
        'vorstellungen.$[i].sitzplaetze.$[j].reserviert': false,
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
          'j.reserviert': seat.wert,
        },
      ],
    };

    try {
      await dbConnect
        .collection('film')
        .updateOne(seatToReserve, updateQuery, arrayFilters);
    } catch (e) {
      continue;
    }
  }

  res.status(200).send('Released');
});

module.exports = seats;
