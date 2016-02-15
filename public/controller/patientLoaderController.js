var myApp = angular.module('myApp', ['ngRoute']);

myApp.controller('allPatientLoad', function ($scope, $http){

    //on click of button load all patient within the database
    $scope.loadAAllPat = function (){
        console.log('sent request for all patient');
        $http.get('/patientList').success(function (response){
            $scope.patientList = response;
        });

    };

});

myApp.controller ('allSpecPatient', function($scope, $http){

    $scope.loadSpecPat = function(){
        alert(clinician);
        console.log('sent request for specific patient');
        $http.get('/patientList/' +clinician).success(function (response){
            $scope.patientList = response;
        });
    };
});