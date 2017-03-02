var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');

app.listen(process.env.PORT, process.env.IP);

app.use(cookieParser());

app.get('/', function (req, res) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies);

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies);
});