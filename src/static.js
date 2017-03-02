var express = require('express');
var path = require('path');
var app = express();
app.listen(process.env.PORT, process.env.IP);
app.set('port', 3000);
// app.use(express.static('public'));
app.use('/static', express.static('public'));

