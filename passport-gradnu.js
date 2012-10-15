var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var OpenIDStrategy = require('passport-openid').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var flash = require('connect-flash');

module.exports.passport = passport;
/*
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
*/



passport.serializeUser(function(user, done) {
  done(null, user.identifier);
});

passport.deserializeUser(function(identifier, done) {
  done(null, { identifier: identifier });
});

passport.use(new GoogleStrategy({
    //returnURL: 'http://www.example.com/auth/openid/return',http://openid-provider.appspot.com/Pornthip.wong/
    //realm: 'http://www.example.com/',
    returnURL:'http://openid-provider.appspot.com/auth/google/return/',
    //returnURL: 'http://localhost:8083/auth/google/return',
    realm:'http://openid-provider.appspot.com/',
    //realm: 'http://localhost:8083/'
    profile: true
  },
  //function(identifier, profile, done) {
  function(identifier, profile,done) {
    User.findOrCreate({ openId: identifier }, function (err, user) {
      return done(err, user);
    });
  }
));


/*
strategy.saveAssociation(function(handle, provider, algorithm, secret, expiresIn, done) {
  // custom storage implementation
  saveAssoc(handle, provider, algorithm, secret, expiresIn, function(err) {
    if (err) { return done(err) }
    return done();
  });
});

strategy.loadAssociation(function(handle, done) {
  // custom retrieval implementation
  loadAssoc(handle, function(err, provider, algorithm, secret) {
    if (err) { return done(err) }
    return done(null, provider, algorithm, secret)
  });
});

*/

