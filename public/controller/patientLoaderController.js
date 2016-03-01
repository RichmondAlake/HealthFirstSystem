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
        var sbp = document.getElementById('patientsystolicbp').value;
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


        /** need to send the calculated risk result back to the database **/

        $scope.saveAllEntry();
    };

    $scope.calculateRiskBasedOnEntry = function () {
        //enable save button
        var saveButtonEntry = document.getElementById('saveEntryButton').disabled = false;

        //enable all input boxes to become accessible
        var age = document.getElementById('patientAge').readOnly = false;
        var chol = document.getElementById('patientChol').readOnly = false;
        var dbp = document.getElementById('patientdiastolicbp').readOnly = false;
        var dbp = document.getElementById('patientsystolicbp').readOnly = false;
        var gender = document.getElementById('patientGender').readOnly = false;
        var medication = document.getElementById('patientMedication').readOnly = false;
        var smoker = document.getElementById('patientSmoker').readOnly = false;


    };

    $scope.saveAllEntry = function(){

        //get current time when the button is clicked
        var currentFullTime = new Date();
        //var currentYear = currentFullTime.getYear().toString();
        var currentMonth = currentFullTime.getMonth();
        //var currentDay = currentFullTime.getDay();

        //setting months association with number returned from function
        if (currentMonth == 0){
            currentMonth = 'January';
        }
        else if (currentMonth == 1){
            currentMonth = 'February'
        }
        else if (currentMonth == 2){
            currentMonth = 'March'
        }
        else if (currentMonth == 3){
            currentMonth = 'April'
        }
        else if (currentMonth == 4){
            currentMonth = 'May'
        }
        else if (currentMonth == 5){
            currentMonth = 'June'
        }
        else if (currentMonth == 6){
            currentMonth = 'July'
        }
        else if (currentMonth == 7){
            currentMonth = 'August'
        }
        else if (currentMonth == 8){
            currentMonth = 'September'
        }
        else if (currentMonth == 9){
            currentMonth = 'October'
        }
        else if (currentMonth == 10){
            currentMonth = 'November'
        }
        else if (currentMonth == 11){
            currentMonth = 'December'
        }



        //enable all input boxes to become accessible
        var age = document.getElementById('patientAge').readOnly = true;
        var chol = document.getElementById('patientChol').readOnly = true;
        var dbp = document.getElementById('patientdiastolicbp').readOnly = true;
        var dbp = document.getElementById('patientsystolicbp').readOnly = true;
        var gender = document.getElementById('patientGender').readOnly = true;
        var medication = document.getElementById('patientMedication').readOnly = true;
        var smoker = document.getElementById('patientSmoker').readOnly = true;

        $scope.specPatientInfo.age = document.getElementById('patientAge').value;
        $scope.specPatientInfo.cholesterol = document.getElementById('patientChol').value;
        $scope.specPatientInfo.diastolicbp= document.getElementById('patientdiastolicbp').value;
        $scope.specPatientInfo.systolicbp = document.getElementById('patientsystolicbp').value;
        $scope.specPatientInfo.gender = document.getElementById('patientGender').value;
        $scope.specPatientInfo.medication = document.getElementById('patientMedication').value;
        $scope.specPatientInfo.smoker = document.getElementById('patientSmoker').value;


        //adding currentFullTime and CurrentMonth into the specPatientInfo object
        $scope.specPatientInfo.currentFullTime = currentFullTime;
        $scope.specPatientInfo.currentMonth = currentMonth;


        $http.put('/patientLists/' + $scope.specPatientInfo._id, $scope.specPatientInfo).success( function (request, response){

            console.log(response);

        });

    };

    //creating function for loading current graph data
    $scope.loadGraph = function(){
        //array to store values to plot on graph
        var yearLabels = [];
        var CVDRisks = [];

        //assign length of array that store CVD risk values to variable
        var CVDRiskValueArrayLength = $scope.specPatientInfo.riskstoreddata.length;

        //for loop to loop through object in array and push results onto assigned arrays
        for(var i = 0; i < CVDRiskValueArrayLength; i++ ){
            yearLabels.push($scope.specPatientInfo.riskstoreddata[i].currentMonth);
            CVDRisks.push($scope.specPatientInfo.riskstoreddata[i].calculatedrisk);
        }



        var data = {
            labels : yearLabels, //months
            series: [CVDRisks] // CVD results
        };

        var options = {
            width: 1500,
            height: 500,
            axisY : {
                onlyInteger : true
            }
        };

        new Chartist.Line('.ct-chart',data, options);
    }

});


