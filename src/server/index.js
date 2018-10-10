import { mongo } from '../cli'

if (config.default.database && config.default.database.type == "mongo") {
  mongo.connectToServer(function (err) {
      if (err) {
        console.error(err);
        console.error('Mongo failed to connect');
        return process.exit(1);
      }
      console.log('Mongo DB connected !')
      require('./app.js')
  })
}
else {
  require('./app');
}
