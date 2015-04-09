'use strict';

var util = require('util'),
    helpers = require('./helpers');

// Removes unwanted data from the time string
const FORMAT_TIME = /\s[a-zA-Z]+\+[0-9]+\s\([a-zA-Z]+\)/;

// Special characters
const CHARS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 *  Application debugger - this will allow us to send messages to a log
 *  either console. And measure the time for a request to complete 
 *  or to a data source (later on).
 */
class Debugger {

  /**
   *  Sets the main properties for our debugger class
   *  @param {Object} options
   *  @return {Debugger}
   *  @constructor
   *  @api private
   */
  constructor(options) { 
    if (helpers.objType.call(options) !== '[object Object]') {
      throw new Error('Debugger(options) - Options must be an object');
    }

    // Now to add all of our options properties onto our object
    this.options = {};
    helpers.merge(this.options, options);
  }

  /**
   *  Applies an array of arguments
   *  @param  {Array} target
   *  @param  {Array} args
   *  @param  {*}
   *  @return {target}
   *  @api private 
   */
  _apply(target, args) {
    // Add each of the arguments to the top of the array
    args.forEach(function (arg) {
      helpers.unshift.call(target, arg);
    });

    // Return the target array
    return target;
  }

  /**
   *  Writes the message to stdout
   *  @param {*}
   *  @api private 
   */
  _write() {
    let type, typeColor, message = '';

    type = helpers.shift.call(arguments);
    typeColor = CHARS[helpers.shift.call(arguments)];
    type = `${typeColor}[${type}]: `;

    message += (CHARS.green + this._formatTime(new Date()) + type);
    message += (CHARS.reset + util.format.apply(this, arguments) + '\n');
    
    process.stdout.write(message);
  }

  /**
   *  Formats a date time string
   *  @param  {Object} timestamp
   *  @return {String}
   *  @api private
   */
  _formatTime(timestamp) {
    let date, time;
    
    date = timestamp.toDateString();
    time = timestamp.toTimeString();

    return `[${date} - ${time}]`.replace(FORMAT_TIME, '');
  }

  /**
   *  Sends an info message to stdout
   *  @param {*}
   *  @api public
   */
  info() {
    this._apply(arguments, ['cyan', 'info']);
    this._write.apply(this, arguments);
  }

  /**
   *  Sends a warning message to stdout
   *  @param {*}
   *  @api public
   */
  warn() {
    this._apply(arguments, ['yellow', 'warning']);
    this._write.apply(this, arguments);
  }

  /**
   *  Sends an error message to stdout
   *  @param {*}
   *  @api public
   */
  error() {
    this._apply(arguments, ['red', 'error']);
    this._write.apply(this, arguments);
  }

}

/**
 *  Export our debugger class
 */
module.exports = Debugger;