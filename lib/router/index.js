'use strict';

var Debugger = require('../debugger'),
    helpers = require('../helpers'),
    Route = require('./route');

/**
 *  Application router, this little bad boy will handle all of the requets
 *  made to the app.
 */
class Router {

  /**
   *  Defines the default properties.
   *  @param {Object} options
   *  @return {Router}
   *  @api private
   *  @constructor
   */
  constructor(options) {
    if (helpers.objType.call(options) !== '[object Object]') {
      throw new Error('Router(options) - Options must be an object');
    }
    helpers.merge(this, options);
    this.handlers = [];
  }

  /**
   *  Adds middleware to execute before any routing request is
   *  dealt with.
   *  @param  {String|Function} route
   *  @param  {Function} fn
   *  @param  {String} method
   *  @return {Router}
   *  @api public
   */
  use(route, fn) {
    let r;

    // Default route to / if no route was given.
    if ('string' != typeof route) {
      fn = route;
      route = '*';
    }

    // Remove the trailing slash.
    if ('/' == route[route.length - 1]) {
      route = route.slice(0, 1);
    }

    // Add our handler.
    r = new Route(route, fn);
    this.handlers.push(r);

    return this;
  }

  /**
   *  Creates a route handler.
   *  @param  {String|Function} route
   *  @param  {Function} fn
   *  @param  {String} method
   *  @return {Router}
   *  @api public
   */
  create(route, fn, method) {
    let r;

    // Default route to / if no route was given.
    if ('string' != typeof route) {
      throw new Error('Router.create() - Route must be a string');
    }

    // Remove the trailing slash.
    if ('/' == route[route.length - 1]) {
      route = route.slice(0, 1);
    }

    // Add our handler.
    r = new Route(route, fn, method);
    this.handlers.push(r);

    return this;
  } 

  /**
   *  Handles the routing request.
   *  @param {Object}   req
   *  @param {Object}   res
   *  @param {Function} done
   *  @api public
   */
  handle(req, res, done) {
    let index, self, handlers, end;

    this.debug.info(`Routing: ${req.url}`);

    self = this;
    index = 0;
    handlers = self.handlers;

    // Store the original url.
    req.originalURL = (req.originalURL || req.url);

    /**
     *  Starts the middleware stack.
     *  @param {Object} err
     */
    function next (err) {
      let path, handler;

      // If the headers heve allready been sent we need to stop running
      // the rest of the middleware.
      if (res.headersSent) { return; }

      // Set the request path
      path = (req.url || '/');

      // Grab the first handler and increment the index counter.
      handler = handlers[index++];

      // Call done if we do not have any handlers to call this will
      // send back the default 404 response.
      if (!handler) {
        return helpers.defer(done, req, res);
      }

      // check if the middleware should run
      if (!self._shouldRun(path, handler.route)) {
        return next(err);
      }

      // Call the route handler.
      self._run(handler, err, req, res, next);
    }

    // Run the middlware stack.
    next();
  }

  /**
   *  Checks to see if a middleware function should be executed or
   *  if we should just run next instead.
   *  @param  {String} path
   *  @param  {String} route
   *  @return {Boolean}
   *  @api private
   */
  _shouldRun(path, route) {
    let c1, c2, c3;

    c1 = route === '*';
    c2 = (path.toLowerCase() === route.toLowerCase());
    c3 = (path.startsWith(route) && route.length > 1);

    return (c1 || (c2 || c3));
  }

  /**
   *  Calls a middleware function.
   *  @param {Object}   route
   *  @param {Object}   err
   *  @param {Object}   req
   *  @param {Object}   res
   *  @param {Function} next
   *  @api private
   */
  _run(route, err, req, res, next) {
    // We are going to try to call our middleware function passing 
    // in next, if that fails we will set the error and call next.
    try {
      return route.handle(err, req, res, next);
    } catch (e) {
      err = e;
    }

    // Continue.
    next(err);
  }

}


/**
 *  Export the Router class.
 */
module.exports = Router;