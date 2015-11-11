"use strict"

/**
 *  Export some convenience methods
 */
module.exports.shift = [].shift
module.exports.unshift = [].unshift

module.exports.objType = function (obj) {
  return {}.toString.call(obj)
}

/**
 *  Removes the trailing slash from a string
 *  @param {String} str
 *  @returns {String} str
 *  @api public
 */
module.exports.stripTrailingSlash = function stripTrailingSlash (route) {
  let len = route.length - 1
  
  if ('/' == route[len] && len > 0) {
    route = route.slice(0, len)
  }

  return route    
}

/**
 *  Merges 2 objects
 *  @param  {object} target
 *  @param  {Object} source
 *  @return {Object} target
 *  @api public
 */
module.exports.merge = function mergeObjects (target, source) {
  for(let key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key]
    }
  }
  
  return target
}

/**
 *  Sets the charset in a content-type string
 *  @param  {String} type
 *  @param  {String} charset
 *  @return {String}
 *  @api public
 */
module.exports.charset = function setCharset (type, charset) {
  let contentType = ''

  if (!type || !charset) {
    return type
  }

  contentType += type + '; charset=' + charset

  return contentType
}

/**
 *  Grabs a nested property from an object
 *  @param {String}        propString
 *  @param {Object}       obj
 *  @param {Function=} callback
 *  @param {String} str
 *  @return {*}
 *  @api public
 */
module.exports.nestedValue = function (propString, obj, cb) {

  if ('string' !== typeof propString) {
    throw new Error('property must be a string')
  }

  let prop 
  let props = propString.split('.')

  for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
    prop = props[i]

    let candidate = obj[prop]

    if (candidate !== undefined) {
      obj = candidate
    } else {
      break
    }
  }

  return typeof cb === 'function' ?
    cb(obj[props[i]]) :
    obj[props[i]]
}

/**
 *  Deffers a function call to keep things async
 *  @param {Function} fn
 */
module.exports.defer = function deferCall (fn) {
  process.nextTick(fn.bind.apply(fn, arguments))
}