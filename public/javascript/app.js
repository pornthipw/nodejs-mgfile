var app = angular.module('gradfile', ['file_service']);

app.config(function($routeProvider) {
    $routeProvider.
	//when('/', {controller:LoginController, templateUrl:'/static/index.html'});
	//when('/upload', {controller:UploadController, templateUrl:'/static/upload.html'}).
    when('/list', {controller:FileController, templateUrl:'static/index.html'});
});

function LoginController($scope, $http) {
    $scope.user = {username:'pk'};
  $scope.login = function() {        
    $http.post('/login', {username:$scope.username, password:$scope.password}).success(function(result) {
      console.log("succcess");
      console.log(result);
      if(result.success) {          
        $('#loginModal').modal('hide');
        $scope.user = result.user;        
      }
    });                                    
  };       
  
}

function FileController($scope,$routeParams,$http, FileDB) {        
    console.log('Run FileController');
    $scope.file_list = FileDB.query(function(result){
        console.log('file list');
        console.log(result);
        });
    
        
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
        var totalPage = Math.ceil($scope.file_list.length/$scope.pageSize);               
        return totalPage;          
    };  
    
    
     $scope.onTwitterLogin = function()
    {
      //console.log("succcess");
        // a direct window.location to overcome Angular intercepting your call!
        window.location = "/auth/twitter";
        
    }

    $scope.onFacebookLogin = function () {

    }
    
      
  

};

app.filter('startFrom', function() {
    return function(input, start) {        
        start = +start; //parse to int
        if(input) {
            return input.slice(start);
        } 
        return [];
    }
});









