var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
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
app.post('/clinicianloginauth', function (request, response) {
    console.log(request.body);

    //check database for existing record, if data is found return clinic dashboard as response
    cliniciansDb.clinicians.findOne({
        nhsnumber: request.body.nhsnumber,
        password: request.body.password
    }, function (err, doc) {
        console.log(request.body.nhsnumber);
        console.log(request.body.password);
        //console.log(doc.nhsnumber);
        //console.log(doc.password);
        // if doc.nhsnumber and doc.password is equals to the body then we send them the appropriate page

        try {
            if (doc.nhsnumber == request.body.nhsnumber && doc.password == request.body.password) {
                response.sendFile(path.join(__dirname + '/public/cliniciandashboardtest.html'));

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


/** Getting all patient in database (not used)**/
app.get('/patientList', function (request, response) {
    // console.log("Reciving request to send all patients information in database");
    patientsDb.patients.find(function (err, docs) {
        //console.log(docs);
        response.send(docs);
    });

});

/** Get all patients based on clinicians **/
app.get('/patientList/:clinician', function (request, response) {
    var clinician = request.params.clinician;
    console.log("Recieveing request for patients assigned to " + clinician);
    //modify later to get patients of the signed in clinicians...only takes in the full name
    patientsDb.patients.find({gp: clinician}, function (err, docs) {
        console.log(docs);
        response.send(docs);
    });

});

/** Getting info for a specific patient **/
app.get('/patientLists/:id', function (request, response) {
    var id = request.params.id;
    console.log("Getting information for " + id);
    patientsDb.patients.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
        if (err) {
            response.send("Cannot retrieve patient")
        } else {
            console.log(doc);
            response.send(doc);
        }
    });
});

/** placing recommendation in the database **/
app.put('/recommendation/:id', function (request, response){
    var id = request.params.id;
    console.log(id);
    var recommendation = request.body.recommendation;

    patientsDb.patients.findAndModify({query : {_id:mongojs.ObjectId(id)},
//need to test
        update:
        {
            $addToSet :
            {
                "recommendations" :
                {
                    recommendation : recommendation
                }
            }


        },
        new : true}, function (doc, err){
        response.send(doc);
    });
});

/**Updating records in database based on entry **/
app.put('/patientLists/:id', function (request, response){
    var id = request.params.id;
    var currentMonth = request.body.currentMonth;
    var currentFullTime = request.body.currentFullTime;
    console.log(currentMonth);
    console.log(currentFullTime);
    patientsDb.patients.findAndModify({query : {_id:mongojs.ObjectId(id)},
//need to test
    update:
    {
        $set:
    {
        age : request.body.age,
        cholesterol : request.body.cholesterol,
        diastolicbp : request.body.diastolicbp,
        systolicbp: request.body.systolicbp,
        gender : request.body.gender,
        medication : request.body.medication,
        smoker : request.body.smoker},
        $addToSet :
        {
            "riskstoreddata" :
            {
                calculatedrisk : "4",
                currentFullTime : currentFullTime,
                currentMonth : currentMonth
            }
        }


    },
        new : true}, function (doc, err){
        response.send(doc);
    });
});

app.listen(3000);
console.log("server currently running");