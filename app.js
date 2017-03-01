var express = require('express');
var app = express();
var port = 5000;

app.get('/', function (req, res) {
  res.send('Hola mundo5000!!');
})

app.listen(process.env.PORT, process.env.IP,function () {
  console.log('Ejemplo de app escuchando por el puerto', port);
});
// app.listen(port, function () {
//   console.log('Ejemplo de app escuchando por el puerto', port);
// })