var app = angular.module('gradfile', ['file_service']);

app.config(function($routeProvider) {
  $routeProvider.
    //when('/', {controller:LoginController, templateUrl:'/static/index.html'});
    when('/list', {controller:FileController, templateUrl:'static/index.html'});
});

function LoginController($scope,  $http) {
  $scope.login = function() {    
    //for local
    $http.post('login', {username:$scope.username, password:$scope.password}).success(function(result) {
    //for google   
      //$http.post('auth/google', {identifier:$scope.openid_identifier,value:"https://www.google.com/accounts/o8/id"/}).success(function(result) {
      console.log("succcess");
      console.log(result);
      if(result.success) {          
        $('#loginModal').modal('hide');
        $scope.user = result.user; 
	//$location.path('#/');       
      }
    });                                    
  };       
  
}

function FileController($scope,FileDB, User) {        
    console.log('Run FileController');
    /*
    User.get(function(userInfo) {
    if(userInfo.username) {
      $scope.user = userInfo;
      $scope.file_list = FileDB.query(function(result) {
        console.log(result);
      });
    } else {
      
    }
    */
    
    
    $scope.file_list = FileDB.query(function(result){
      //console.log('file list');
      //console.log("result--->"+result);
    });
    
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
    });
    
    $scope.setFile = function(element) {
      $scope.$apply(function() {
	$scope.theFile = element.files[0];
      });
    }
    
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









