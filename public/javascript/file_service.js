var app = angular.module('file_service', ['ngResource']);

app.factory('FileDB', function($resource) {
    var FileDB  = $resource('/files/:id', {id:'@id'},{});           
    return FileDB;
});


