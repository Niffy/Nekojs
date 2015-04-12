'use strict';

var http = require('http'),
    Router = require('nekojs-router'),
    Debugger = require('nekojs-debug'),
    middleware = require('../middleware'),
    Request = require('./request'),
    Response = require('./response');

/**
 *  A simple full stack framework for iojs.
 */
class Framework {

  /**
   *  Defines the default properties for our application
   *  framework.
   *  @constructor
   *  @return {Framework}
   *  @api private
   */
  constructor() {

    // Add the settings object.
    this.settings = {};

    // Configure the applications debug module.
    this.debug = new Debugger({ 
      level: (process.env.NODE_DEBUG_LEVEL || 'info'),
      log: (process.env.NODE_DEBUG_MODE || false)
    });

    // We need to configure the defaults before we attempt
    // to load the router module.
    this._configureDefaults();

    // Configure the application routing module.
    this.router = new Router();

    // Set up the request and response objects
    this.request = { 
      __proto__: new Request(), 
      app: this 
    };
    
    this.response = { 
      __proto__: new Response(), 
      app: this 
    };

    // Expose the static middleware handler
    this.static  = middleware.static;
    this.favicon = middleware.favicon;

    // Set up our query string parser
    this.use(middleware.query);

    // Initialize the other stuff middleware may or may not 
    // need/want lol.
    this.use(middleware.init(this));
  }

  /**
   *  Configures the default settings.
   *  @api private
   */
  _configureDefaults() {
    let env;

    this.debug.info('Setting application defaults');

    env = (process.env.NODE_ENV || 'development');
    this.enable('x-powered-by');
    this.set('env', env);
    this.locals = Object.create(null);
    this.locals.settings = this.settings;
  }

  /**
   *  Sets an application environment variable.
   *  @param  {String} name
   *  @param  {*} value
   *  @return {Framework}
   *  @api public
   */
  set(name, value) {
    if (arguments.length === '1') {
      return this.settings[name];
    }
    this.settings[name] = value;
    return this;
  }

  /**
   *  Enables a setting.
   *  @param  {String} name
   *  @return {Framework}
   *  @api public
   */
  enable(name) {
    return this.set(name, true);
  }

  /**
   *  Disables a setting.
   *  @param  {String} name
   *  @return {Framework}
   *  @api public
   */
  disable(name) {
    return this.set(name, false);
  }

  /**
   *  Checks if a setting is enabled.
   *  @param  {String} name
   *  @return {Boolean}
   *  @api public
   */
  enabled(name) {
    return !!this.set(name);
  }

  /**
   *  Checks if a setting is disabled.
   *  @param  {String} name
   *  @return {Boolean}
   *  @api public
   */
  disabled(name) {
    return !this.set(name);
  }

  /**
   *  Allows us to add `middleware` to execute before the
   *  route handler runs for a certain route.
   *  @param  {String|Function} route
   *  @param  {Function} fn
   *  @return {Framework}
   *  @api public
   */
  use(route, fn) {
    this.router.use(route, fn);
    return this;
  }

  /**
   *  Allows us to add handlers to GET requests
   *  @param  {String|Function} route
   *  @param  {Function} fn
   *  @return {Framework}
   *  @api public
   */
  get(route, fn) {
    this.router.create(route, fn, 'get');
    return this;
  }

  /**
   *  Allows us to add handlers to POST requests
   *  @param  {String|Function} route
   *  @param  {Function} fn
   *  @return {Framework}
   *  @api public
   */
  post(route, fn) {
    this.router.create(route, fn, 'post');
    return this;
  }

  /**
   *  Allows us to add handlers to PUT requests
   *  @param  {String|Function} route
   *  @param  {Function} fn
   *  @return {Framework}
   *  @api public
   */
  put(route, fn) {
    this.router.create(route, fn, 'put');
    return this;
  }

  /**
   *  Allows us to add handlers to DELETE requests
   *  @param  {String|Function} route
   *  @param  {Function} fn
   *  @return {Framework}
   *  @api public
   */
  del(route, fn) {
    this.router.create(route, fn, 'delete');
    return this;
  }

  /**
   *  Handler for all incomming requests.
   *  @return {Function} reqHandler
   *  @api public
   */
  handle() {
    let self = this;

    /**
     *  404 Handler - If no route is matched then this
     *  method will run.
     *  @param {Object} req
     *  @param {Object} res
     */
    function done (req, res) {
      let message = `404 cannot ${req.method} ${req.url}`;
      self.debug.error(message);
      res.send(message);
    }

    /**
     *  Return the request handler method.
     *  @param {Object} req
     *  @param {Object} res
     */
    return function reqHandler (req, res) {
      self.router.handle(req, res, done);    
    };
  }


  /**
   *  Listens for incomming connections.
   *  @return {http.Server}
   *  @api public
   */
  listen() {
    let server = http.createServer(this.handle());
    return server.listen.apply(server, arguments);
  }

}

/**
 *  Export the Framework class.
 */
module.exports = Framework;