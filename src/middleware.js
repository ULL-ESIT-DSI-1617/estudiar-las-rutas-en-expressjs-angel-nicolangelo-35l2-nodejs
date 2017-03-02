var express = require('express');
var moment = require('moment');
var bodyParser     =         require("body-parser");
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.use(function (req, res, next) {
  console.log('Fecha-router:', moment(Date.now()).format('DD/MM/YYYY'));
  next();
});


app.use('/', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
}, function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();},  function (req, res, next) {
  console.log('Fecha:', moment(Date.now()).format('DD/MM/YYYY'));
  next();
});

app.post('/',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  console.log("User name1 = "+user_name+", password is "+password);
  res.end("yes");
});

app.listen(process.env.PORT, process.env.IP,function () {
  console.log("server Started");
});

app.get('/',function(req,res){
  res.sendfile("index.html");
});

app.get('/:user_name', function (req, res, next) {
  // if the user ID is 0, skip to the next route
  if (req.params.user_name == "pepe"){ 
    console.log("pepe is here");
    next('route');
     
  }
  // otherwise pass the control to the next middleware function in this stack
  else next(); //
}, function (req, res, next) {
  // render a regular page
  res.render('regular');
});

// handler for the /user/:id path, which renders a special page
app.get('/:user_name', function (req, res, next) {
  res.render('special');
});
