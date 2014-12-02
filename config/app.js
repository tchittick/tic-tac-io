var env = process.env.NODE_ENV || 'developemnt'
  , packageJson = require('../package.json')
  , path = require('path')
  , express = require('express')
  , app = express()
  , server = require('http').Server(app)
  , io = require('socket.io')(server);

console.log('Loading App in ' + env + ' mode.');

global.App = {
  app: app
, server: server
, io: io
, port: process.env.PORT || 8080
, version: packageJson.version
, root: path.join(__dirname, '..')
, appPath: function(path){
    return this.root + '/' + path
  }
, require: function(path){
    return require(this.appPath(path))
  }
, env: env
, Start: function() {
    if (!this.started) {
      this.started = true;
      this.server.listen(this.port);
      console.log('Running App Version ' + App.version + ' on port ' + App.port + ' in ' + App.env + ' mode.');
    }
  }
, route: function(path){
    return this.require('app/routes/' + path);
  }
, database: function(path){
    return this.require('app/database/' + path);
  }
, game: function(path){
    return this.require('app/game/' + path);
  }
, wins: 0
}

//Jade
App.app.set('views', App.appPath('app/views'));
App.app.set('view engine', 'jade');
App.app.set('view options', { pretty: env === 'development' });
App.app.locals.pretty = true;

var bodyParser = require('body-parser');
App.app.use(bodyParser.urlencoded({extended: true}));

App.app.use(express.static(App.appPath('public')));

App.require('config/routes')(App.app);

App.require('config/socketio')(App.app, App.io);