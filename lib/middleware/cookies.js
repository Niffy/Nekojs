"use strict"

var pair = /; */;

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

    // If we already have cookies then we will just
    // continue with the middleware
    if (req.cookies) {
      return next()
    }

    // Set some objects onto the request object and
    // get the cookies from the headers
    let cookies = req.headers.cookie
    req.cookies = Object.create(null)

    // If we don't have any cookies in the header
    // then we are just going to continue with the
    // middleware
    if (!cookies) {
      return next()
    }

    // Next we need to parse the cookies
    req.cookies = parse(cookies, options)

    next()
  }

}

/**
 *  Parses a cookie string
 *  @param {String} str
 *  @param {Object} options
 *  @returns {Object}
 */
function parse (str, options) {
  if (typeof str !== 'string') {
    throw new Error('cookies must be a string')
  }

  let opts = options || {}
  let obj  = {}
  let cookies = str.split(pair)

  cookies.forEach(cookie => {
    let idx = cookie.indexOf('=')

    // We want to skip anything that isn't a key pair
    // cookie string
    if (idx < 0) { return; }

    // Now we can get our cookie data out
    let key = cookie.substr(0, idx).trim()
    let val = cookie.substr(idx + 1, cookie.length).trim()

    // also need to deal with quotes
    if ('"' === val[0]) {
      val = val.slice(1, -1)
    }

    // We only want to set the cookie item once. so
    // any dupes get ignored
    if ('undefined' === typeof obj[key]) {
      obj[key] = decodeURIComponent(val)
    }

  });

  return obj
}