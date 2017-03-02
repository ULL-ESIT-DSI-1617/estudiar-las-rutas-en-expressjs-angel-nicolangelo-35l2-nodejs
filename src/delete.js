var express = require('express');
var app = express();
var port = 5000;

app.delete('/', function (req, res) {
  res.send('Got a DELETE request at /user');
});

app.listen(process.env.PORT, process.env.IP,function () {
  console.log('Ejemplo de app escuchando por el puerto', port);
});