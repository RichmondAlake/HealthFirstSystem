var myApp = angular.module('myApp', ['ngRoute']);
var patientName;
var patientAge;
var patientBP;
var patientChol;


//Controller to load all database in the patients database (not used)
myApp.controller('allPatientLoad', function ($scope, $http){

    //on click of button load all patient within the database
    $scope.loadAAllPat = function (){
        console.log('sent request for all patient');
        $http.get('/patientList').success(function (response){
            $scope.patientList = response;
        });

    };

});


//Controller to load assigned patients of searched Clinicians
//modify later to get patients of the signed in clinicians...only takes in the full name
myApp.controller ('allSpecPatient', function($scope, $http){
    //load patients assigned to clinicians onclick
    $scope.loadSpecPat = function(clinician){
        alert(clinician);
        console.log('sent request for patients assigned to' + clinician);
        $http.get('/patientList/' +clinician).success(function (response){
            $scope.patientList = response;

        });
    };



});


