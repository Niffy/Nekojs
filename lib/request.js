'use strict';

var http = require('http');

/**
 *  Our request class
 *  @return {Res}
 *  @api public
 */ 
class Request extends http.IncomingMessage {

  /**
   *  Defines the main properties
   *  @constructor
   *  @return {Res}
   *  @api privte
   */  
  constructor() {

  }

  /**
   *  Returns a header
   *  @param  {String} name
   *  @return {String} 
   *  @api public
   */
  get(name) {
    switch (name = name.toLowerCase()) {
      case 'referer':
      case 'referrer':
        return this.headers.referrer ||
          this.headers.referer;
      default:
        return this.headers[name]; 
    }
  }

}


/**
 *  Export the request module
 */
module.exports = Request;