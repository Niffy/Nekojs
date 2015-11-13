"use strict"

const Route = require('./route')
const utils = require('../utils')

const Debug = require('../debug')
const debug = new Debug({ 
  prefix: 'router' 
})

const ALLOWED = [
  '[object Function]', 
  '[object String]', 
  '[object RegExp]'
]

const FNTYPE = '[object Function]'

/**
 *  Routing class for Neko
 *  @class Router
 */
module.exports = class Router {

  /**
   *  Here we will set the defaults for the router
   *  @constructor
   *  @memberof Router
   *  @api private
   */
  constructor() {
    this.handlers = []
  }

  /**
   *  Adds middleware to execute before any routing request is
   *  dealt with.
   *  @param  {String|Function} route
   *  @param  {Function} fn
   *  @param  {String} method
   *  @return {Router}
   *  @memberof Router
   *  @api public
   */
  use(route, fn) {
    let type = utils.objType(route)

    if (ALLOWED.indexOf(type) === -1) {
      throw new Error(`Incorrect params given: ${route}`)
    }

    // Default route to / if no route was given.
    if (FNTYPE === type) {
      fn = route
      route = '*'
    }

    // The route must contain a middleware function
    // or we throw
    if (FNTYPE !== utils.objType(fn)) {
      throw new Error(`No callback given: ${route}`)
    }

    // Remove the trailing slash.
    route = utils.stripTrailingSlash(route)

    // Add our handler.
    let r = new Route(route, fn)
    this.handlers.push(r)

    return this
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
    // Remove the trailing slash.
    route = utils.stripTrailingSlash(route)

    // Add our handler.
    let r = new Route(route, fn, method)

    this.handlers.push(r)

    return this
  } 

  /**
   *  Handles the requested route
   *  @param {Object} req
   *  @param {Object} res
   *  @param {Function} done
   *  @memberof Router
   *  @api public
   */
  handle (req, res, done) {
    debug.info(`Dispatching route: ${req.method} ${req.url}`)

    let index = 0
    let handlers = this.handlers
    let self = this

    // We are going to add a params object onto the
    // request object so we can tie :id in routes to
    // data in a url
    req.params = Object.create(null)
    
    // Start the middleware process
    next()

    /**
     *  Calls the next method in the handlers stack
     *  @param {Object=} err
     */
    function next (err) {
      // If the headers have already been sent we do
      // not want to continue running the handlers
      if (res.headersSent) { 
        return done(err, req, res);
      }

      // we need to set the request path
      let path = req.url || '/'
      let handler = handlers[index++]

      // if there are no handlers left then we need 
      // to return the 404 handler since no other
      // methods have returned a response
      if (!handler) {
        return utils.defer(done, err, req, res)
      }

      // we also need to check if the handler needs
      // to be exectuted
      if (!self.shouldRun(path, handler)) {
        return next(err)
      }

      // finaly we can run the handler
      self.run(handler, err, req, res, next)
    }
  }

  /**
   *  Checks to see if a middleware function should be executed or
   *  if we should just run next instead.
   *  @param  {String} path
   *  @param  {String} handler
   *  @return {Boolean}
   *  @memberof Router
   *  @api private
   */
  shouldRun(path, handler) {
    let c1 = handler.route === '\\*'
    let c2 = handler.regexp.test(path)
    let c3 = path.startsWith(handler.route)
    return c1 || (c2 || c3 )
  }

  /**
   *  Calls a middleware function.
   *  @param {Object}   route
   *  @param {Object}   err
   *  @param {Object}   req
   *  @param {Object}   res
   *  @param {Function} next
   *  @memberof Router
   *  @api private
   */
  run(route, err, req, res, next) {
    // We are going to try to call our middleware function passing 
    // in next, if that fails we will set the error and call next.
    try {
      route.handle(err, req, res, next)
    } catch (e) {
      err = e
      next(err)
    }
  }    

}
