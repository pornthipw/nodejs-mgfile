var app = angular.module('gradfile', ['file_service']);

app.config(function($routeProvider) {
    $routeProvider.
	//when('/', {controller:FileController, templateUrl:'/static/index.html'}).    
	//when('/upload', {controller:UploadController, templateUrl:'/static/upload.html'}).
    when('/list', {controller:FileController, templateUrl:'/static/index.html'})
});
/*
function UploadController($scope, $routeParams,FileDB) {  
    console.log('Execute');

    $('iframe#upload_target').load(function() {
        var data = $.parseJSON($('iframe#upload_target').contents().find("body")[0].innerHTML);
        if(data.success) {
            $scope.$apply(function(){
            $scope.success = true;
            });
        } else {
            $scope.$apply(function() {
            $scope.success = false;
            $scope.message = data.message;
            });
        }
    });      

    $scope.setFile = function(element) {
        $scope.$apply(function() {
            $scope.theFile = element.files[0];
        });
    };
    
};
*/

function FileController($scope,$routeParams,FileDB) {        
    $scope.file_list = FileDB.query();
        
    $scope.showFormPage = false;
    $scope.viewForm = function() {
        $scope.showFormPage = true;
    };
    
    $('iframe#upload_target').load(function() {
        var data = $.parseJSON($('iframe#upload_target').contents().find("body")[0].innerHTML);
        if(data.success) {
            $scope.$apply(function(){
                $scope.success = true;
                $scope.theFile = '';
                $('#uploadFileModal').modal('hide')
                $scope.file_list = FileDB.query();  
            });
        } else {
            $scope.$apply(function() {
                $scope.success = false;
                $scope.message = data.message;
            });
        }
    }
    
    );      

    $scope.setFile = function(element) {
        $scope.$apply(function() {
            $scope.theFile = element.files[0];
        });
    };
            
    $('.dropdown-toggle').dropdown();
        
    $scope.del = function(id) {
        console.log(id);
        FileDB.remove({id:id}, function(docs) {
            console.log('remove');
            $scope.file_list = FileDB.query();    
        });
    };    
    
    $scope.currentPage = 0;
    $scope.page = 0;
    $scope.pageSize = 2;    
    
    $scope.numberOfPages=function() {
        $scope.pages = [];
        var totalPage = Math.ceil($scope.file_list.length/$scope.pageSize);       
        console.log("totalPage"+totalPage);        
        for(var i=0;i<totalPage;i++) {
          $scope.pages.push(i+1);
        }
        return totalPage;          
    };        
    

};

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});









