// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });

const express = require('express');
const cors = require('cors');
const path = require('path');
// get MongoDB driver connection
const dbo = require('./db/conn');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'app/build')));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(require('./routes/filme'));
app.use(require('./routes/vorstellungen'));
app.use(require('./routes/sitzplaetze'));
app.use(require('./routes/saele'));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'app/build', 'index.html'));
});

// Global error handling
app.use(function (err, _req, res, _next) {
  console.error(err.stack);
  res.status(500).send('Unauthorized!');
});

// perform a database connection when the server starts
dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
