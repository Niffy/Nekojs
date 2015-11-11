"use strict";

const Debug = require('../debug')
const debug = new Debug({ 
  prefix: 'route' 
})

/**
 *  Constructs a new route object for the router to use
 *  when dealing with requests.
 */
module.exports = class Route {

  /**
   *  Defines the main properties.
   *  @param  {Object}   route
   *  @param  {Function} fn
   *  @param  {String}   method
   *  @return {Route}
   *  @constructor
   *  @memberof Route
   *  @api private
   */
  constructor(route, fn, method) {
    this.route = route
    this.fn = fn
    this.method = (method || '*')
  }

  /**
   *  Checks to see if the method is allowed.
   *  @param  {String} reqMethod
   *  @return {Boolean}
   *  @memberof Route
   *  @api private
   */
  checkMethod(reqMethod) {
    let check1 = (this.method === '*')
    let check2 = (reqMethod.toLowerCase() === this.method)
    return (check1 || check2)
  }

  /**
   *  Dispatches the requested route.
   *  @param {Object}   err
   *  @param {Object}   req
   *  @param {Object}   res
   *  @param {Function} done
   *  @memberof Route
   *  @api public
   */
  handle(err, req, res, done) {
    let arity = this.fn.length
    let hasError = Boolean(err)

    // We need to check if the method should run in all request methods or
    // if we should only respond to certain ones.
    if (this.checkMethod(req.method)) {
      if (hasError && arity === 4) {
        // Error handler
        return this.fn.apply(this, [err, req, res, done])
      } else if (!hasError && arity < 4) {
        // Request handler
        return this.fn.apply(this, [req, res, done])
      }
    }

    // Continue.
    done(err)
  }

}