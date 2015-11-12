var assert = require('assert')
var favicon = require('../lib/middleware/favicon')
var path = require('path');

describe('favicon middleware', function(){

  it('should be able to load a favicon from a specified directory', function (done) {

    var f = favicon(path.join(__dirname, 'support/img'));
    var file;
    
    var req = {
      url: '/favicon.ico'
    };
    
    var res = {
      end: function (res) {
        file = res;
      },
      set: function () {}
    };

    return f(req, res, function result (err, req, res) {
      assert.equal(Object.prototype.toString.call(file), '[object Uint8Array]');
      done();
    });

  });

  it('should error if specified directory is wrong', function (done) {

    var f = favicon(path.join(__dirname, 'support/images'));
    
    var req = {
      url: '/favicon.ico'
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

    var f = favicon(path.join(__dirname, 'support/img'));
    
    var req = {
      url: '/favicon.png'
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

});