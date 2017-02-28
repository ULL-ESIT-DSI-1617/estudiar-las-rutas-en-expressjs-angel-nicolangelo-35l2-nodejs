var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hola mundo1!')
})

app.listen(3000, function () {
  console.log('Ejemplo de app escuchando por el puerto 3000!')
})