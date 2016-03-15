//load angular beforehand
//document.write('<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.0-rc.2/angular.min.js"></script>');
//document.write('<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0rc1/angular-route.min.js"></script>');


//loading neccesary functions on page load
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

//Controller to load all database in the patients database (not used)
myApp.controller('patientDashboard', function ($scope, $http) {

    //on click of button load all patient within the database
    $scope.SearchPatient = function (nhsnumber) {
        console.log('sending request for patient: ' + nhsnumber);
        $http.get('/patient/' + nhsnumber).success(function (response) {
            $scope.patientInfo = response;
        });
    };

    //creating function for loading current graph data
    $scope.loadGraphPatientDashBoard = function () {

        //array to store values to plot on graph
        var yearLabels = [];
        var CVDRisks = [];

        //assign length of array that store CVD risk values to variable
        var CVDRiskValueArrayLength = $scope.patientInfo.riskstoreddata.length;

        //for loop to loop through object in array and push results onto assigned arrays
        for (var i = 0; i < CVDRiskValueArrayLength; i++) {
            yearLabels.push($scope.patientInfo.riskstoreddata[i].currentMonth);
            CVDRisks.push($scope.patientInfo.riskstoreddata[i].calculatedrisk);
        }


        var data = {
            labels: yearLabels, //months
            series: [CVDRisks] // CVD results
        };

        var options = {
            width: 700,
            height: 500,
            high: 100,
            low: 0,
            axisY: {
                onlyInteger: true,
                labelInterpolationFnc: function (value) {
                    return value + '%';
                }
            }
        };

        new Chartist.Line('.ct-chart', data, options);

    };

    $scope.SavePatientInformation = function () {
        $scope.firstname = document.getElementById('patientEntryFirstName').value;
        alert($scope.firstname);
        $scope.patientInfo.firstname = $scope.firstname;
        alert($scope.patientInfo.firstname);

        $scope.lastname = document.getElementById('patientEntryLastName').value;
        $scope.patientInfo.lastname = $scope.lastname;

        $scope.age = document.getElementById('patientEntryAge').value;
        $scope.patientInfo.age = $scope.age;

        $scope.address = document.getElementById('patientEntryAddress').value;
        $scope.patientInfo.address = $scope.address;

        $scope.phonenumber = document.getElementById('patientEntryPhoneNumber').value;
        $scope.patientInfo.phonenumber = $scope.phonenumber;

        $scope.email = document.getElementById('patientEntryEmail').value;
        $scope.patientInfo.email = $scope.email;


        $http.put('/patientUpdate/' + $scope.patientInfo._id, $scope.patientInfo).success(function (request, response) {

            console.log(response);

        });


    };


    //function that handles appointments and displays clinicians information within the patient's dashboard
    $scope.BookAppointment = function (clinician) {
        //get all assigned clinician's detail
        console.log("Getting details of : " + clinician);
        //$scope.clinician = clinician;

        //make request to the database for clinician details
        $http.get('/clinician/' + clinician).success(function (response) {
            $scope.clinicianDetails = response;
            //console.log("Details of the clinicians is held here : " + response);
            console.log($scope.clinicianDetails);
            console.log($scope.clinicianDetails[0]);


        });


    }
});


//Controller to load assigned patients of searched Clinicians
//modify later to get patients of the signed in clinicians...only takes in the full name
myApp.controller('allSpecPatient', function ($scope, $http) {

    //load patients assigned to clinicians onclick
    window.onload = $scope.loadSpecPat = function (clinician) {
        clinician = " "; //clinicians is always empty space, comment this line to make it search box name
        //alert(clinician);
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
            //console.log($scope.specPatientInfo.recommendations);
            console.log(response);

        });
    };


    //calculate risk based on database records
    $scope.calculateRiskBasedOnRecords = function () {

        $scope.saveAllEntry();

    };

    $scope.calculateRiskBasedOnEntry = function () {
        //enable save button
        var saveButtonEntry = document.getElementById('saveEntryButton').disabled = false;

        //enable all input boxes to become accessible
        var age = document.getElementById('patientAge').readOnly = false;
        var chol = document.getElementById('patientCholesterol').readOnly = false;
        var dbp = document.getElementById('patientdiastolicbp').readOnly = false;
        var dbp = document.getElementById('patientsystolicbp').readOnly = false;
        var gender = document.getElementById('patientGender').readOnly = false;
        var medication = document.getElementById('patientMedication').readOnly = false;
        var smoker = document.getElementById('patientSmoker').readOnly = false;
        var hdcl = document.getElementById('patienthdlc').readOnly = false;


    };

    // using this function to invoke the calculation for patient.
    $scope.saveAllEntryPatientDashboard = function(){
        $scope.loadPatientInfo($scope.patientInfo._id);
        $scope.saveAllEntry();

    };

    $scope.saveAllEntry = function () {

        //disable button as soon as function is invoked
        var saveButtonEntry = document.getElementById('saveEntryButton').disabled = true;

        //get current time when the button is clicked
        var currentFullTime = new Date();
        //var currentYear = currentFullTime.getYear().toString();
        var currentMonth = currentFullTime.getMonth();
        //var currentDay = currentFullTime.getDay();

        //setting months association with number returned from function
        if (currentMonth == 0) {
            currentMonth = 'January';
        }
        else if (currentMonth == 1) {
            currentMonth = 'February'
        }
        else if (currentMonth == 2) {
            currentMonth = 'March'
        }
        else if (currentMonth == 3) {
            currentMonth = 'April'
        }
        else if (currentMonth == 4) {
            currentMonth = 'May'
        }
        else if (currentMonth == 5) {
            currentMonth = 'June'
        }
        else if (currentMonth == 6) {
            currentMonth = 'July'
        }
        else if (currentMonth == 7) {
            currentMonth = 'August'
        }
        else if (currentMonth == 8) {
            currentMonth = 'September'
        }
        else if (currentMonth == 9) {
            currentMonth = 'October'
        }
        else if (currentMonth == 10) {
            currentMonth = 'November'
        }
        else if (currentMonth == 11) {
            currentMonth = 'December'
        }


        //enable all input boxes to become accessible
        var age = document.getElementById('patientAge').readOnly = true;
        var chol = document.getElementById('patientCholesterol').readOnly = true;
        var dbp = document.getElementById('patientdiastolicbp').readOnly = true;
        var dbp = document.getElementById('patientsystolicbp').readOnly = true;
        var gender = document.getElementById('patientGender').readOnly = true;
        var medication = document.getElementById('patientMedication').readOnly = true;
        var smoker = document.getElementById('patientSmoker').readOnly = true;
        var diabeticYes = document.getElementById('patientDiabeticYes').readOnly = true;
        var diabeticNo = document.getElementById('patientDiabeticNo').readOnly = true;
        var hdlc = document.getElementById('patienthdlc').readOnly = true;

        console.log(document.getElementById('patientMedication').value);
        $scope.specPatientInfo.medication = document.getElementById('patientMedication').value; //not needed


        /** START**/
        //automatically setting the patient value to male, unless changed by the user
        var patient = "male";
        //LDL_C is initialised as the choice unless changed to Cholesterol by the user
        var choice = "LDL_C";
        //mg/dl is the default measurement for the system unless changed to mmol/L by the user
        var measurement = "mg/dL";
        var HDLCmeasurement = "mg/dL";

        function getChoice(value) {
            choice = value; //getting the choice
        }

        function getPatient(value) {
            patient = value; //gets the male or female option
        }

        function getMeasurement(value) {
            measurement = value; //gets the measurement for LDL_C or Cholestrol
        }

        function getHDLCMeasurement(value) {
            HDLCmeasurement = value; //gets the measurement for HDLC (as mg/dL or mmol/L; SIMILAR to LDLC/Cholestrol)
        }


        //getting patient age from value within text box
        $scope.specPatientInfo.age = document.getElementById('patientAge').value;

        //checking if patient is diabetic, assigning yes or no values based on checked checkbox
        if (document.getElementById('patientDiabeticYes').checked) {
            $scope.specPatientInfo.diabetic = "Yes";
        } else if (document.getElementById('patientDiabeticNo').checked) {
            $scope.specPatientInfo.diabetic = "No";
        }

        //checking if patient is smoker, assigning yes or no values based on checked checkbox
        if (document.getElementById('patientSmokerYes').checked) {
            $scope.specPatientInfo.smoker = "Yes";
        } else if (document.getElementById('patientSmokerNo').checked) {
            $scope.specPatientInfo.smoker = "No";
        }

        //getting the LDL_C and cholesterol selection code
        $scope.specPatientInfo.cholesterol = document.getElementById('patientCholesterol').value;

        //getting the HDL_C value
        $scope.specPatientInfo.hdlc = document.getElementById('patienthdlc').value;


        //getting the diastolic bp and systolic bp
        $scope.specPatientInfo.diastolicbp = document.getElementById('patientdiastolicbp').value;
        $scope.specPatientInfo.systolicbp = document.getElementById('patientsystolicbp').value;

        //getting age point
        var agePoint = getAgePoints($scope.specPatientInfo.age);
        //getting user gender
        $scope.specPatientInfo.gender = document.getElementById('patientSexChoice').value;
        //getting blood pressure point
        var BPPoint = getBPPoints($scope.specPatientInfo.diastolicbp, $scope.specPatientInfo.systolicbp);
        //getting diabetic point
        var diabeticPoint = getDiabetesPoints($scope.specPatientInfo.diabetic);
        //getting smoker point
        var smokerPoint = getDiabetesPoints($scope.specPatientInfo.smoker);
        //getting the Cholesterol point
        if (clinicianCholesterolChoice == "LDL_C") {
            var cholesterolPoint = getLDLCPoints($scope.specPatientInfo.cholesterol);
        } else {
            var cholesterolPoint = getCholPoints($scope.specPatientInfo.cholesterol);
        }
        //getting HDL point
        var HDL_CPoint = getHDLCPoints($scope.specPatientInfo.hdlc);

        //outputting all the points
        console.log(agePoint, BPPoint, cholesterolPoint, HDL_CPoint, diabeticPoint, smokerPoint);
        //getting points total
        var PointsTotal = agePoint + diabeticPoint + smokerPoint + HDL_CPoint + cholesterolPoint + BPPoint;

        //GETCHDRISK
        var patientCHDRisk = getCHDRisk(PointsTotal);
        document.getElementById('resultContent').innerHTML = "Total Points: " + PointsTotal + "  Risk: " + patientCHDRisk + " &#37";
        // placing calculated risk points and percentage to specPatientInfo body
        $scope.specPatientInfo.riskPercentage = patientCHDRisk;
        $scope.specPatientInfo.riskPoint = PointsTotal;


        var comparativeRisk = getComparativeRisk($scope.specPatientInfo.age);
        console.log(comparativeRisk[0] + "," + comparativeRisk[1] + "," + comparativeRisk[2] + "," + comparativeRisk[3]);
        var contentHTML = "<table class = 'table'><tr><th>Age</th><th>Average</th><th>Hard Average</th><th>Low Average</th></tr><tr><td>" + comparativeRisk[0] + " &#37 </td><td>" + comparativeRisk[1] + " &#37 </td><td>" + comparativeRisk[2] + " &#37 </td><td>" + comparativeRisk[3] + " &#37 </td></tr></table>";
        document.getElementById('comparativeRisk').innerHTML = contentHTML;

        if (patientCHDRisk > 20) {
            document.getElementById('systemAdvice').innerHTML = "Advice : Place advice for less than 20%";
        } else if (patientCHDRisk > 40) {
            document.getElementById('systemAdvice').innerHTML = "Advice : Place advice for less than 40%";
        } else if (patientCHDRisk > 60) {
            document.getElementById('systemAdvice').innerHTML = "Advice : Place advice for less than 80%";
        } else if (patientCHDRisk > 80) {
            document.getElementById('systemAdvice').innerHTML = "Advice : Place advice for less than 100%";
        }


        //adding currentFullTime and CurrentMonth into the specPatientInfo object
        $scope.specPatientInfo.currentFullTime = currentFullTime;
        $scope.specPatientInfo.currentMonth = currentMonth;

        function getAgePoints(age) {
            var agePoints = [["30-34", -1, -9], ["35-39", 0, -4], ["40-44", 1, 0], ["45-49", 2, 3], ["50-54", 3, 6], ["55-59", 4, 7], ["60-64", 5, 8], ["65-69", 6, 8], ["70-74", 7, 8]];
// Array is set out as [ AGE RANGE, MALE Age Point, Female Age Point]
            if (age < 30) {
                alert("Invalid Input"); //These need to be improved further. ie. not let it continue.. etc.. i.e. keep the 'ok' button disabled.
                return 0;
            }
            else if (age >= 75) { //for max and min I used the if statement  because it says less than (<) 160 I can't include under 0, etc hence if statement was used. same goes for MAX
                alert("Invalid Input"); // as b4 the error trapping needs to be done in the onchange function
                return 0;
            } else {
                for (var i = 0; i < agePoints.length; i++) {
                    var match = false; // match is initailised as false

                    var min = parseInt(agePoints[i][0].substring(2, 0)); //extracts min and max range
                    var max = parseInt(agePoints[i][0].slice(3, 6));

                    for (var x = min; x <= max; x++) {
                        if (age == x) //age is compared against the Age range of each "Age group"
                        {//WORKING NOW! WEIRD. I did === for all the others and it seems to work BUT
                            //For this particular one it didn't so had to use == instead.
                            match = true; //We have a MATCH
                            break;
                        }
                    }

                    if (match) {
                        if (patient === "male") {
                            alert(agePoints[i][1]);
                            return agePoints[i][1];
                        }
                        else {
                            alert(agePoints[i][2]);
                            return agePoints[i][2];
                        }
                        break;
                    }
                }
//NOTE: the return statements are within IF statement. its a function unlike Java methods hence shouldn't have a problem as it DOESN'T expect a Return
            }
        }


        function getDiabetesPoints(diabetic) //boolean diabetic
        {
            if (patient === "male") {
                if (diabetic) {
                    return 2;
                } else {
                    return 0;
                }
            } else { //if female
                if (diabetic) {
                    return 4;
                } else {
                    return 0;
                }
            }
        }


        function getSmokerPoints(smoker) //smoker point for male and female are the same.
        {
            if (smoker) {
                return 2;
            } else {
                return 0;
            }
        }


        function getCholPntMG(cholestrol, cholestrolPoints) {
            if (cholestrol < 160) {
                if (patient === "male") {
                    return -3;
                } else {
                    return -2;
                }
            }
            else if (cholestrol >= 280) { //for max and min I used the if statement  because it says less than (<) 160 I can't include under 0, etc hence if statement was used. same goes for MAX
                return 3; // returns 3 for male and female
            } else {
                for (var i = 2; i <= cholestrolPoints.length - 2; i++) {
                    var match = false; // match is initailised as false

                    var min = parseInt(cholestrolPoints[i][0].substring(3, 0)); //extracts min and max range
                    var max = parseInt(cholestrolPoints[i][0].slice(4, 7));

                    for (var x = min; x <= max; x++) {
                        if (cholestrol === x)
                            match = true;
                    }

                    if (match) {
                        if (patient === "male")
                            return cholestrolPoints[i][2];
                        else
                            return cholestrolPoints[i][3];// For female
                        break;
                    }
                }
            }
        }

        function getCholPntMMOL(cholestrol, cholestrolPoints) {
// This code is similar to getCholPtsMG.. and is "INSPIRED" by it.
            if (cholestrol < 4.14) {
                if (patient === "male") {
                    return -3;
                } else {
                    return -2;
                }
            }
            else if (cholestrol >= 7.25) {
                return 3;
            } else {
                for (var i = 2; i <= cholestrolPoints.length - 2; i++) {
                    var match = false;

                    var min = parseFloat(cholestrolPoints[i][1].substring(4, 0)); //extracts min and max range
                    var max = parseFloat(cholestrolPoints[i][1].slice(5, 9));

                    for (var x = min; x <= max; x += 0.01) {
                        if (cholestrol == x) {
                            match = true;
                            break;
                        }
                    }

                    if (match) {
                        if (patient === "male")
                            return cholestrolPoints[i][2];
                        else
                            return cholestrolPoints[i][3];
                        break; //Not sure if this is necessary
                    }
                }
            }
        }

        function getCholPoints(cholestrol, measurement) {
            var cholestrolPoints = [["mg/dL", "mmol/L", "Male Cholestrol pts", "Female Cholestrol"], ["0-159", "0-4.14", -3, -2], ["160-199", "4.15-5.17", 0, 0], ["200-239", "5.18-6.21", 1, 1], ["240-279", "6.22-7.24", 2, 1], [">=280", ">=7.25", 3, 3]];
//This code/algorithmn is quite heavily based on AgePoint Algorithm so it might have bug

            if (measurement === "mg/dL") {
                return getCholPntMG(cholestrol, cholestrolPoints);
            } else { //if measurement type = mmol/L
                return getCholPntMMOL(cholestrol, cholestrolPoints);
            }
        }


        function getLDLCPntMG(LDL_C, LDLCPoints) {
            if (LDL_C < 100) {
                if (patient === "male") {
                    return -3;
                } else {
                    return -2;
                }
            }
            else if (LDL_C >= 190) {
                return 2;
            }
            else {
                for (var i = 2; i <= LDLCPoints.length - 2; i++) {
                    var match = false; // match is initailised as false

                    var min = parseInt(LDLCPoints[i][0].substring(3, 0)); //extracts min and max range
                    var max = parseInt(LDLCPoints[i][0].slice(4, 7));

                    for (var x = min; x <= max; x++) {
                        if (LDL_C == x)
                            match = true;
                    }

                    if (match) {
                        if (patient === "male")
                            return LDLCPoints[i][2];
                        else
                            return LDLCPoints[i][3];// For female
                        break;
                    }
                }
            }
        }

        function getLDLCPntMMOL(LDL_C, LDLCPoints) {
// This code is similar to getCholPtsMG.. and is "INSPIRED" by it.
            if (LDL_C < 2.59) {
                if (patient === "male") {
                    return -3;
                } else {
                    return -2;
                }
            }
            else if (LDL_C >= 4.92) {
                return 2; //male and female returns 2
            } else {
                for (var i = 2; i <= LDLCPoints.length - 2; i++) {
                    var match = false;

                    var min = parseFloat(LDLCPoints[i][1].substring(4, 0)); //extracts min and max range
                    var max = parseFloat(LDLCPoints[i][1].slice(5, 9));

                    for (var x = min; x <= max; x += 0.01) {
                        if (LDL_C == x) {
                            match = true;
                            break;
                        }
                    }

                    if (match) {
                        if (patient === "male")
                            return LDLCPoints[i][2];
                        else
                            return LDLCPoints[i][3];
                        break; //Not sure if this is necessary
                    }
                }
            }
        }

        function getLDLCPoints(LDL_C) //LDL_C, measurement
        {
            var LDLCPoints = [["mg/dL", "mmol/L", "Male Cholestrol pts", "Female Cholestrol"], ["0-99", "0-2.59", -3, -2], ["100-129", "2.60-3.36", 0, 0], ["130-159", "3.37-4.14", 0, 0], ["160-190", "4.15-4.92", 1, 2], [">=190", ">=4.92", 2, 2]];
//This code/algorithmn is quite heavily based on getCholPoints Algorithm

            if (measurement === "mg/dL") {
                return getLDLCPntMG(LDL_C, LDLCPoints);
            } else { //if measurement type = mmol/L
                return getLDLCPntMMOL(LDL_C, LDLCPoints);
            }
        }


        function getHDLCPtsMG(HDL_C, HDLCPoints) {
            if (HDL_C < 35) {
                if (choice === "LDL_C") {
                    if (patient === "male")
                        return HDLCPoints[1][2];
                    else
                        return HDLCPoints[1][3];
                } else {// IF Cholestrol
                    if (patient === "male")
                        return HDLCPoints[1][4];
                    else
                        return HDLCPoints[1][5];
                }
            }
            else if (HDL_C >= 60) {
                if (choice === "LDL_C") {
                    if (patient === "male")
                        return HDLCPoints[5][2];
                    else
                        return HDLCPoints[5][3];
                } else {// IF Cholestrol
                    if (patient === "male")
                        return HDLCPoints[5][4];
                    else
                        return HDLCPoints[5][5];
                }
            }
            else {
                for (var i = 2; i <= HDLCPoints.length - 2; i++) {
                    var match = false; // match is initailised as false

                    var min = parseInt(HDLCPoints[i][0].substring(2, 0)); //extracts min and max range
                    var max = parseInt(HDLCPoints[i][0].slice(3, 6));

                    for (var x = min; x <= max; x++) {
                        if (HDL_C == x) //Had to do same here == instead of ===
                            match = true;
                    }
                    /*
                     This WORKS too as the 2 - 4 for LDL and CHOL are SAME. BUT I am implementing the one below to make it more "ADAPTABLE"-ish
                     if(patient === "male")
                     return HDLCPoints[i][2];
                     else
                     return HDLCPoints[i][3];// For female
                     break; */
                    if (match) {
                        if (choice === "LDL_C")//try == might work  THIS LINE IS PROBABLY BUGGY RIGHT NOW
                        {
                            if (patient === "male")
                                return HDLCPoints[i][2];
                            else
                                return HDLCPoints[i][3];
                        } else {// IF Cholestrol
                            if (patient === "male")
                                return HDLCPoints[i][4];
                            else
                                return HDLCPoints[i][5];
                        }
                    }
                }
            }
        }


        function getHDLCPtsMMOL(HDL_C, HDLCPoints)  //TEST THIS esp less than and more than
        {
// This code is similar to getLDLCPntMMOL.. and is "INSPIRED" by it.
            if (HDL_C < 0.9) {
                if (patient === "male") {
                    if (choice == "LDL_C")
                        return HDLCPoints[1][2]; //Male LDL-C Point
                    else
                        return HDLCPoints[1][4]; //Male Cholestrol Points
                } else {
                    if (choice == "LDL_C")
                        return HDLCPoints[1][3];//Female LDL-C Point in the Array
                    else
                        return HDLCPoints[1][5]; //Female Chol Points
                }
            }
            else if (HDL_C >= 1.56) { //Similar to Least but for Most
                if (patient === "male") {
                    if (choice === "LDL_C")
                        return HDLCPoints[5][2];
                    else
                        return HDLCPoints[5][4];
                } else {
                    if (choice === "LDL_C")
                        return HDLCPoints[5][3];
                    else
                        return HDLCPoints[5][5];
                }
            }
            else {
                for (var i = 2; i <= HDLCPoints.length - 2; i++) {
                    var match = false;

                    var min = parseFloat(HDLCPoints[i][1].substring(4, 0)); //extracts min and max range
                    var max = parseFloat(HDLCPoints[i][1].slice(5, 9));

                    console.log("Testing Mmol");
                    console.log(min, max);
                    console.log(HDL_C);

                    for (var x = min; x <= max; x += 0.01) {
                        if (HDL_C == x) {//x has been parseFloat so it now a float.  == allows the comparison between 1.29 and "1.29"
                            console.log(x, HDL_C);
                            match = true;
                            break;
                        }
                    }

                    if (match) {
                        if (patient === "male")
                            return HDLCPoints[i][2];
                        else
                            return HDLCPoints[i][3];
                        break; //Not sure if this is necessary
                    }
                }
            }
        }

        function getHDLCPoints(HDL_C) {
            var HDLCPoints = [["mg/dL", "mmol/L", "Male LDL pts", "Female LDL pts", "Male Cholestrol pts", "Female Cholestrol pts"], ["0-34", "0-0.90", 2, 5, 2, 5], ["35-44", "0.91-1.16", 1, 2, 1, 2], ["45-49", "1.17-1.29", 0, 1, 0, 1], ["50-59", "1.30-1.55", 0, 0, 0, 0], [">=60", ">=1.56", -1, -2, -2, -3]];

            if (HDLCmeasurement === "mg/dL") {
                return getHDLCPtsMG(HDL_C, HDLCPoints);
            } else {
                return getHDLCPtsMMOL(HDL_C, HDLCPoints);
            }
        }


        function getFemaleCHDRisk(pointsTotal) {
            var CHDRisk = [[-2, "1", "1"], [-1, "2", "2"], [0, "2", "2"], [1, "2", "2"], [2, "3", "3"], [3, "3", "3"], [4, "4", "4"], [5, "5", "4"], [6, "6", "5"], [7, "7", "6"], [8, "8", "7"], [9, "9", "8"], [10, "11", "10"], [11, "13", "11"], [12, "15", "13"], [13, "17", "15"], [14, "20", "18"], [15, "24", "20"], [16, "27", "24"], [17, ">=32", ">=27"]];

            if (pointsTotal <= -2) {
                return CHDRisk[0][1]; //SAME value for LDL and CHOL so only one line
            } else if (pointsTotal >= 17) {
                if (choice == "LDL_C")
                    return CHDRisk[19][1];
                else
                    return CHDRisk[19][2];
            } else {
                for (var i = 1; i < CHDRisk.length; i++) {
                    if (pointsTotal == CHDRisk[i][0]) // was ===
                    {
                        if (choice == "LDL_C")
                            return CHDRisk[i][1]; //if its matches the LDL pts column its outputs its corresponding RISK
                        else
                            return CHDRisk[i][2];
                    }
                }
            }
        }


        function getCHDRiskLDLMale(pointsTotal) { //<-3, 1 and >=14, >=56%.  <-3, etc left out so it can be compared to integer.
//% column as string cuz >=56(%), also can be output/displayed on html as it is

            var CHDRiskLDL = [[-3, "1"], [-2, "2"], [-1, "2"], [0, "3"], [1, "4"], [2, "4"], [3, "6"], [4, "7"], [5, "9"], [6, "11"], [7, "14"], [8, "18"], [9, "22"], [10, "27"], [11, "33"], [12, "40"], [13, "47"], [14, ">=56"]];

            if (pointsTotal < -3) {
                return CHDRiskLDL[0][1]; //THIS idea can be applied on the OTHER ones too. Called the array[0][1] instead of EXACT number..
            } else if (pointsTotal >= 14) {
                return CHDRiskLDL[17][1];
            } else {
                for (var i = 1; i < CHDRiskLDL.length - 1; i++) //might need to be -3 or something or -1.. -2 makes it weird?
                {
                    if (pointsTotal == CHDRiskLDL[i][0])// was ===
                    {
                        return CHDRiskLDL[i][1]; //if its matches the LDL pts column its outputs its corresponding RISK
                    }
                }
            }
        }

        function getCHDRiskCHOLMale(pointsTotal) { //inspred by getCHDRiskLDLMale(pointsTotal)

            var CHDRiskCHOL = [[-1, "2"], [0, "3"], [1, "3"], [2, "4"], [3, "5"], [4, "7"], [5, "8"], [6, "10"], [7, "13"], [8, "16"], [9, "20"], [10, "25"], [11, "31"], [12, "37"], [13, "45"], [14, ">=53"]];

            if (pointsTotal <= -1) //<= -1 has to be assumed instead of < -1.. or else undefined comes up when entering -1, etc..
            {
                return CHDRiskCHOL[0][1];
            } else if (pointsTotal >= 14) {
                return CHDRiskCHOL[15][1];
            } else {
                for (var i = 1; i < CHDRiskCHOL.length; i++) //no need to - by anything cuz i does not start with 2 => (i=2; i<xyz etc..)
                {
                    if (pointsTotal == CHDRiskCHOL[i][0]) //was ===
                    {
                        return CHDRiskCHOL[i][1]; //if its matches the LDL pts column its outputs its corresponding RISK
                    }
                }
            }
        }


        function getCHDRisk(pointsTotal) {
            if (patient === "male") {
                if (choice === "LDL_C") //*** Warning since all the values of male, ldlc are if or else. care these might be a LOOPHOLE
                    return getCHDRiskLDLMale(pointsTotal);
                else
                    return getCHDRiskCHOLMale(pointsTotal);
            } else {
                return getFemaleCHDRisk(pointsTotal); //One for Female because LDL pts and Chol pts colum was same;
            }
        }


        function getComparativeRiskFemale(age) {//Inspired form the Male Version.
            var myArray = ["", "", "", ""];
            var RiskTable = [["30-34", "<1", "<1", "<1"], ["35-39", "<1", "<1", "1"], ["40-44", "2", "1", "2"], ["45-49", "5", "2", "3"], ["50-54", "8", "3", "5"], ["55-59", "12", "7", "7"], ["60-64", "12", "8", "8"], ["65-69", "13", "8", "8"], ["70-74", "14", "11", "8"]];

            for (var i = 0; i < RiskTable.length; i++) {
                var match = false;
                var min = parseInt(RiskTable[i][0].substring(2, 0));
                var max = parseInt(RiskTable[i][0].slice(3, 6));

                for (var x = min; x <= max; x++) {
                    if (age == x) //age is compared against the Age range of each "Age group"
                    {
                        match = true;
                        break;
                    }
                }

                if (match) {
                    for (var pointer = 0; pointer <= 3; pointer++) {
                        myArray[pointer] = RiskTable[i][pointer];
                    }
                    break;
                }
            }
            return myArray;
        }

        function getComparativeRiskMale(age) {
            var myArray = ["", "", "", ""];
            var RiskTable = [["30-34", 3, 1, 2], ["35-39", 5, 4, 3], ["40-44", 7, 4, 4], ["45-49", 11, 8, 4], ["50-54", 14, 10, 6], ["55-59", 16, 13, 7], ["60-64", 21, 20, 9], ["65-69", 25, 22, 11], ["70-74", 30, 25, 14]];

            for (var i = 0; i < RiskTable.length; i++) {
                var match = false;
                var min = parseInt(RiskTable[i][0].substring(2, 0)); //extracts min and max range
                var max = parseInt(RiskTable[i][0].slice(3, 6));
                for (var x = min; x <= max; x++) {
                    if (age == x) //age is compared against the Age range of each "Age group"
                    {//WORKING NOW! WEIRD. I did === for all the others and it seems to work BUT
                        //For this particular one it didn't so had to use == instead.
                        match = true; //We have a MATCH
                        console.log("catch", x);
                        break;
                    }
                }

                if (match) {
                    for (var pointer = 0; pointer <= 3; pointer++) {
                        myArray[pointer] = RiskTable[i][pointer];
                    }
                    break;
                }
            }
            return myArray;
        }

        function getComparativeRisk(age) {
            if (patient === "male")
                return getComparativeRiskMale(age);
            else
                return getComparativeRiskFemale(age)
        }


        function getDiastolicPoints(dInput) {
            var diastolicPts = [["<80", 0, -3], ["80-84", 0, 0], ["85-89", 1, 0], ["90-99", 2, 2], [">=100", 3, 3]];

            if (dInput < 80) {
                if (patient === "male")
                    return diastolicPts[0][1];
                else
                    return diastolicPts[0][2];
            }
            else if (dInput >= 100) {
                if (patient === "male")
                    return diastolicPts[4][1];
                else
                    return diastolicPts[4][2];
            } else {
                for (var i = 1; i <= diastolicPts.length - 2; i++) {
                    var match = false;

                    var min = parseInt(diastolicPts[i][0].substring(2, 0)); //extracts min and max range
                    var max = parseInt(diastolicPts[i][0].slice(3, 6));

                    for (var x = min; x <= max; x++) {
                        if (dInput == x) {
                            match = true;
                            break;
                        }
                    }

                    if (match) {
                        if (patient === "male")
                            return diastolicPts[i][1];
                        else
                            return diastolicPts[i][2];
                    }
                }
            }
        }


        function getSystolicPoints(sInput) {
            var systolicPts = [["<120", 0, -3], ["120-129", 0, 0], ["130-139", 1, 0], ["140-159", 2, 2], [">=160", 3, 3]];

            if (sInput < 120) {
                if (patient === "male")
                    return systolicPts[0][1];
                else
                    return systolicPts[0][2];
            }
            else if (sInput >= 160) {
                if (patient === "male")
                    return systolicPts[4][1];
                else
                    return systolicPts[4][2];
            } else {
                for (var i = 1; i <= systolicPts.length - 2; i++) {
                    var match = false;

                    var min = parseInt(systolicPts[i][0].substring(3, 0)); //extracts min and max range
                    var max = parseInt(systolicPts[i][0].slice(4, 7));

                    for (var x = min; x <= max; x++) {
                        //  console.log(x , min, sInput);
                        //Diastolic works PERFECTLY fine with === But Systolic SAME Basic ALGORITHM but needs == instead. Weird.
                        if (sInput == x) {
                            match = true;
                            break;
                        }
                    }

                    if (match) {
                        if (patient === "male")
                            return systolicPts[i][1];
                        else
                            return systolicPts[i][2];
                    }
                }
            }
        }

        function getBPPoints(dInput, sInput) {
            var Diastolic = getDiastolicPoints(dInput); //stores Diastolic Points
            var Systolic = getSystolicPoints(sInput); //stores Systolic Points
            // console.log("Dia, Sys", Diastolic, Systolic);

            if (Diastolic == Systolic) {
                return Diastolic; //Can be Diastolic or Systolic. They both same anyways.
            } else if (Diastolic > Systolic) {
                return Diastolic; //according to the spec, "if diastolic and systolic are different, use the higher number".
            } else {
                return Systolic; //This is "if(Systolic > Diastolic)" scenario
            }
        }


        /** END **/


        /**place if statement here to determine what dashboard is using the function, you can use the values that are pre-populated**/

        if ($scope.patientList == null) {
            //don't send the request
        }
        else {
            $http.put('/patientLists/' + $scope.specPatientInfo._id, $scope.specPatientInfo).success(function (request, response) {
                console.log(response);
            });
        }


    };


    //creating function for loading current graph data
    $scope.loadGraph = function () {

        //array to store values to plot on graph
        var yearLabels = [];
        var CVDRisks = [];

        //assign length of array that store CVD risk values to variable
        var CVDRiskValueArrayLength = $scope.specPatientInfo.riskstoreddata.length;

        //for loop to loop through object in array and push results onto assigned arrays
        for (var i = 0; i < CVDRiskValueArrayLength; i++) {
            yearLabels.push($scope.specPatientInfo.riskstoreddata[i].currentMonth);
            CVDRisks.push($scope.specPatientInfo.riskstoreddata[i].calculatedPercentage);
        }


        var data = {
            labels: yearLabels, //months
            series: [CVDRisks] // CVD results
        };

        var options = {
            width: 700,
            height: 500,
            high: 100,
            low: 0,
            axisY: {
                onlyInteger: true,
                labelInterpolationFnc: function (value) {
                    return value + '%';
                }
            }
        };

        new Chartist.Line('.ct-chart', data, options);

    };
    //window.onload = $scope.loadSpecPat;


    //making recommendations, capturing recommendation and time recommendation is made??
    $scope.Recommendation = function () {
        //clear input box after recommendation
        var recommendation = $scope.recommendation;
        $scope.specPatientInfo.recommendation = recommendation;
        console.log("sending recommendation to server " + $scope.specPatientInfo.recommendation);
        $http.put('/recommendation/' + $scope.specPatientInfo._id, $scope.specPatientInfo).success(function (request, response) {
            console.log(response);
        });

    };
});


//window.onload = $scope.loadSpecPat;
function refresh() {
    window.location.reload();
}

$('#riskCalculatorModal').on('hidden.bs.modal', function () {
    window.location.reload();
});