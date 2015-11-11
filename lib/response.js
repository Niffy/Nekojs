'use strict';

/**
 *  Module dependencies
 */
const http = require('http')
const mime = require('./mime')
const tmpl = require('./templates')
const helpers = require('./utils')

const Debug = require('./debug')
const debug = new Debug({ 
  prefix: 'response' 
})

/**
 *  Our response class
 *  @return {Res}
 *  @api public
 */ 
module.exports = class Response extends http.ServerResponse {

  /**
   *  Defines the main properties
   *  @constructor
   *  @param {Object} req
   *  @return {Ressponse}
   *  @memberof Response
   *  @api privte
   */  
  constructor(req) {
    super(req)
  }

  /**
   *  Sets a header
   *  @param {String} name
   *  @param {String} value
   *  @return {String}
   *  @memberof Response
   *  @api public
   */
  set(name, value) {
    return this.setHeader(name, value)
  }

  /**
   *  Sets a status code.
   *  @param {Number} code
   *  @memberof Response
   *  @api public
   */
  status(code) {
    this.statusCode = code
    return this
  }

  /**
   *  Sends a response.
   *  @param {String|Number|Boolean|Object|Buffer} body
   *  @memberof Response
   *  api public
   */
  send(body) {
    this.end(body)
  }

  /**
   *  Sets the content type
   *  @param {String} type
   *  @memberof Response
   *  @api public
   */
  type(type) {
    return this.set('Content-Type', ~type.indexOf('/')
      ? type
      : mime.find(type))
  }

  /** 
   *  Sends a JSON response
   *  @param {*} data
   *  @memberof Response
   *  @api public
   */
  json(data) {
    let resp = {
      status: 'success',
      code: 200
    }

    if (data instanceof Error) {
      resp.code = data.statusCode || 500
      resp.status = 'error'
      resp.meta = { message: data.message }
      this.status(resp.code)
    } else {
      resp.data = data
    }
    
    let str = JSON.stringify(resp)
    let len = Buffer.byteLength(str)

    this.set('Content-Type', 'application/json')
    this.set('Content-Length', len)
    this.end(str)
  }

  /**
   *  Renders a template file
   *  @param {String}  file
   *  @param {Object} data
   *  @api public
   */
  render(file, data) {
    let self = this

    // If we have data we will merge it with the locals in a nested
    // 'data' object so we have access to it in the view
    if (helpers.objType(data) === '[object Object]') {
      helpers.merge(this.locals, data)
    }

    // Set our view path to grab the file
    let folder = this.req.neko_settings['view path']
    let ext = this.req.neko_settings['view ext']

    // We need to check if the settings have been defined otherwise
    // an error will be thrown looking up the file, so we will just
    // send a response to remind us
    if (!folder || !ext) {
      let setting = !folder ? 'view path' : 'view ext'
      self.status(500);
      return self.end(`Templates not configured set: ${setting}`)
    }

    // the final path for looking up the view template
    let viewPath = (folder + '/' + file + '.' + ext)

    // Render the template
    tmpl.render(viewPath, this.locals, (err, template) => {
      if (err) { 
        self.status(500);
        return self.end(err.message)
      }
      self.set('Content-Type', 'text/html')
      self.end(template.view)
    })
  }  

}