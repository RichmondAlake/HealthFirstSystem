var express = require('express');
var path = require('path');
var bodyParser =require('body-parser');
var mongojs = require('mongojs');
//var testController = require('./TestController');
//var patientDash = require('./routes/patientdashboard');

//var cliniciansDash = require('./routes/cliniciansdashboard');


var app = express();
var cliniciansDb = mongojs('healthfirst', ['clinicians']);
var patientsDb = mongojs('healthfirst', ['patients']);

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/TestController.js"));
app.use(bodyParser.json());
//app.use(testController);
//app.use('/patientdashboard', patientDash);
//app.use('/cliniciansdashboard', cliniciansDash);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



/** Clinician Login **/
app.post('/clinicianloginauth', function (request, response){
    console.log(request.body);

    //check database for existing record, if data is found return clinic dashboard as response
    cliniciansDb.clinicians.findOne({nhsnumber : request.body.nhsnumber, password : request.body.password}, function(err, doc) {
        console.log(request.body.nhsnumber);
        console.log(request.body.password);
        //console.log(doc.nhsnumber);
        //console.log(doc.password);
        // if doc.nhsnumber and doc.password is equals to the body then we send them the appropriate page

        try {
            if (doc.nhsnumber == request.body.nhsnumber && doc.password == request.body.password) {
                response.sendFile(path.join(__dirname + '/views/cliniciansdashboard.html'));

            }
            else if (doc.nhsnumber == null || doc.password == null) {
                response.send("Username and Password mismatch");
                console.log(err);
            }
        }
     catch (err) {
        console.log(err.stack);
         response.send("Invalid and password");
    }


    })

});


/**
app.post('/patientloginauth', function (request, response){
    console.log(request.body);

    patientsDb.patients.findOne({nhsnumber : request.body.nhsnumber, password : request.body.password}, function (err, doc){
        //console.log(request.body.nhsnumber);
        //console.log(request.body.password);
        //console.log(doc.nhsnumber);
        //console.log(doc.password);
        try {
            if (doc.nhsnumber == request.body.nhsnumber && doc.password == request.body.password) {
                response.sendFile(path.join(__dirname + '/views/patientdashboard.ejs'));
            }
            else if (doc.nhsnumber == null || doc.password == null) {
                response.send("Username and Password mismatch");
                console.log(err);
            }
        }
        catch (err) {
            console.log(err.stack);
            response.send("Invalid and password");
        }
    });



});

 **/



/** Getting all patient in database**/
app.get('/patientList', function(request, response){
   // console.log("Reciving request to send all patients information in database");
    patientsDb.patients.find(function (err, docs){
        //console.log(docs);
        response.send(docs);
    });

});

/** Get all patients based on clinicians **/
app.get('/patientList/:clinician', function(request, response){
    console.log("Recieving request for patients to a clinicians");
    var clinician = request.params.clinician;
    console.log(clinician);
    patientsDb.patients.find({},{gp:clinician},{limit: 500},function (err, docs){
        console.log(docs);
        response.send(docs);
    });

});

app.listen(3000);
console.log("server currently running");