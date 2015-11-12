"use strict"

const types = require('./data.json')

const Debug = require('../debug')
const debug = new Debug({ 
  prefix: 'mime' 
})

// We are going to map each extension to its
// mime type, we are also going to export
// them as they may come in handy
var map = module.exports.types = {}

for (let key in types) {
  let exts = types[key]
  exts.forEach(ext => {
    map[ext] = key
  })
} 

/**
 *  Looks up a mimetype by it's file ext
 *  @param  {String} ext
 *  @return {String} mimeType
 *  @api public
 */
module.exports.find = function getMime (ext) {
  return map[ext] || 'text/plain'
}