var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();
var cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET", "PUT", "POST", "DELETE", "OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


app.get('/',function(req,res){
  res.sendfile("index.html");
});

app.post('/',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  console.log("User name = "+user_name+", password is "+password);
  res.end("yes");
  
    
});

app.delete('/', function (req, res) {
  res.send('Got a DELETE request at /user');
});

app.listen(process.env.PORT, process.env.IP,function () {
// app.listen(3000,function(){
  console.log("Started on PORT 3000");
})