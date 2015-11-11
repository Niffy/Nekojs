"use strict";

const util = require('util')
const helpers = require('./utils')
const FORMAT_TIME = /\s[a-zA-Z]+\+[0-9]+\s\([a-zA-Z]+\)/
const LEVELS = {
  error: 0,
  warning: 1,
  info: 2
}
const CHARS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
}

/**
 *  Application debugger - this will allow us to send messages to a log
 *  either console. And measure the time for a request to complete 
 *  or to a data source (later on).
 */
module.exports = class Debug {

  /**
   *  Sets the main properties for our debugger class
   *  @param {Object} options
   *  @return {Debug}
   *  @constructor
   *  @memberof Debug
   *  @api private
   */
  constructor(options) { 
    let level = LEVELS[process.env.NODE_DEBUG_LEVEL || 'error']
    this.options = { 
      level: level
    }
    if (helpers.objType(options) === '[object Object]') {
      helpers.merge(this.options, options)
    }
  }

  /**
   *  Applies an array of arguments
   *  @param  {Array} target
   *  @param  {Array} args
   *  @param  {*}
   *  @return {target}
   *  @memberof Debug
   *  @api private 
   */
  _apply(target, args) {
    // Add each of the arguments to the top of the array
    args.forEach(function (arg) {
      helpers.unshift.call(target, arg)
    })

    // Return the target array
    return target
  }

  /**
   *  Writes the message to stdout
   *  @param {*}
   *  @memberof Debug
   *  @api private 
   */
  _write() {
    let message = ''
    let typeStr = helpers.shift.call(arguments)
    let typeColor = CHARS[helpers.shift.call(arguments)]
    let type = `${typeColor}[${typeStr}]: `

    message += (CHARS.green + this.formatTime(new Date()) + type)
    message += (CHARS.reset + util.format.apply(this, arguments) + '\n')
    
    process.stdout.write(message)
  }

  /**
   *  Formats a date time string
   *  @param  {Object} timestamp
   *  @return {String}
   *  @memberof Debug
   *  @api private
   */
  formatTime(timestamp) {
    let date = timestamp.toDateString()
    let time = timestamp.toTimeString()

    return `[${date} - ${time}]`.replace(FORMAT_TIME, '')
  }

  /**
   *  Checks to make that the log level allows the method
   *  to write a log to stdout
   *  @param {String} type
   *  @memberof Debug
   *  @api private   
   */
  canLog(type) {
    return this.options.level >= LEVELS[type]
  }

  /**
   *  Sends an info message to stdout
   *  @param {*}
   *  @memberof Debug
   *  @api public
   */
  sys() {
    this._apply(arguments, ['cyan', 'sys'])
    this._write.apply(this, arguments)
  }  

  /**
   *  Sends an info message to stdout
   *  @param {*}
   *  @memberof Debug
   *  @api public
   */
  info() {
    let type = 'info'
    if (this.canLog(type)) {
      this._apply(arguments, ['cyan', type])
      this._write.apply(this, arguments)
    }
  }

  /**
   *  Sends a warning message to stdout
   *  @param {*}
   *  @memberof Debug
   *  @api public
   */
  warn() {
    let type = 'warning'
    if (this.canLog(type)) {
      this._apply(arguments, ['yellow', type])
      this._write.apply(this, arguments)
    }
  }

  /**
   *  Sends an error message to stdout
   *  @param {*}
   *  @memberof Debug
   *  @api public
   */
  error() {
    this._apply(arguments, ['red', 'error'])
    this._write.apply(this, arguments)
  }

}