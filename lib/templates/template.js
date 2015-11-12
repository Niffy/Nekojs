"use strict"

const TAG_REGEXP = /<%\s(.+?)\s%>/g
const JS_REGEXP = /(^( )?(var|if|for|else|switch|case|break|default|{|}|;))(.*)?/g
const FN_REGEXP = /[\r\t\n]/g

const Debug = require('../debug')
const debug = new Debug({ 
  prefix: 'templates' 
})

/**
 *  Simple template rendering class
 *  @class Template
 */
module.exports = class Template {

  /**
   *  Define the main properties
   *  @param {String} html
   *  @param {Object} data
   *  @constructor
   *  @memberof Template
   *  @api private
   */
  constructor (html, data) {
    this.html = html
    this.data = data
    this.cursor = 0;
    this.code = 'with(obj) { var r = [];\n'
    this.result = ''
    this.match = undefined
  }

  /**
   *  Adds a new line of code to our function string
   *  @param {String} line
   *  @param {Boolean} js
   *  @return Template._add
   *  @memberof Template
   *  @api private
   */
  _add(line, js) {
    js? (this.code += line.match(JS_REGEXP) ? line + '\n' : 'r.push(' + line + ');\n') :
      (this.code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '')

    return this._add
  }

  /**
   *  Moves the cursor to the end of the match
   *  @return {Number} Template.cursor
   *  @memberof Template
   *  @api private
   */
  moveCursor() {
    return (this.cursor = this.match.index + this.match[0].length)
  }

  /**
   *  Adds the last section of the function string
   *  @memberof Template
   *  @api private
   */
  _join() {
    this.code = (this.code + 'return r.join(""); }').replace(FN_REGEXP, '')
  }

  /**
   *  Returns the compiled template string
   *  @return {String} Template.result
   *  @memberof Template
   *  @api public
   */
  render() {
    debug.info('Rendering template')

    while (this.match = TAG_REGEXP.exec(this.html)) {
      this._add(this.html.slice(this.cursor, this.match.index)).call(this, this.match[1], true)
      this.moveCursor()
    }
    
    this._add(this.html.substr(this.cursor, this.html.length - this.cursor))
    this._join()
    this.result = new Function('obj', this.code).apply(this.data, [this.data])
    
    return this.result
  }

}