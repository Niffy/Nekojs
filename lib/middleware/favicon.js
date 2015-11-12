"use strict"

const path = require('path')
const fs = require('fs')
const mime = require('../mime')

const Debug = require('../debug')
const debug = new Debug({ 
  prefix: 'favicon' 
})

/**
 *  Middleware to handle requests for a favicon
 *  @param  {String}   directoryPath
 *  @return {Function} getFavicon
 *  @api public
 */
module.exports = function favicon (directoryPath) {

  /**
   *  Constructs the paths for the file we want to send 
   *  back to the client
   *  @param   {String} url
   *  @return  {String}
   *  @api private
   */
  function _dirPath (url) {
    return path.join(directoryPath, url)
  }

  /**
  * Middleware function for handling the favicon
  * @param {Object}   req
  * @param {Object}   res
  * @param {Function} next
  */
  return function getFavicon (req, res, next) {
    let path = _dirPath(req.url)
    let ext  = path.split('.')

    // The file extention
    ext = ext[ext.length - 1]

    fs.stat(path, function (err, stat) {
      if (err) { 
        debug.error(err)
        return next(err) 
      }

      fs.readFile(path, function (err, content) {
        /* istanbul ignore next */
        if (err) { 
          debug.error(err)
          return next(err) 
        }

        res.set('Content-Type', mime.find(ext))
        res.end(content)
        next()
      })
    })
  }

}