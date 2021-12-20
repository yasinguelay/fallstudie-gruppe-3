const express = require('express');
const fetch = require('node-fetch');
const dbo = require('../db/conn');
const movies = express.Router();

movies
  .route('/filme')
  .get(function (_req, res) {
    // #swagger.tags = ['Film']
    // #swagger.description = 'Alle Filme abrufen.'

    /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Film" }
        } */

    const dbConnect = dbo.getDb();

    dbConnect
      .collection('film')
      .find({})
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send('Fehler beim Abrufen der Filme!');
        } else {
          res.json(result);
        }
      });
  })
  .post(async function (req, res) {
    // #swagger.tags = ['Film']
    // #swagger.description = 'Film anlegen.'

    /* #swagger.parameters['newFilm'] = {
               in: 'body',
               description: 'Anzulegender Film.',
               required: true,
               type: 'object',
               schema: { $ref: "#/definitions/FilmAnlegen" }
        } */

    const dbConnect = dbo.getDb();
    const newMovieToInsert = { titel: req.body.titel };

    const responseImdbSearchMovie = await fetch(
      'https://imdb-api.com/en/API/SearchMovie/' +
        process.env.IMDB_API +
        '/' +
        newMovieToInsert.titel
    );
    const resultsImdbSearchMovie = await responseImdbSearchMovie.json();

    const responseImdbTitle = await fetch(
      'https://imdb-api.com/de/API/Title/' +
        process.env.IMDB_API +
        '/' +
        resultsImdbSearchMovie.results[0].id
    );
    const resultsImdbTitle = await responseImdbTitle.json();

    newMovieToInsert.bild = resultsImdbTitle.image;
    newMovieToInsert.dauer = parseInt(resultsImdbTitle.runtimeMins);

    dbConnect
      .collection('film')
      .insertOne(newMovieToInsert, function (err, _result) {
        if (err) {
          res
            .status(400)
            .send(`"${newMovieToInsert.titel}" wurde bereits angelegt!`);
        } else {
          console.log(`"${newMovieToInsert.titel}" wurde angelegt.`);
          res.status(201).send();
        }
      });
  });

movies.route('/filme/:titel').delete((req, res) => {
  // #swagger.tags = ['Film']
  // #swagger.description = 'Film löschen.'

  const dbConnect = dbo.getDb();
  const movieToDelete = { titel: req.params.titel };

  dbConnect
    .collection('film')
    .deleteOne(movieToDelete, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Fehler beim Entfernen von "${movieToDelete.titel}"!`);
      } else {
        console.log(`"${movieToDelete.titel}" wurde entfernt.`);
        res.status(204).send();
      }
    });
});

module.exports = movies;
