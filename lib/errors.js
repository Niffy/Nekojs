"use strict";

const codes = require('http').STATUS_CODES

/**
 *  The main errors object this will be populated with methods
 *  for each status code
 */
var errors = module.exports = {}

/**
 *  Loop over each status code and define a new error type for
 *  each one
 */
for (let key in codes) {
  // We want to support 418 but the name isnt suitable without
  // changing it a little
  if (key === '418') {
    codes[key] = 'Im A Tea Pot'
  }

  // We need to remove hyphens and spaces from the name of 
  // the status code so we are able to use it as a function
  // name later on
  let name = codes[key].replace(/-/g, '').replace(/\s/g, '')

  // Next we need to define our new error type
  let err = function (msg) {
    this.statusCode = key
    this.message = msg || codes[key]
    this.__proto__ = Error.prototype
  }
  
  // Finaly we need to add our new error type to the exported
  // module
  errors[name] = err
}