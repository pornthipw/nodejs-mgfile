var express = require("express");
var mongodb = require('mongodb');
var handlebars = require('hbs');
var _ = require('underscore');
//var user_role = require('connect-roles');

var config = require('./config');
var routes = require('./routes');
//var utils = require('./utils');


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash')

var app = express();

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

var users = [
    { id: 1, username: 'nook', password: '1234', email: 'bob@example.com' , roles:["admin"]}
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com', roles:["user"] }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

passport.use(new LocalStrategy(    
    function(username, password, done) {    
        process.nextTick(function () {        
          findByUsername(username, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
            if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
            return done(null, user);
          })
    });
  }  
));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

function requireRole(role) {
    return function(req, res, next) {
        if(req.session.user && req.session.user.role === role)
            next();
        else
            res.send(403);
    }
}



//Set up database stuff
var host = config.mongodb.server || 'localhost';
var port = config.mongodb.port || mongodb.Connection.DEFAULT_PORT;
var dbOptions = {
  auto_reconnect: config.mongodb.autoReconnect,
  poolSize: config.mongodb.poolSize
};

var database;
var user;

var db = new mongodb.Db('grad_file', new mongodb.Server(host, port, dbOptions));

db.open(function(err, db) {
  if (err) {
      throw err;
  }  
  database = db;            
});


var middleware = function(req, res, next) {
  req.database = database;
  req.user = user;  
  next();
};

app.locals({        
  baseHref:config.site.baseUrl
});




/*
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        console.log(req.user);        
        res.redirect('/');
    }
);
*/
app.post('/login',
    function(req, res, next) {
        passport.authenticate('local', function(err, user) {
            if (err) { return next(err) }
            if (!user) {
                res.local("username", req.param('username'));
                return res.render('index', { error: true });
            }

            // make passportjs setup the user object, serialize the user, ...
            req.login(user, {}, function(err) {
                if (err) { return next(err) };
                //return res.redirect("/#/list/");
                res.json({success:true,user: req.user}); 
                //return res.render('index', { user: req.user,success: true });

                
                
            });
        })(req, res, next);
        return;
    }
);

app.get('/test', ensureAuthenticated, function(req, res) {
    res.json({'status':1})
});

app.get('/files', ensureAuthenticated, routes.listFile);
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

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    req.database = database;
    req.user = user;  
    return next();
  }
  res.json({'error':123});
}
