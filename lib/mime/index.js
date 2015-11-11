"use strict"

const types = require('./data.json')

const Debug = require('../debug')
const debug = new Debug({ 
  prefix: 'mime' 
})

/**
 *  Looks up a mimetype
 *  @param  {String} ext
 *  @return {String} mimeType
 *  @api public
 */
module.exports.find = function getMime (ext) {
  var type = types[ext]
  return (type || 'text/plain')
}