var myApp = angular.module('myApp', ['ngRoute']);


myApp.config(function ($routeProvider){
    $routeProvider.when('/clinicianlogin', {
        templateUrl : 'clinicianLogin.html'
    }).when('/patientlogin', {
        templateUrl : 'patientLogin.html'
    });
});

/** Test purposes **/
myApp.controller('Testing', function ($scope){
    $scope.test = function(){
        console.log("Module working successfully");
    };
});


/** Hanlding Clinician Login**/
myApp.controller('ClinicianLogin', function ($scope, $http){

    $scope.showDetails = function (){
        console.log($scope.clinicianNumber);
        console.log($scope.clinicianPass);
        var details = {nhsnumber : $scope.clinicianNumber, password : $scope.clinicianPass };
        console.log(details);
        $http.post('/clinicianloginauth', details).success(function(response){
            //console.log(response);
            //need to display the response file on the page
            if (response){
                //window.location.href = "/public/cliniciandashboardtest.html";
                document.write(response);
                document.close();
            }else{
                //do nothing
            }
        });
    }


});

/** Handling Patients Login **/
myApp.controller('PatientLogin', function ($scope, $http){
    $scope.showDetails = function (){
        var details = {nhsnumber : $scope.patientNumber, password : $scope.patientPass};
        console.log(details);
        $http.post('/patientloginauth', details).success(function(response){
            console.log(response);
            //need to display the response file on the page
            document.write(response);
            document.close();
        });
    }

});