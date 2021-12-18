const express = require('express');
const fetch = require('node-fetch');
const dbo = require('../db/conn');
const movies = express.Router();


movies.route('/filme')
  .get(function (_req, res) {
    const dbConnect = dbo.getDb();

    dbConnect
      .collection('film')
      .find({})
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send('Error fetching movies!');
        } else {
          res.json(result);
        }
      });
  })
  .post(async function (req, res) {
    const dbConnect = dbo.getDb();
    const newMovieToInsert = {
      titel: req.body.titel
    };

    const responseImdbSearchMovie = await fetch('https://imdb-api.com/en/API/SearchMovie/' + process.env.IMDB_API + '/' + newMovieToInsert.titel);
    const resultsImdbSearchMovie = await responseImdbSearchMovie.json();

    const responseImdbTitle = await fetch('https://imdb-api.com/de/API/Title/' + process.env.IMDB_API + '/' + resultsImdbSearchMovie.results[0].id);
    const resultsImdbTitle = await responseImdbTitle.json();


    newMovieToInsert.bild = resultsImdbTitle.image;
    newMovieToInsert.dauer = parseInt(resultsImdbTitle.runtimeMins);

    dbConnect
      .collection('film')
      .insertOne(newMovieToInsert, function (err, result) {
        if (err) {
          res.status(400).send('Error inserting movie!');
        } else {
          console.log(`Added a new movie with id ${result.insertedId}`);
          res.status(201).send();
        }
      });
  });

movies.route('/filme/:titel')
  .delete((req, res) => {
    const dbConnect = dbo.getDb();
    const movieToDelete = { titel: req.params.titel };

    dbConnect
      .collection('film')
      .deleteOne(movieToDelete, function (err, _result) {
        if (err) {
          res
            .status(400)
            .send(`Error deleting movie with name ${req.params.titel}!`);
        } else {
          console.log('Movie deleted');
          res.status(204).send();
        }
      });
  });


module.exports = movies;
