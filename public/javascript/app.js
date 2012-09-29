var app = angular.module('gradfile', ['file_service']);


google.load('visualization', '1');
google.setOnLoadCallback(onLoad);

function onLoad() {
  console.log('Google Lib is loaded');
};

app.config(function($routeProvider) {
    $routeProvider.
	//when('/', {controller:FileController, templateUrl:'/static/index.html'}).    
    when('/csv', {controller:CSVController, templateUrl:'static/csv.html'}).
    when('/list', {controller:FileController, templateUrl:'static/index.html'})
});

function CSVController($scope) {      
  // test by google spreadsheet
  var dataSourceUrl = "https://docs.google.com/spreadsheet/tq?key=0AvJYqJoWtyhodGtSYVNDWWppS21WTlZyUk41V3g4TXc&headers=-1#";
  var query = new google.visualization.Query(dataSourceUrl);
  query.send(function(response) {
    var data = response.getDataTable();
    console.log('data received');
    console.log(JSON.parse(data.toJSON()));
    $scope.$apply(function() {
      $scope.csv = JSON.parse(data.toJSON());    
    });
  });      
  
  $scope.removeColumn = function(col) {
    col.removed=true;
  };
  
  $scope.test = function() {
    console.log($scope.csv);
  };
    
};


function FileController($scope,$routeParams,FileDB){
    console.log('Execute');            
    
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
    
    $scope.file_list = FileDB.query();
                        
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
    $scope.numberOfPages=function(){
        var totalPage = Math.ceil($scope.file_list.length/$scope.pageSize);       
        console.log("totalPage"+totalPage);
        return totalPage;          
    }
    for (var i=0; i<$scope.file_list.length; i++) {
        $scope.file_list.push("File "+i);
    }
    

};

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});









