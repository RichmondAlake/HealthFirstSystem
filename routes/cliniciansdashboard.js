var express = require('express');
var router = express.Router();

/* Clinician Dashboard Page. */
router.get('/', function(req, res, next) {
    res.render('cliniciansdashboard', { title: 'Clinicians Dashboard' });
});

module.exports = router;

//could we move the whole function to the sever where the call is been made?
//how to directly stop a user from accessing my hidden html page in node js unless approporate login credentials are entered