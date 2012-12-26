var express = require("express");
var mongodb = require('mongodb');
var handlebars = require('hbs');
var _ = require('underscore');


var config = require('./config');
var routes = require('./routes');

//var utils = require('./utils');

var app = module.exports.app = express();

var passport = require('passport');
var OpenIDStrategy = require('passport-openid').Strategy;


passport.serializeUser(function(user, done) {
  console.log('18 -'+user);
  done(null, user.identifier);
});

passport.deserializeUser(function(identifier, done) {
  console.log('23 -'+identifier);
  done(null, { identifier: identifier });
});

passport.use(new OpenIDStrategy({
    returnURL: config.site.baseUrl+ 'auth/openid/return',
    realm: config.site.baseUrl
  },
  function(identifier, done) {    
    process.nextTick(function () {          
      console.log('31 -'+identifier);
      return done(null, { identifier: identifier })
    });    
  }
));


app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));    
  app.set('views', __dirname + '/views');
  app.engine('html', handlebars.__express);  
  app.set('view engine', 'html');      
  app.use(express.cookieParser());  
  app.use(express.methodOverride());  
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  //app.use(user_role);

});

//connect database

app.param('db', function(req, res, next) {
  var db = new mongodb.Db(req.params.db, new mongodb.Server(config.mongodb.server, config.mongodb.port, {'auto_reconnect':true}));
  db.open(function(err,db) {
    if(err) {
      res.send(500, err);
    } else {
      var required_authen = false;
      for(var idx in config.mongodb.auth) {
        if(config.mongodb.auth[idx].name == req.params.db) {
          required_authen = true;
          db.authenticate(config.mongodb.auth[idx].username, config.mongodb.auth[idx].password, function(err,result) {
            if(err) {
              res.send(500, err);
            } else {
              if(result) {
                req.db = db;
                next();
              } else {
                res.send(403, 'Unauthorized');
              }
            }
          });
        }
      }
      if(!required_authen) {
        req.db = db;
        next();
      }
    }
  });
});

var middleware = function(req, res, next) {
  next();
};

app.locals({        
  baseHref:config.site.baseUrl
});

app.get('/auth/openid', passport.authenticate('openid'));

app.get('/auth/openid/return', 
  passport.authenticate('openid', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect(config.site.baseUrl);
  });

app.get('/userinfo', function(req, res, next) {
  if(req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.json({});
  }
});

app.post('/login',
  function(req, res, next) {
    passport.authenticate('local', function(err, user) {
      if (err) { return next(err) }
        if (!user) {
          res.locals.username = req.param('username');
          return res.render('index', { error: true });
        }
        req.login(user, {}, function(err) {
          if (err) { return next(err) };
          res.json({success:true,user: req.user});         
        });
    })(req, res, next);
    return;
  }
);

app.get('/test', ensureAuthenticated, function(req, res) {
  res.json({'status':1})
});

//
app.get('/:db/files', ensureAuthenticated, routes.listFile);
app.get('/:db/files/:file', middleware, routes.getFile);
//app.del('/:db/files/:file', middleware, routes.deleteFile);
app.post('/:db/upload', middleware, routes.storeFile);
//app.get('/', middleware, routes.index);

app.get('/', function(req, res){
  console.log('User name :' + req.user);
  res.render('index', { user: req.user });
})

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

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {  
    return next();
  }
  res.json({'error':123});
}
