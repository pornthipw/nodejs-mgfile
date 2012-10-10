var express = require('express');
var app = express.createServer();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});


app.post('/ud', function(req, res) {
    console.log('Body ');
    for(var key in req.body) {
        console.log(key+' - ' +req.body[key]);
    }
    //console.log(JSON.stringify(req.body));    
});

app.get('/', function(req, res) {
  res.charset = 'value';
  res.set('Content-Type', 'application/xrds+xml');
  var xrds = '<?xml version="1.0" encoding="UTF-8"?>'+
    '<xrds:XRDS xmlns:xrds="xri://$xrds" xmlns="xri://$xrd*($v*2.0)">'+
    '<XRD>'+
    '<Service priority="0">'+
    '<Type>http://specs.openid.net/auth/2.0/server</Type>'+
    // '<URI>https://www.google.com/accounts/o8/ud</URI>'+
    '<URI>http://localhost:3001/ud</URI>'+
    '</Service>'+
    '</XRD>'+
    '</xrds:XRDS>';      
  res.send(xrds);
});


app.listen(3001);
