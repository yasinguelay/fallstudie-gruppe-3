const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/*.js'];

const doc = {
  info: {
    version: '1.0.0',
    title: 'Fallstudie-Gruppe-3',
    description:
      'API Dokumentation zur Anbindung von Frontends für das Kinoticketreservierungssystem.',
  },
  host: 'fallstudie-gruppe-3.herokuapp.com',
  basePath: '/',
  schemes: ['https', 'http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Film',
      description:
        "Folgende Endpoints können genutzt werden, um mit der Ressource 'Film' zu interagieren.",
    },
    {
      name: 'Vorstellung',
      description:
        "Folgende Endpoints können genutzt werden, um mit der Ressource 'Vorstellung' zu interagieren.",
    },
    {
      name: 'Saal',
      description:
        "Folgende Endpoints können genutzt werden, um mit der Ressource 'Saal' zu interagieren.",
    },
    {
      name: 'Sitzplatz',
      description:
        "Folgende Endpoints können genutzt werden, um mit der Ressource 'Sitzplatz' zu interagieren.",
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  definitions: {
    Film: {
      titel: 'Inception',
      bild: 'https://imdb-api.com/images/original/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_Ratio0.6762_AL_.jpg',
      dauer: 148,
      beschreibung:
        'Beim Versuch in das Unterbewusstsein des Industriellen Saito einzudringen, stoßen Cobb und seine Mitstreiter auf unerwartete Schwierigkeiten. Saito hatte Verteidigungsstrategien gegen den Gedankendiebstahl trainiert und baut nun einen Abwehrriegel auf, doch erst der Verrat eines Kollegen lässt den Versuch scheitern, dem Schlafenden Geheimnisse zu entlocken. Da seine Auftraggeber unbedingten Erfolg gefordert hatten, muss Cobb, der auf Grund einer drohenden Verurteilung nicht mehr in die USA zurück kann, fliehen, doch Saito kommt ihm zuvor. Allerdings nicht um ihn zu bestrafen, sondern um ihm einen Deal vorzuschlagen.',
      trailer: 'https://www.youtube.com/embed/dHTyZ9Bmp0c',
      vorstellungen: [
        {
          saal: 1,
          startzeit: '2021-12-19T16:00',
          sitzplaetze: [
            {
              reihe: 'A',
              nummer: 1,
              sitzart: 'einzel',
              reserviert: false,
            },
          ],
        },
      ],
    },
    FilmAnlegen: {
      $titel: 'Django Unchained',
    },
    SaalAnlegen: {
      $nummer: 1,
      $sitzplaetze: [
        {
          $reihe: 'A',
          $nummer: 1,
          $sitzart: 'einzel',
          $reserviert: false,
        },
      ],
    },
    Vorstellungen: [
      {
        titel: 'Django Unchained',
        startzeit: '2021-12-19T13:00',
      },
    ],
    VorstellungenAbrufen: {
      $saalnummer: 1,
      $startzeit: '2021-12-19T00:00',
    },
    VorstellungAnlegen: {
      $saal: 1,
      $startzeit: '2021-12-19T00:00',
      $film: 'Inception',
      $dauer: 148,
    },
    VorstellungLöschen: {
      $film: 'Inception',
    },
    SitzeReservieren: [
      {
        $titel: 'Spider-Man: No Way Home',
        $saal: 1,
        $startzeit: '2022-01-05T12:30',
        $reihe: 'A',
        $nummer: 15,
        $wert: 'rauth0|userId',
      },
    ],
    SitzeBuchen: [
      {
        $titel: 'Spider-Man: No Way Home',
        $saal: 1,
        $startzeit: '2022-01-05T12:30',
        $reihe: 'A',
        $nummer: 15,
        $wert: 'auth0|userId',
      },
    ],
    SitzeFreigeben: [
      {
        $titel: 'Spider-Man: No Way Home',
        $saal: 1,
        $startzeit: '2022-01-05T12:30',
        $reihe: 'A',
        $nummer: 15,
        $wert: 'rauth0|userId',
      },
    ],
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./server.js');
});
