#Router

A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.

A router behaves like middleware itself, so you can use it as an argument toapp.use()or as the argument to another router’s use() method.

The top-levelexpressobject has aRouter()method that creates a newrouterobject.

Once you’ve created a router object, you can add middleware and HTTP method routes (such asget,put,post, and so on) to it just like an application. For example:


// invoked for any requests passed to this router

router.use(function(req, res, next) {

  // .. some logic here .. like any other middleware

  next();

});

// will handle any request that ends in /events

// depends on where the router is "use()'d"

router.get('/events', function(req, res, next) {

  // ..

});

You can then use a router for a particular root URL in this way separating your routes into files or even mini-apps.

// only requests to /calendar/* will be sent to our "router"

app.use('/calendar', router);

##Methods

###router.all(path, [callback, ...] callback)

This method is just like therouter.METHOD()methods, except that it matches all HTTP methods (verbs).

This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches. For example, if you placed the following route at the top of all other route definitions, it would require that all routes from that point on would require authentication, and automatically load a user. Keep in mind that these callbacks do not have to act as end points;loadUsercan perform a task, then callnext()to continue matching subsequent routes.

router.all('*', requireAuthentication, loadUser);

Or the equivalent:

router.all('*', requireAuthentication)

router.all('*', loadUser);

Another example of this is white-listed “global” functionality. Here the example is much like before, but it only restricts paths prefixed with “/api”:

router.all('/api/*', requireAuthentication);

###router.METHOD(path, [callback, ...] callback)

The router.METHOD() methods provide the routing functionality in Express, where METHOD is one of the HTTP methods, such as GET, PUT, POST, and so on, in lowercase. Thus, the actual methods arerouter.get(),router.post(),router.put(), and so on.

Therouter.get()function is automatically called for the HTTPHEADmethod in addition to theGETmethod ifrouter.head()was not called for the path beforerouter.get().

You can provide multiple callbacks, and all are treated equally, and behave just like middleware, except that these callbacks may invokenext('route')to bypass the remaining route callback(s). You can use this mechanism to perform pre-conditions on a route then pass control to subsequent routes when there is no reason to proceed with the route matched.

The following snippet illustrates the most simple route definition possible. Express translates the path strings to regular expressions, used internally to match incoming requests. Query strings are_not_considered when performing these matches, for example “GET /” would match the following route, as would “GET /?name=tobi”.

router.get('/', function(req, res){

  res.send('hello world');

});

You can also use regular expressions—useful if you have very specific constraints, for example the following would match “GET /commits/71dbb9c” as well as “GET /commits/71dbb9c..4c084f9”.

router.get(/^\/commits\/(\w+)(?:\.\.(\w+))?$/, function(req, res){

  var from = req.params[0];

  var to = req.params[1] || 'HEAD';

  res.send('commit range ' + from + '..' + to);

});

###router.param(name, callback)

Adds callback triggers to route parameters, wherenameis the name of the parameter andcallbackis the callback function. Althoughnameis technically optional, using this method without it is deprecated starting with Express v4.11.0 (see below).

The parameters of the callback function are:

* req, the request object.
* res, the response object.
* next, indicating the next middleware function.
* The value of the nameparameter.
* The name of the parameter.

For example, when:useris present in a route path, you may map user loading logic to automatically providereq.userto the route, or perform validations on the parameter input.

router.param('user', function(req, res, next, id) {

  // try to get the user details from the User model and attach it to the request object

  User.find(id, function(err, user) {

    if (err) {

      next(err);

    } else if (user) {

      req.user = user;

      next();

    } else {

      next(new Error('failed to load user'));

    }

  });

});

Param callback functions are local to the router on which they are defined. They are not inherited by mounted apps or routers. Hence, param callbacks defined onrouterwill be triggered only by route parameters defined onrouterroutes.

A param callback will be called only once in a request-response cycle, even if the parameter is matched in multiple routes, as shown in the following examples.

router.param('id', function (req, res, next, id) {

  console.log('CALLED ONLY ONCE');

  next();

});

router.get('/user/:id', function (req, res, next) {

  console.log('although this matches');

  next();

});

router.get('/user/:id', function (req, res) {

  console.log('and this matches too');

  res.end();

});

OnGET /user/42, the following is printed:

CALLED ONLY ONCE
although this matches
and this matches too
The following section describesrouter.param(callback), which is deprecated as of v4.11.0.

The behavior of therouter.param(name, callback)method can be altered entirely by passing only a function torouter.param(). This function is a custom implementation of howrouter.param(name, callback)should behave - it accepts two parameters and must return a middleware.

The first parameter of this function is the name of the URL parameter that should be captured, the second parameter can be any JavaScript object which might be used for returning the middleware implementation.

The middleware returned by the function decides the behavior of what happens when a URL parameter is captured.

In this example, therouter.param(name, callback)signature is modified torouter.param(name, accessId). Instead of accepting a name and a callback,router.param()will now accept a name and a number.

var express = require('express');

var app = express();

var router = express.Router();

// customizing the behavior of router.param()

router.param(function(param, option) {

  return function (req, res, next, val) {

    if (val == option) {

      next();

    }

    else {

      res.sendStatus(403);

    }

  }

});

// using the customized router.param()

router.param('id', 1337);

// route to trigger the capture

router.get('/user/:id', function (req, res) {

  res.send('OK');

});

app.use(router);

app.listen(3000, function () {

  console.log('Ready');

});

In this example, therouter.param(name, callback)signature remains the same, but instead of a middleware callback, a custom data type checking function has been defined to validate the data type of the user id.

router.param(function(param, validator) {

  return function (req, res, next, val) {

    if (validator(val)) {

      next();

    }

    else {

      res.sendStatus(403);

    }

  }

});

router.param('id', function (candidate) {

  return !isNaN(parseFloat(candidate)) && isFinite(candidate);

});

###router.route(path)

Returns an instance of a single route which you can then use to handle HTTP verbs with optional middleware. Userouter.route()to avoid duplicate route naming and thus typing errors.

Building on therouter.param()example above, the following code shows how to userouter.route()to specify various HTTP method handlers.

var router = express.Router();

router.param('user_id', function(req, res, next, id) {

  // sample user, would actually fetch from DB, etc...

  req.user = {

    id: id,

    name: 'TJ'

  };

  next();

});

router.route('/users/:user_id')

.all(function(req, res, next) {

  // runs for all HTTP verbs first

  // think of it as route specific middleware!

  next();

})

.get(function(req, res, next) {

  res.json(req.user);

})

.put(function(req, res, next) {

  // just an example of maybe updating the user

  req.user.name = req.params.name;

  // save user ... etc

  res.json(req.user);

})

.post(function(req, res, next) {

  next(new Error('not implemented'));

})

.delete(function(req, res, next) {

  next(new Error('not implemented'));

})

This approach re-uses the single/users/:user_idpath and adds handlers for various HTTP methods.

NOTE: When you userouter.route(), middleware ordering is based on when the_route_is created, not when method handlers are added to the route. For this purpose, you can consider method handlers to belong to the route to which they were added.


###router.use([path], [function, ...] function)

Uses the specified middleware function or functions, with optional mount pathpath, that defaults to “/”.

This method is similar toapp.use(). A simple example and use case is described below. Seeapp.use()for more information.

Middleware is like a plumbing pipe: requests start at the first middleware function defined and work their way “down” the middleware stack processing for each path they match.

var express = require('express');

var app = express();

var router = express.Router();

// simple logger for this router's requests

// all requests to this router will first hit this middleware

router.use(function(req, res, next) {

  console.log('%s %s %s', req.method, req.url, req.path);

  next();

});

// this will only be invoked if the path starts with /bar from the mount point

router.use('/bar', function(req, res, next) {

  // ... maybe some additional /bar logging ...

  next();

});


// always invoked

router.use(function(req, res, next) {

  res.send('Hello World');

});

app.use('/foo', router);

app.listen(3000);

The “mount” path is stripped and is_not_visible to the middleware function. The main effect of this feature is that a mounted middleware function may operate without code changes regardless of its “prefix” pathname.

The order in which you define middleware withrouter.use()is very important. They are invoked sequentially, thus the order defines middleware precedence. For example, usually a logger is the very first middleware you would use, so that every request gets logged.

var logger = require('morgan');

router.use(logger());

router.use(express.static(__dirname + '/public'));

router.use(function(req, res){

  res.send('Hello');

});

Now suppose you wanted to ignore logging requests for static files, but to continue logging routes and middleware defined afterlogger(). You would simply move the call toexpress.static()to the top, before adding the logger middleware:

router.use(express.static(__dirname + '/public'));

router.use(logger());

router.use(function(req, res){

  res.send('Hello');

});

Another example is serving files from multiple directories, giving precedence to “./public” over the others:

app.use(express.static(__dirname + '/public'));

app.use(express.static(__dirname + '/files'));

app.use(express.static(__dirname + '/uploads'));

Therouter.use()method also supports named parameters so that your mount points for other routers can benefit from preloading using named parameters.

NOTE: Although these middleware functions are added via a particular router,_when_they run is defined by the path they are attached to (not the router). Therefore, middleware added via one router may run for other routers if its routes match. For example, this code shows two different routers mounted on the same path:


var authRouter = express.Router();

var openRouter = express.Router();

authRouter.use(require('./authenticate').basic(usersdb));

authRouter.get('/:user_id/edit', function(req, res, next) { 

  // ... Edit user UI ...  

});

openRouter.get('/', function(req, res, next) { 

  // ... List users ... 

})
openRouter.get('/:user_id', function(req, res, next) { 

  // ... View user ... 

})

app.use('/users', authRouter);

app.use('/users', openRouter);

Even though the authentication middleware was added via theauthRouterit will run on the routes defined by theopenRouteras well since both routers were mounted on/users. To avoid this behavior, use different paths for each router.