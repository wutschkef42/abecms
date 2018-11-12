const config = require('./config')
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = config.mongo.url;

const options = {
    useNewUrlParser: true,
    poolSize: 10,
};

let _db;

module.exports = {

  connectToServer: function( callback ) {
    if (!url) { return callback('Missing mongo URL')}
    MongoClient.connect( url, options, function( err, client ) {
      if (!client || err) {
        return callback(err);
      }
      _db = client.db('abecms_dev');
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};
