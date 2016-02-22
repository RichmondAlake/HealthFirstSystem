var myApp = angular.module('myApp', ['ngRoute']);

//setting views


//Controller to load all database in the patients database (not used)
myApp.controller('allPatientLoad', function ($scope, $http) {

    //on click of button load all patient within the database
    $scope.loadAAllPat = function () {
        console.log('sent request for all patient');
        $http.get('/patientList').success(function (response) {
            $scope.patientList = response;
        });
    };
});


//Controller to load assigned patients of searched Clinicians
//modify later to get patients of the signed in clinicians...only takes in the full name
myApp.controller('allSpecPatient', function ($scope, $http) {

    //load patients assigned to clinicians onclick
    $scope.loadSpecPat = function (clinician) {
        alert(clinician);
        console.log('sent request for patients assigned to' + clinician);
        $http.get('/patientList/' + clinician).success(function (response) {
            $scope.patientList = response;

        });
    };

    //load specific user info
    $scope.loadPatientInfo = function (id) {
        console.log(id);
        $http.get('/patientLists/' + id).success(function (response) {
            $scope.specPatientInfo = response;
            console.log(response);
        });
    };


    //calculate risk based on database records
    $scope.calculateRiskBasedOnRecords = function () {
        var age = document.getElementById('patientAge').value;
        var chol = document.getElementById('patientChol').value;
        var dbp = document.getElementById('patientdiastolicbp').value;
        var dbp = document.getElementById('patientsystolicbp').value;
        var gender = document.getElementById('patientGender').value;
        var medication = document.getElementById('patientMedication').value;
        var smoker = document.getElementById('patientSmoker').value;

        var pointsLDL = 0; //firstly initialised here


        //section to categorise AGE and assign points based database records

        if (age <= 34) {
            pointsLDL = -9;

        }
        else if (age <= 39) {
            pointsLDL = -4;

        }
        else if (age <= 44) {
            pointsLDL = 0;

        }
        else if (age <= 49) {
            pointsLDL = 3;

        }
        else if (age <= 54) {
            pointsLDL = 6;

        }
        else if (age <= 59) {
            pointsLDL = 7;

        }
        else if (age <= 64) {
            pointsLDL = 8;

        }
        else if (age <= 74) {
            pointsLDL = 8;

        }

        //section to categorise CHOLESTEROL and assign points based database records
        //using (mg/dl), *** should create a system where both can be used
        /** (mg/dl)**/
        if (chol <= 160) {
            pointsLDL += -2;
            alert(pointsLDL);
        }
        else if (chol <= 199) {
            pointsLDL += 0;
            alert(pointsLDL);
        }
        else if (chol <= 239) {
            pointsLDL += 1;
            alert(pointsLDL);
        }
        else if (chol <= 279) {
            pointsLDL += 1;
            alert(pointsLDL);
        }
        else if (chol <= 280) {
            pointsLDL += 3;
            alert(pointsLDL);
        }


    };

    $scope.calculateRiskBasedOnEntry = function () {
        //enable all input boxes to become accessible
        var age = document.getElementById('patientAge').readOnly = false;
        var chol = document.getElementById('patientChol').readOnly = false;
        var dbp = document.getElementById('patientdiastolicbp').readOnly = false;
        var dbp = document.getElementById('patientsystolicbp').readOnly = false;
        var gender = document.getElementById('patientGender').readOnly = false;
        var medication = document.getElementById('patientMedication').readOnly = false;
        var smoker = document.getElementById('patientSmoker').readOnly = false;


        //show a message in the browser that tells the users they can now edit the fields and entry
        //change the text in the button to "Save records and calculate and the colour to blue"
        //save all the entry to the database and modify the current records
    }

    scope.saveAllEntry = function(){

    }

});


