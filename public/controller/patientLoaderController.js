var myApp = angular.module('myApp', ['ngRoute']);

//setting views


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

    //load specific user info
    $scope.loadPatientInfo = function(id){
        console.log(id);
        $http.get('/patientLists/' + id).success(function(response){
            $scope.specPatientInfo = response;
            console.log(response);
        });
    };


    //calculate risk based on database records
    $scope.calculateRiskBasedOnRecords = function(){
        var age = document.getElementById('patientAge').value;
        var pointsLDL = 0;

        //section to categorise age and assign points based database records

        if (age<=34){
            pointsLDL = -9;
            alert (pointsLDL);
        }
        else if(age<=39){
            pointsLDL = -4;
            alert(pointsLDL);
        }
        else if(age<=44){
            pointsLDL = 0;
            alert(pointsLDL);
        }
        else if(age<=49){
            pointsLDL = 3;
            alert(pointsLDL);
        }
        else if(age<=54){
            pointsLDL = 6;
            alert(pointsLDL);
        }
        else if(age<=59){
            pointsLDL = 7;
            alert(pointsLDL);
        }
        else if(age<=64){
            pointsLDL = 8;
            alert(pointsLDL);
        }
        else if(age<=74){
            pointsLDL = 8;
            alert(pointsLDL);
        }


    };

});


