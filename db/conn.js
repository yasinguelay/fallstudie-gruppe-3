const { MongoClient } = require('mongodb');
const connectionString =
  process.env.NODE_ENV === 'test'
    ? process.env.ATLAS_URI_TEST
    : process.env.ATLAS_URI;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db(
        process.env.NODE_ENV === 'test'
          ? 'fallstudie-gruppe-3-test'
          : 'fallstudie-gruppe-3'
      );
      console.log('Successfully connected to MongoDB.');

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};
