const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/*.js'];

const doc = {
  info: {
    version: '1.0.0',
    title: 'Fallstudie-Gruppe-3',
    description:
      'API Dokumentation zur Anbindung von Frontends für das Kinoticketreservierungssystem.',
  },
  host: 'localhost:5000',
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Film',
      description:
        "Folgende Endpoints können genutzt werden, um mit der Ressoruce 'Film' zu interagieren.",
    },
    {
      name: 'Vorstellung',
      description:
        "Folgende Endpoints können genutzt werden, um mit der Ressoruce 'Vorstellung' zu interagieren.",
    },
    {
      name: 'Saal',
      description:
        "Folgende Endpoints können genutzt werden, um mit der Ressoruce 'Saal' zu interagieren.",
    },
  ],
  /* securityDefinitions: {
        api_key: {
            type: "apiKey",
            name: "api_key",
            in: "header"
        },
        petstore_auth: {
            type: "oauth2",
            authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
            flow: "implicit",
            scopes: {
                read_pets: "read your pets",
                write_pets: "modify pets in your account"
            }
        }
    }, */
  definitions: {
    Film: {
      titel: 'Inception',
      bild: 'https://imdb-api.com/images/original/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_Ratio0.6762_AL_.jpg',
      dauer: 148,
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
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./server.js');
});
