#Direccionamiento
El _Direccionamiento _hace referencia a la definición de puntos finales de aplicación (URI) y cómo responden a las solicitudes de cliente.

A continuación, mostramos un código de ejemplo de una ruta muy básica:

**var express = require('express');**

**var app = express();**

**// respond with "hello world" when a GET request is made to the homepage**

**app.get('/', function(req, res) {**

  **res.send('hello world');**

**});**

##Métodos de ruta
Un método de ruta se deriva de uno de los métodos HTTP y se adjunta a una instancia de la clase express.

El siguiente código ejemplo muestra las rutas que se definen para los métodos GET y POST a la raíz de la aplicación.

**// GET method route**

**app.get('/', function (req, res) {**

  **res.send('GET request to the homepage');**

**});**

**// POST method route**

**app.post('/', function (req, res) {**

  **res.send('POST request to the homepage');**

**});**

Express da soporte a los siguientes métodos de direccionamiento que se corresponden con los métodos HTTP:_get, post, put, head, delete, options, trace, copy, lock, mkcol, move, purge, propfind, proppatch, unlock, report, mkactivity, checkout, merge, m-search, notify, subscribe, unsubscribe, patch, searchy connect._

Para direccionar los métodos que se convierten en nombres de variable JavaScript no válidos, utilice la notación entre corchetes. Por ejemplo, app['m-search'].

Hay un método de direccionamiento especial,app.all(), que no se deriva de ningún método HTTP. Este método se utiliza para cargar funciones de middleware en una vía de acceso para todos los métodos de solicitud.

En el siguiente ejemplo, el manejador se ejecutará para las solicitudes a “/secret”, tanto si utiliza GET, POST, PUT, DELETE, como cualquier otro método de solicitud HTTP

**app.all('/secret', function (req, res, next) {**

  **console.log('Accessing the secret section ...');**

  **next(); // pass control to the next handler**

**});**

##Vías de acceso de ruta
Las vías de acceso de ruta, en combinación con un método de solicitud, definen los puntos finales en los que pueden realizarse las solicitudes. Las vías de acceso de ruta pueden ser series, patrones de serie o expresiones regulares.

Estos son algunos ejemplos de vías de acceso de ruta basadas en series.

Esta vía de acceso de ruta coincidirá con las solicitudes a la ruta raíz,/.

**app.get('/', function (req, res) {**

  **res.send('root');**

**});**

Esta vía de acceso de ruta coincidirá con las solicitudes a /about.

**app.get('/about', function (req, res) {**

  **res.send('about');**

**});**
Esta vía de acceso de ruta coincidirá con las solicitudes a /random.text.

**app.get('/random.text', function (req, res) {**

  **res.send('random.text');**

**});**
Estos son algunos ejemplos de vías de acceso de ruta basadas en patrones de serie.

Esta vía de acceso de ruta coincidirá conacdyabcd.

**app.get('/ab?cd', function(req, res) {**

  **res.send('ab?cd');**

**});**

Esta vía de acceso de ruta coincidirá con abcd, abbcd, abbbcd, etc.

**app.get('/ab+cd', function(req, res) {**

  **res.send('ab+cd');**

**});**

Esta vía de acceso de ruta coincidirá con _abcd, abxcd, abRABDOMcd, ab123cd, etc._

**app.get('/ab*cd', function(req, res) {**

  **res.send('ab*cd');**

**});**

Esta vía de acceso de ruta coincidirá con /abey /abcde.

**app.get('/ab(cd)?e', function(req, res) {**

 **res.send('ab(cd)?e');**

**});**

Ejemplos de vías de acceso de ruta basadas en expresiones regulares:

Esta vía de acceso de ruta coincidirá con cualquier valor con una “a” en el nombre de la ruta.

app.get(/a/, function(req, res) {

  res.send('/a/');

});

Esta vía de acceso de ruta coincidirá con butterflyy dragonfly, pero no con butterflyman, dragonfly man, etc.

app.get(/.*fly$/, function(req, res) {

  res.send('/.*fly$/');

});

##Manejadores de rutas

Puede proporcionar varias funciones de devolución de llamada que se comportan como middleware para manejar una solicitud. La única excepción es que estas devoluciones de llamada pueden invocarnext('route')para omitir el resto de las devoluciones de llamada de ruta. Puede utilizar este mecanismo para imponer condiciones previas en una ruta y, a continuación, pasar el control a las rutas posteriores si no hay motivo para continuar con la ruta actual.

Los manejadores de rutas pueden tener la forma de una función, una matriz de funciones o combinaciones de ambas, como se muestra en los siguientes ejemplos.

Una función de devolución de llamada individual puede manejar una ruta. Por ejemplo:

app.get('/example/a', function (req, res) {

  res.send('Hello from A!');

});

Más de una función de devolución de llamada puede manejar una ruta (asegúrese de especificar el objeto next). Por ejemplo:

app.get('/example/b', function (req, res, next) {

  console.log('the response will be sent by the next function ...');
 
  next();

}, function (req, res) {

  res.send('Hello from B!');

});

Una matriz de funciones de devolución de llamada puede manejar una ruta. Por ejemplo:

var cb0 = function (req, res, next) {

  console.log('CB0');

  next();

}

var cb1 = function (req, res, next) {

  console.log('CB1');

  next();

}

var cb2 = function (req, res) {

  res.send('Hello from C!');

}

app.get('/example/c', [cb0, cb1, cb2]);

Una combinación de funciones independientes y matrices de funciones puede manejar una ruta. Por ejemplo:

var cb0 = function (req, res, next) {

  console.log('CB0');

  next();

}

var cb1 = function (req, res, next) {

  console.log('CB1');

  next();

}

app.get('/example/d', [cb0, cb1], function (req, res, next) {

  console.log('the response will be sent by the next function ...');
  
  next();

}, function (req, res) {

  res.send('Hello from D!');

});

##Métodos de respuesta
Los métodos en el objeto de respuesta (res) de la tabla siguiente pueden enviar una respuesta al cliente y terminar el ciclo de solicitud/respuestas. Si ninguno de estos métodos se invoca desde un manejador de rutas, la solicitud de cliente se dejará colgada.

Método	| Descripción 
-- | --
res.download() |	Solicita un archivo para descargarlo.
res.end() |	Finaliza el proceso de respuesta.
res.json() |	Envía una respuesta JSON.
res.jsonp() |	Envía una respuesta JSON con soporte JSONP.
res.redirect() |	Redirecciona una solicitud.
res.render() |	Representa una plantilla de vista.
res.send() |	Envía una respuesta de varios tipos.
res.sendFile  |	Envía un archivo como una secuencia de octetos.
res.sendStatus() |	Establece el código de estado de la respuesta y envía su representación de serie como el cuerpo de respuesta.

##app.route()

Puede crear manejadores de rutas encadenables para una vía de acceso de ruta utilizandoapp.route(). Como la vía de acceso se especifica en una única ubicación, la creación de rutas modulares es muy útil, al igual que la reducción de redundancia y errores tipográficos.

A continuación, se muestra un ejemplo de manejadores de rutas encadenados que se definen utilizandoapp.route().

app.route('/book')

  .get(function(req, res) {

    res.send('Get a random book');

  })

  .post(function(req, res) {

    res.send('Add a book');

  })

  .put(function(req, res) {

    res.send('Update the book');

  });

Utilice la claseexpress.Routerpara crear manejadores de rutas montables y modulares. Una instanciaRouteres un sistema de middleware y direccionamiento completo; por este motivo, a menudo se conoce como una “miniaplicación”.

El siguiente ejemplo crea un direccionador como un módulo, carga una función de middleware en él, define algunas rutas y monta el módulo de direccionador en una vía de acceso en la aplicación principal.

Cree un archivo de direccionador denominadobirds.jsen el directorio de la aplicación, con el siguiente contenido:

var express = require('express');

var router = express.Router();


// middleware that is specific to this router

router.use(function timeLog(req, res, next) {

  console.log('Time: ', Date.now());

  next();

});

// define the home page route

router.get('/', function(req, res) {

  res.send('Birds home page');

});

// define the about route

router.get('/about', function(req, res) {

  res.send('About birds');

});

module.exports = router;

A continuación, cargue el módulo de direccionador en la aplicación:

var birds = require('./birds');

...
app.use('/birds', birds);

La aplicación ahora podrá manejar solicitudes a /birdsy /birds/about, así como invocar la función de middleware timeLog que es específica de la ruta.