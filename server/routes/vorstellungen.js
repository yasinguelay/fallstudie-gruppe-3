const express = require('express');
const dbo = require('../db/conn');
const shows = express.Router();


shows.route('/vorstellungen')
  .get(function (req, res) {
    const dbConnect = dbo.getDb();
    const pipeline = [
      {$unwind: '$vorstellungen'},
      {$match: {'vorstellungen.saal': req.body.saalnummer, 'vorstellungen.startzeit': {$gte: req.body.startzeit.substring(0, 10)}}},
      {$sort: {'vorstellungen.startzeit': 1}},
      {$addFields: {startzeit: '$vorstellungen.startzeit'}},
      {$project: {_id: 0, titel: 1, startzeit: 1}}
    ];

    dbConnect
    .collection('film')
    .aggregate(pipeline)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching shows!');
      } else {
        res.json(result);
      }
    });
  })
  .post(async function (req, res) {
    const dbConnect = dbo.getDb();
    const cinemaOpeningTime = "12:30";
    const cinemaClosingTime = "23:30";
    const breakAfterShow = 10;
    const movieToUpdate = {
      titel: req.body.film
    };

    const projection = [
      {$unwind: '$vorstellungen'},
      {$match: {'vorstellungen.saal': req.body.saal, 'vorstellungen.startzeit': {$gte: req.body.startzeit.substring(0, 10)}}},
      {$sort: {'vorstellungen.startzeit': -1}},
      {$addFields: {startzeit: '$vorstellungen.startzeit'}},
      {$project: {_id: 0, dauer: 1, startzeit: 1}}
    ];

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

    const sameDaySameHallShows = await dbConnect
    .collection('film')
    .aggregate(projection)
    .toArray();

    console.log(sameDaySameHallShows)

    const newShowStartTime = new Date(req.body.startzeit);
    const newShowEndTime = new Date(newShowStartTime.getTime() + 60000 * (req.body.dauer + breakAfterShow));
    const toLocaleTimeStringLimitation = [[], {hour: '2-digit', minute:'2-digit'}];

    if (newShowEndTime.toLocaleTimeString(...toLocaleTimeStringLimitation) > cinemaClosingTime || newShowStartTime.toLocaleTimeString(...toLocaleTimeStringLimitation) < cinemaOpeningTime) {
      res.status(400).send('Vorstellung kann nicht ausserhalb der Öffnungszeiten angelegt werden.');
    } else if (sameDaySameHallShows.length === 0) {
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
    } else {
      for (const [index, value] of sameDaySameHallShows.entries()) {
        console.log(index, value);
        const previousShowEndTime = new Date(new Date(value.startzeit).getTime() + 60000 * (value.dauer + breakAfterShow));
        const nextShowStartTime = index === 0 ? null : new Date(sameDaySameHallShows[index - 1].startzeit);
  
        if (newShowStartTime >= previousShowEndTime && nextShowStartTime === null || newShowStartTime >= previousShowEndTime && newShowEndTime <= nextShowStartTime || newShowEndTime <= new Date(value.startzeit) && index === sameDaySameHallShows.length - 1) {
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
          
          return;
        }
      }

      res.status(400).send('Vorstellung passt nicht in den Zeitplan!');
    }
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