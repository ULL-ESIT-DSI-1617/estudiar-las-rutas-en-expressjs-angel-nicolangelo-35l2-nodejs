var express = require('express')
var app = express()
var port = 5000

app.get('/', function (req, res) {
  res.send('Hola mundo!!')
})

app.listen(port, function () {
  console.log('Ejemplo de app escuchando por el puerto', port)
})

