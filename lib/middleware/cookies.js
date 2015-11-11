"use strict"

/**
 *  Middleware to handle cookies for our app
 *  @param {String} secret
 *  @param {Object} options
 *  @return {Function} cookieParser
 *  @api public
 */
module.exports = function cookies (secret, options) {

  /**
   *  cookieParser middleware
   *  @param {Object}     req
   *  @param {Object}     res
   *  @param {Function} next
   *  @api public
   */
  return  (req, res, next) => {
    if (req.cookies) {
      return next()
    }

    let cookies = req.headers.cookie

    if (!cookies) {
      return next()
    }

    next()
  }

}