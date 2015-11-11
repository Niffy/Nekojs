"use strict"

/**
 *  Export the memory store
 */
module.exports.MemoryStore = require('./store/memory')

/**
 *  Middleware to handle the session for our app's users
 *  @param {String} secret
 *  @param {Object} options
 *  @return {Function} sessionHandler
 *  @api public
 */
module.exports.middleware = function session (secret, options) {

  /**
   *  sessionHandler middleware
   *  @param {Object} req
   *  @param {Object} res
   *  @param {Function} next
   *  @api public
   */
  return function sessionHandler (req, res, next) {
    next()
  }

}