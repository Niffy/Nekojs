"use strict"

const path = require('path')
const fs = require('fs')
const mime = require('../mime')

const Debug = require('../debug')
const debug = new Debug({ 
  prefix: 'files' 
})

const MAXAGE = 60 * 60 * 24 * 365 * 1000

/**
 *  Middleware to serve static files from a directory
 *  @param  {String}   directoryPath
 *  @param  {Object=}  options
 *  @return {Function} serveFiles
 *  @api public
 */
module.exports = function serveFiles (directoryPath, options) {

  let opts = options || {
    cache: false,
    maxAge: MAXAGE
  }

  /**
   *  Constructs the paths for the file we want to send 
   *  back to the client
   *  @param   {String} url
   *  @return  {String}
   *  @api private
   */
  function dirPath (url) {
    url = url.replace(/^\/public/i, '')
    return path.join(directoryPath, url)
  }

  /**
   *  Checks if the method is allowed
   *  @param  {String} method
   *  @return {Boolean}
   *  @api private
   */
  function _isAllowed (method) {
    return method !== 'GET' && method !== 'HEAD'
  }

  /**
   *  Sends a not allowed or options response
   *  @param {String}   method
   *  @param {Function} next
   *  @api private
   */
  function _notAllowed (method, next) {
    this.statusCode = method === 'OPTIONS' ? 200 : 405
    this.set('Allow', 'GET, HEAD, OPTIONS')
    this.set('Content-Length', '0')
    this.end()
    return next()
  }

  /**
   *  Sends an error response
   *  @param {Object}   err
   *  @param {Function} next
   *  @api private
   */
  function _sendError(err, next) {
    debug.error(err)
    return next(err) 
  }

  /**
   *  Cache control
   *  @api private
   */
  function cacheControl () {
    if (opts.cache) {
      let expires = Math.floor(opts.maxAge / 1000)
      let cache = 'public, max-age=' + expires
      this.set('Cache-Control', cache)
    }
  }  

  /**
   *  Middleware handler for static files
   *  @param {Object}   req
   *  @param {Object}   res
   *  @param {Function} next
   *  @api public
   */
  return (req, res, next) => {
    let method = req.method

    console.log('hit')

    // Return 200 for options request anything else we dont
    // like send back a method not allowed response
    if (_isAllowed(method)) {
      return _notAllowed.call(res, method, next)
    }

    // Get the file path and extention
    let path = dirPath(req.url)
    let ext  = path.split('.')
    ext = ext[ext.length - 1]

    fs.stat(path, (err, stat) => {
      if (err) { 
        return _sendError.call(res, err, next)
      }

      fs.readFile(path, (err, content) => {
        /* istanbul ignore next */
        if (err) { 
          return _sendError.call(res, err, next)
        }

        // handle the cache controll headers
        cacheControl.call(res)

        res.set('Content-Type', mime.find(ext))
        res.statusCode = 200
        res.end(content)

        next()
      })

    })
  }

}