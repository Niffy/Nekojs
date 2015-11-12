var assert = require('assert')
var files = require('../lib/middleware/files')
var path = require('path');
var sinon = require('sinon');

describe('files middleware', function(){

  it('should be able to load a files from a specified directory', function (done) {

    var f = files(__dirname, 'support', {
      cache: true,
      maxAge: 60 * 60 * 24 * 365 * 1000
    });

    var file;
    
    var req = {
      method: 'GET',
      url: '/img/favicon.ico'
    };
    
    var res = {
      end: function (res) {
        file = res;
      },
      set: function () {}
    };

    var spy = sinon.spy(res, 'set');

    return f(req, res, function result (err, req, res) {
      assert.equal(Object.prototype.toString.call(file), '[object Uint8Array]');
      assert.equal(spy.calledTwice, true);
      done();
    });

  });

  it('should be ashould not cahce if told not too', function (done) {

    var f = files(__dirname, 'support', {
      cache: false
    });

    var file;
    
    var req = {
      method: 'GET',
      url: '/img/favicon.ico'
    };
    
    var res = {
      end: function (res) {
        file = res;
      },
      set: function () {}
    };

    var spy = sinon.spy(res, 'set');

    return f(req, res, function result (err, req, res) {
      assert.equal(Object.prototype.toString.call(file), '[object Uint8Array]');
      assert.equal(spy.calledOnce, true);
      done();
    });

  });  

  it('should error if specified directory is wrong', function (done) {

    var f = files(__dirname, 'public');
    
    var req = {
      method: 'GET',
      url: '/img/icon.png'
    };
    
    var res = {
      end: function () {},
      set: function () {}
    };

    return f(req, res, function result (err, req, res) {
      assert.equal(Object.prototype.toString.call(err), '[object Error]')
      done();
    });

  });

  it('should error if the file does not exist', function (done) {

    var f = files(__dirname, 'support');
    
    var req = {
      method: 'GET',
      url: '/img/icon.png'
    };
    
    var res = {
      end: function () {},
      set: function () {}
    };

    return f(req, res, function result (err, req, res) {
      assert.equal(Object.prototype.toString.call(err), '[object Error]')
      done();
    });

  });  


  it('should return the correct response for an options request', function (done) {

    var f = files(__dirname, 'support');
    
    var req = {
      method: 'OPTIONS',
      url: '/favicon.png'
    };
    
    var res = {
      end: function () {},
      set: function () {}
    };

    return f(req, res, function result (err) {
      assert.equal(res.statusCode, 200)
      done();
    });

  });

  it('should return the correct response for an method not allowed request', function (done) {

    var f = files(__dirname, 'support');
    
    var req = {
      method: 'POST',
      url: '/favicon.png'
    };
    
    var res = {
      end: function () {},
      set: function () {}
    };

    return f(req, res, function result (err) {
      assert.equal(res.statusCode, 405)
      done();
    });

  });   

});