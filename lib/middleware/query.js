"use strict"

const qs = require('querystring')

const Debug = require('../debug')
const debug = new Debug({ 
  prefix: 'query' 
})

/**
 *  Middleware to sort out query string data.
 *  @param  {Object} req, res, next
 *  @return {Function} query
 *  @api public
 */
module.exports = function query (req, res, next) {
  // check if we have a query string in our url, if we do then 
  // it should be stripped and parsed.
  if (req.url.indexOf('?') !== -1) {
    try {
      let parts = req.url.split('?')
      req.query = _qs(qs.parse(parts[1]))
      req.url = parts[0]
    } catch (e) {
      /* istanbul ignore next */
      debug.error(e)
    }
  }
  
  // Continue.
  next();
};

/**
 *  Tries to call JSON.parse on our querystring params, this
 *  is so we are able to pass objects & arrays
 *  @param {Object} query
 *  @return  {Object} query
 *  @api private
 */
function _qs (query) {
  for (let key in query) {
    /* istanbul ignore else  */
    if (query.hasOwnProperty(key)) {
      try {
        query[key] = JSON.parse(query[key])
      } catch (e) {
        debug.error(e);
      }
    }
  }
  return query
}