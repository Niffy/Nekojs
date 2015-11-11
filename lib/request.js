"use strict";

const http = require('http')

const Debug = require('./debug')
const debug = new Debug({ 
  prefix: 'request' 
})

/**
 *  Our request class
 *  @return {Res}
 *  @api public
 */
module.exports = class Request extends http.IncomingMessage {

  /**
   *  Defines the main properties
   *  @constructor
   *  @return {Request}
   *  @memberof Request
   *  @api privte
   */  
  constructor() {
    super()
  }

  /**
   *  Returns a header
   *  @param  {String} name
   *  @return {String} 
   *  @memberof Request
   *  @api public
   */
  get(name) {
    switch (name = name.toLowerCase()) {
      case 'referer':
      case 'referrer':
        return this.headers.referrer || this.headers.referer
      default:
        return this.headers[name]
    }
  }

}