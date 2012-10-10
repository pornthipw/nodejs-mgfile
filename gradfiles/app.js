var app = module.parent.exports.app;
var routes = require('../routes');

var ensureAuthenticated = require('../passport-gradnu').ensureAuthenticated;

app.get('/test', ensureAuthenticated, function(req, res) {
    res.json({'status':1})
});

var middleware = function(req, res, next) {  
  next();
};

app.get('/gradfile/:db/files', ensureAuthenticated,routes.listFile);
app.get('/gradfile/files/:file', middleware, routes.getFile);
app.del('/gradfile/files/:file', middleware, routes.deleteFile);
app.post('/gradfile/upload', middleware, routes.storeFile);
app.get('/gradfile/', middleware, routes.index);



// test csv reader
app.get('/csv', middleware, function(req, res) {
    var content  = [
	{col1:'r01',col2:'r02', col3:'r03',col4:'r04'},
	{col1:'r11',col2:'r12', col3:'r13',col4:'r14'}	
    ];
    res.json(content);
});
