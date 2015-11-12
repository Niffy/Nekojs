"use strict"

const path = require('path')
const fs = require('fs')
const mime = require('../mime')

const Debug = require('../debug')
const debug = new Debug({ 
  prefix: 'files' 
})

/**
 *  Middleware to serve static files from a directory
 *  @param  {String} directoryPath
 *  @param  {String} folder
 *  @return {Function} serveFiles
 *  @api public
 */
module.exports = function serveFiles (directoryPath, folder) {

  directoryPath = path.join(directoryPath, folder);

  /**
   *  Constructs the paths for the file we want to send 
   *  back to the client
   *  @param   {String} url
   *  @return  {String}
   *  @api private
   */
  function dirPath (url) {
    return path.join(directoryPath, url)
  }

  /**
   *  Middleware handler for static files
   *  @param {Object}   req
   *  @param {Object}   res
   *  @param {Function} next
   *  @api public
   */
  return (req, res, next) => {
    let path = dirPath(req.url)
    let ext  = path.split('.')

    // The file extention
    ext = ext[ext.length - 1]

    fs.stat(path, (err, stat) => {
      if (err) { 
        debug.error(err)
        return next(err) 
      }

      fs.readFile(path, (err, content) => {
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