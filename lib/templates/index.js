"use strict"

const fs = require('fs')
const helpers = require('../utils')
const Template = require('./template')

const Debug = require('../debug')
const debug = new Debug({ 
  prefix: 'render' 
})

/**
 *  Renders a template
 *  @param {String} path
 *  @param {Object} data
 *  @param {Function} callback
 *  @return {String}
 *  @api public
 */
module.exports.render = function renderTemplate (path, data, callback) {
  let file = {}
  let tmpl

  fs.stat(path, function (err, stat) {
    if (err) { 
      debug.error(err.message)
      return callback(err)
    }

    fs.readFile(path, function (err, content) {
      /* istanbul ignore next */
      if (err) { 
        debug.error(err.message)
        return callback(err) 
      }

      // Create the new template
      tmpl = new Template(content.toString(), data)

      // Now we are able to construct our file response
      file = stat

      // throw the error if we get one trying to render 
      // the template
      try {
        file.view = tmpl.render()
      } catch (e) {
        e.message = 'Template Error: ' + e.message;
        debug.error(e.message)
        return callback(e)
      }

      // Retun it via the callback
      callback(null, file)
    })

  })
}