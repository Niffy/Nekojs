'use strict';

/**
 *  Export some convenience methods
 */
module.exports.objType = {}.toString;
module.exports.shift = [].shift;
module.exports.unshift = [].unshift;

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
      target[key] = source[key];
    }
  }
  return target;
};

/**
 *  Deffers a function call to keep things async
 *  @param {Function} fn
 */
module.exports.defer = function deferCall (fn) {
  process.nextTick(fn.bind.apply(fn, arguments));
};

/**
 *  Sets the charset in a content-type string
 *  @param  {String} type
 *  @param  {String} charset
 *  @return {String}
 *  @api public
 */
module.exports.charset = function setCharset (type, charset) {
  var contentType = '';

  if (!type || !charset) {
    return type;
  }

  contentType += type + '; charset=' + charset;

  return contentType;
};