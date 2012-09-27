var express = require("express");
var mongodb = require('mongodb');
var handlebars = require('hbs');
var _ = require('underscore');

var config = require('./config');
var routes = require('./routes');
//var utils = require('./utils');

var app = express();

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));    
  app.set('views', __dirname + '/views');
  app.engine('html', handlebars.__express);  
  app.set('view engine', 'html');      
  app.use(express.methodOverride());
});

//Set up database stuff
var host = config.mongodb.server || 'localhost';
var port = config.mongodb.port || mongodb.Connection.DEFAULT_PORT;
var dbOptions = {
  auto_reconnect: config.mongodb.autoReconnect,
  poolSize: config.mongodb.poolSize
};

var database;

var db = new mongodb.Db('grad_file', new mongodb.Server(host, port, dbOptions));

db.open(function(err, db) {
  if (err) {
      throw err;
  }  
  database = db;            
});


var middleware = function(req, res, next) {
  req.database = database;
  next();
};

app.locals({        
  baseHref:config.site.baseUrl
});

app.get('/files', middleware, routes.listFile);
app.get('/files/:file', middleware, routes.getFile);
app.del('/files/:file', middleware, routes.deleteFile);
app.post('/upload', middleware, routes.storeFile);
app.get('/', middleware, routes.index);

// test csv reader
app.get('/csv', middleware, function(req, res) {
    var content  = [
	{col1:'r01',col2:'r02', col3:'r03',col4:'r04'},
	{col1:'r11',col2:'r12', col3:'r13',col4:'r14'}	
    ];
    res.json(content);
});

app.listen(config.site.port || 3000);

console.log("Mongo Express server listening on port " + (config.site.port || 3000));

