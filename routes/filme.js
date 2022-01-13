const checkJwt = require('../middleware/authz.middleware');
const checkPermissions = require('../middleware/permissions.middleware');
const { google } = require('googleapis');
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
               content: {
                 "application/json": {
                    schema: { $ref: "#/definitions/Film" }
                 }
               }  
        } */

    const dbConnect = dbo.getDb();

    dbConnect
      .collection('film')
      .find({})
      .project({ _id: 0 })
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send('Fehler beim Abrufen der Filme!');
        } else {
          res.json(result);
        }
      });
  })
  .post(
    [checkJwt, checkPermissions('alter:cinema')],
    async function (req, res) {
      // #swagger.tags = ['Film']
      // #swagger.description = 'Film anlegen.'

      /* #swagger.requestBody = {
               required: true,
               content: {
                 "application/json": {
                   schema: { $ref: "#/definitions/FilmAnlegen" }
                 }
               }
        } */

      // #swagger.security = [{bearerAuth: []}]

      const dbConnect = dbo.getDb();
      const newMovieToInsert = { titel: req.body.titel };
      const youtube = google.youtube({
        version: 'v3',
        auth: process.env.YOUTUBE_API,
      });

      try {
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

        const responseYoutubeSearchMovie = await youtube.search.list({
          part: 'snippet',
          q: req.body.titel.toLowerCase() + ' trailer deutsch',
        });

        if (responseYoutubeSearchMovie.data?.items?.[0]?.id?.videoId) {
          newMovieToInsert.trailer =
            'https://www.youtube.com/embed/' +
            responseYoutubeSearchMovie.data.items[0].id.videoId;
        } else {
          newMovieToInsert.trailer = '';
        }

        if (responseImdbTitle.ok) {
          const resultsImdbTitle = await responseImdbTitle.json();
          newMovieToInsert.bild = resultsImdbTitle.image.replace(
            '/original/',
            '/250x371/'
          );
          newMovieToInsert.dauer = parseInt(resultsImdbTitle.runtimeMins);
          newMovieToInsert.beschreibung =
            resultsImdbTitle.plotLocal ===
            'Momentan gibt es keine deutsche Übersetzung. Unterstütze uns indem du eine hinzufügst.'
              ? resultsImdbTitle.plot
              : resultsImdbTitle.plotLocal;
          newMovieToInsert.vorstellungen = [];
        } else {
          res.status(400).send('Film konnte nicht angelegt werden!');
          return;
        }
      } catch (e) {
        res.status(400).send('Film konnte nicht angelegt werden!');
        return;
      }

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
    }
  );

movies
  .route('/filme/:titel')
  .delete([checkJwt, checkPermissions('alter:cinema')], (req, res) => {
    // #swagger.tags = ['Film']
    // #swagger.description = 'Film löschen.'
    // #swagger.security = [{bearerAuth: []}]

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
