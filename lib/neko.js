"use strict"

const EventEmitter = require('events').EventEmitter
const Router = require('./router')
const Request = require('./request')
const Response = require('./response')
const errors = require('./errors')
const http = require('http')
const init = require('./middleware/init')
const files = require('./middleware/files')
const favicon = require('./middleware/favicon')
const query = require('./middleware/query')
const cookies = require('./middleware/cookies')
const session = require('./middleware/session')

const Debug = require('./debug')
const debug = new Debug({ 
  prefix: 'neko' 
})

/**
 *  Neko - a minimalist web framework
 *  @class Neko
 */
module.exports = class Neko extends EventEmitter {

  /**
   *  Neko constructor - here we will define some
   *  default properties of the application
   *  @constructor
   *  @memberof Neko
   *  @api private
   */
  constructor() {
    super()

    this.cache = {}
    this.settings = {}
    this.errors = errors
    this.files = files
    this.favicon = favicon
    this.cookies = cookies
    this.session = session
    this.logger = new Debug({ prefix: 'app' })

    this.router = new Router()

    this.request = { 
      __proto__: new Request(), 
      app: this 
    }

    this.response = { 
      __proto__: new Response(this.request), 
      app: this
    }

    this.defaultConfig()

    this.use(query)
    this.use(init(this))
  }

  /**
   *  Sets the default configuration for the app
   *  @memberof Neko
   *  @api private
   */
  defaultConfig() {
    debug.info('Setting defaults')

    let env = process.env.NODE_ENV || 'development'
    
    this.enable('x-powered-by')
    this.set('env', env)
    this.set('port', 1337)
    
    this.locals = Object.create(null)
    this.locals.settings = this.settings
    
    if (env === 'production') {
      this.enable('view cache')
    }
  }

  /**
   *  Sets a setting property on the app, if the value is
   *  not given it will try to return the setting
   *  @param {String} name
   *  @param {*=} value
   *  @memberof Neko
   *  @api private
   */
  set(name, value) {
    if (arguments.length <= 1) {
      return this.settings[name]
    } else {
      this.settings[name] = value
      return this
    }
  }

  /**
   *  Checks to see if a setting is enabled
   *  @param {String} name
   *  @returns {Boolean}
   *  @memberof Neko
   *  @api private
   */
  enabled(name) {
    return !!this.set(name)
  }

  /**
   *  Checks to see if a setting is disabled
   *  not given it will try to return the setting
   *  @param {String} name
   *  @returns {Boolean}
   *  @memberof Neko
   *  @api private
   */
  disabled(name) {
    return !this.set(name)
  }

  /**
   *  Enables an application setting
   *  not given it will try to return the setting
   *  @param {String} name
   *  @memberof Neko
   *  @api private
   */
  enable(name) {
    this.set(name, true)
    return this
  }

  /**
   *  Disables an application setting
   *  not given it will try to return the setting
   *  @param {String} name
   *  @param {*=} value
   *  @memberof Neko
   *  @api private
   */ 
  disable(name) {
    this.set(name, false)
    return this
  }

  /**
   *  Allows us to add middleware to the handler stack
   *  route handler runs for a certain route.
   *  @param  {String|Function} route
   *  @param  {Function} fn
   *  @return {Framework}
   *  @api public
   */
  use(route, fn) {
    this.router.use(route, fn)
    return this
  }

  /**
   *  Shortcut method for creating a GET route
   *  @param {String} route
   *  @param {Function} handler
   *  @memberof Neko
   *  @api public
   */
  get(route, handler) {
    this.router.create(route, handler, 'get')
    return this
  }

  /**
   *  Shortcut method for creating a PUT route
   *  @param {String} route
   *  @param {Function} handler
   *  @memberof Neko
   *  @api public
   */
  put(route, handler) {
    this.router.create(route, handler, 'put')
    return this
  }

  /**
   *  Shortcut method for creating a POST route
   *  @param {String} route
   *  @param {Function} handler
   *  @memberof Neko
   *  @api public
   */
  post(route, handler) {
    this.router.create(route, handler, 'post')
    return this
  }

  /**
   *  Shortcut method for creating a DELETE route
   *  @param {String} route
   *  @param {Function} handler
   *  @memberof Neko
   *  @api public
   */
  del(route, handler) {
    this.router.create(route, handler, 'delete')
    return this
  }      

  /**
   *  Starts the application running - once done should accept
   *  incomming requests
   *  @param {Function} cb
   *  @memberof Neko
   *  @api public
   */
  listen(cb) {
    let server = http.createServer(this.handler())
    let port = this.settings.port

    // we need to expose the close method
    this.close = server.close

    return server.listen.apply(server, [port, () => {
      debug.info('Starting server')
      if ('function' === typeof cb) {
        cb(port)
      }
    }])
  }

  /**
   *  The main request handler this deals with the requests and
   *  dispatches them to the router
   *  @returns {Function}
   *  @memberof Neko
   *  @api private
   */
  handler() {
    debug.info('Creating handler')

    /**
     *  The default 404 handler
     *  @param {Object} err
     *  @param {Object} req
     *  @param {Object} res
     */
    function done (err, req, res) {
      if (res.headersSent) { return; }
      let status = 404
      let message = `${status} Cannot ${req.method} ${req.url}`
      res.statusCode = status
      res.send(message)
    }

    //  Returns the method to handle each response
    //  we pass the 404 handler into this
    return (req, res) => {
      req.__proto__ = this.request
      res.__proto__ = this.response
      this.router.handle(req, res, done)
    }
  }

}