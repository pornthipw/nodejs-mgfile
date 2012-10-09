var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

module.exports.passport = passport;

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





