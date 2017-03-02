#Utilización del middleware

Express es una infraestructura web de direccionamiento y middleware que tiene una funcionalidad mínima propia: una aplicación Express es fundamentalmente una serie de llamadas a funciones de middleware.

Las funciones de_middleware_son funciones que tienen acceso al objeto de solicitud (req), al objeto de respuesta( res) y a la siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación. La siguiente función de middleware se denota normalmente con una variable denominadanext.

Las funciones de middleware pueden realizar las siguientes tareas:

* Ejecutar cualquier código.
* Realizar cambios en la solicitud y los objetos de respuesta.
* Finalizar el ciclo de solicitud/respuestas.
* Invocar la siguiente función de middleware en la pila.

Si la función de middleware actual no finaliza el ciclo de solicitud/respuestas, debe invocarnext()para pasar el control a la siguiente función de middleware. De lo contrario, la solicitud quedará colgada.

Una aplicación Express puede utilizar los siguientes tipos de middleware:

* Middleware de nivel de aplicación
* Middleware de nivel de direccionador
* Middleware de manejo de errores
* Middleware incorporado
* Middleware de terceros

Puede cargar middleware de nivel de aplicación y de nivel de direccionador con una vía de acceso de montaje opcional. También puede cargar una serie de funciones de middleware a la vez, lo que crea una subpila del sistema de middleware en un punto de montaje.

##Middleware de nivel de aplicación

Enlace el middleware de nivel de aplicación a una instancia del objeto de aplicación utilizando las funciones app.use() y app.METHOD(), donde METHOD es el método HTTP de la solicitud que maneja la función de middleware (por ejemplo, GET, PUT o POST) en minúsculas.

Este ejemplo muestra una función de middleware sin ninguna vía de acceso de montaje. La función se ejecuta cada vez que la aplicación recibe una solicitud.

var app = express();

app.use(function(req, res, next){

  console.log('Time:', Date.now());

  next();

  });

Este ejemplo muestra una función de middleware montada en la vía de acceso/user/:id. La función se ejecuta para cualquier tipo de solicitud HTTP en la vía de acceso/user/:id.

app.use('/user/:id', function (req, res, next) {

  console.log('Request Type:', req.method);

  next();

});

Este ejemplo muestra una ruta y su función de manejador (sistema de middleware). La función maneja las solicitudes GET a la vía de acceso/user/:id.

app.get('/user/:id', function (req, res, next) {

  res.send('USER');

});

A continuación, se muestra un ejemplo de carga de una serie de funciones de middleware en un punto de montaje, con una vía de acceso de montaje. Ilustra una subpila de middleware que imprime información de solicitud para cualquier tipo de solicitud HTTP en la vía de acceso/user/:id.

app.use('/user/:id', function(req, res, next) {

  console.log('Request URL:', req.originalUrl);

  next();

}, function (req, res, next) {

  console.log('Request Type:', req.method);

  next();

});

Los manejadores de rutas permiten definir varias rutas para una vía de acceso. El ejemplo siguiente define dos rutas para las solicitudes GET a la vía de acceso/user/:id. La segunda ruta no dará ningún problema, pero nunca se invocará, ya que la primera ruta finaliza el ciclo de solicitud/respuestas.

Este ejemplo muestra una subpila de middleware que maneja solicitudes GET a la vía de acceso/user/:id.

app.get('/user/:id', function (req, res, next) {

  console.log('ID:', req.params.id);


  next();

}, function (req, res, next) {

  res.send('User Info');

});

// handler for the /user/:id path, which prints the user ID

app.get('/user/:id', function (req, res, next) {

  res.end(req.params.id);

});

Para omitir el resto de las funciones de middleware de una pila de middleware de direccionador, invoquenext('route')para pasar el control a la siguiente ruta.

NOTA:next('route')sólo funcionará en las funciones de middleware que se hayan cargado utilizando las funcionesapp.METHOD()orouter.METHOD().

Este ejemplo muestra una subpila de middleware que maneja solicitudes GET a la vía de acceso/user/:id.

app.get('/user/:id', function (req, res, next) {

  // if the user ID is 0, skip to the next route

  if (req.params.id == 0) next('route');


  // otherwise pass the control to the next middleware function in this stack


  else next(); //

 }, function (req, res, next) {

  // render a regular page

  res.render('regular');

});

// handler for the /user/:id path, which renders a special page

app.get('/user/:id', function (req, res, next) {

  res.render('special');

});

##Middleware de nivel de direccionador

El middleware de nivel de direccionador funciona de la misma manera que el middleware de nivel de aplicación, excepto que está enlazado a una instancia deexpress.Router().

var router = express.Router();

Cargue el middleware de nivel de direccionador utilizando las funcionesrouter.use()yrouter.METHOD().

El siguiente código de ejemplo replica el sistema de middleware que se ha mostrado anteriormente para el middleware de nivel de aplicación, utilizando el middleware de nivel de direccionador:

var app = express();

var router = express.Router();

// a middleware function with no mount path. This code is executed for every request to the router

router.use(function (req, res, next) {

  console.log('Time:', Date.now());

  next();

});

// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path

router.use('/user/:id', function(req, res, next) {

  console.log('Request URL:', req.originalUrl);

  next();

}, function (req, res, next) {

  console.log('Request Type:', req.method);

  next();

});

// a middleware sub-stack that handles GET requests to the /user/:id path

router.get('/user/:id', function (req, res, next) {

  // if the user ID is 0, skip to the next router

  if (req.params.id == 0) next('route');

  // otherwise pass control to the next middleware function in this stack

  else next(); //

}, function (req, res, next) {

  // render a regular page


  res.render('regular');

});

// handler for the /user/:id path, which renders a special page
router.get('/user/:id', function (req, res, next) {
  console.log(req.params.id);
  res.render('special');
});

// mount the router on the app

app.use('/', router);

##Middleware de manejo de errores

El middleware de manejo de errores siempre utiliza _cuatro _argumentos. Debe proporcionar cuatro argumentos para identificarlo como una función de middleware de manejo de errores. Aunque no necesite utilizar el objetonext, debe especificarlo para mantener la firma. De lo contrario, el objetonextse interpretará como middleware normal y no podrá manejar errores.

Defina las funciones de middleware de manejo de errores de la misma forma que otras funciones de middleware, excepto con cuatro argumentos en lugar de tres, específicamente con la firma(err, req, res, next):

app.use(function(err, req, res, next) {
 
  console.error(err.stack);
 
  res.status(500).send('Something broke!');

});

##Middleware incorporado

Desde la versión 4.x, Express ya no depende de Connect. Exceptoexpress.static, todas las funciones de middleware que se incluían previamente con Express están ahora en módulos diferentes.

###express.static(root, [options])

La única función de middleware incorporado en Express esexpress.static. Esta función se basa en serve-static y es responsable del servicio de activos estáticos de una aplicación Express.

El argumentorootespecifica el directorio raíz desde el que se realiza el servicio de activos estáticos.

El objetooptionsopcional puede tener las siguientes propiedades:

Propiedad |	Descripción	| Tipo |	Valor predeterminado
-- | -- | -- | -- 
dotfiles	| Opción para el servicio de dotfiles. Los valores posibles son “allow”, “deny” e “ignore”	| Serie	| “ignore”
etag	| Habilitar o inhabilitar la generación de etag |	Booleano |	true
extensions |	Establece las reservas de extensiones de archivos.|	Matriz |	[]
index	| Envía el archivo de índices de directorios. Establézcalo enfalsepara inhabilitar la indexación de directorios.	|Mixto	|“index.html”
lastModified|	Establezca la cabeceraLast-Modifieden la última fecha de modificación del archivo en el sistema operativo. Los valores posibles sontrueofalse.	|Booleano	|true
maxAge	|Establezca la propiedad max-age de la cabecera Cache-Control en milisegundos o una serie enformato ms |	Número|	0
redirect	|Redireccionar a la “/” final cuando el nombre de vía de acceso es un directorio.	|Booleano	|true
setHeaders	|Función para establecer las cabeceras HTTP que se sirven con el archivo.	|Función	|

A continuación, se muestra un ejemplo de uso de la función de middlewareexpress.staticcon un objeto de opciones elaboradas:

var options = {
 
  dotfiles: 'ignore',
 
  etag: false,
 
  extensions: ['htm', 'html'],
 
  index: false,
 
  maxAge: '1d',
 
  redirect: false,
 
  setHeaders: function (res, path, stat) {
 
    res.set('x-timestamp', Date.now());
 
  }

}


app.use(express.static('public', options));

Puede tener más de un directorio estático para cada aplicación:

app.use(express.static('public'));

app.use(express.static('uploads'));

app.use(express.static('files'));

###Middleware de terceros

Utilice el middleware de terceros para añadir funcionalidad a las aplicaciones Express.

Instale el módulo Node.js para la funcionalidad necesaria y cárguelo en la aplicación a nivel de aplicación o a nivel de direccionador.

El siguiente ejemplo ilustra la instalación y carga de la función de middleware de análisis de cookiescookie-parser.

$ npm install cookie-parser

exit: Ctrl + ↩

var express = require('express');

var app = express();

var cookieParser = require('cookie-parser');

// load the cookie-parsing middleware

app.use(cookieParser());