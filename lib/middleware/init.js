"use strict"

const Debug = require('../debug')
const debug = new Debug({ 
  prefix: 'init' 
})

/**
 *  Middleware initializor!!11
 *  @param  {Object} self
 *  @return {Function} init
 *  @api public
 */
module.exports = function initializor (self) {

  /**
   *  Return the middleware to start it all off...
   *  @param {Object} req
   *  @param {Object} req
   *  @param {Object} req
   *  @api public
   */
  return function init (req, res, next) {

    if (self.enabled('x-powered-by')) {
      res.setHeader('X-Powered-By', 'Nekojs')
    }

    // Add the settings to the request object for use later
    req.neko_settings = self.settings

    // Makes things easier
    req.res = res
    res.req = req
    req.next = next

    // Create an empty object for our locals
    res.locals = res.locals || Object.create(null)

    // Continue
    next()
  }

}