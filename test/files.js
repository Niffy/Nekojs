var assert = require('assert')
var files = require('../lib/middleware/files')
var path = require('path');

describe('files middleware', function(){

  it('should be able to load a files from a specified directory', function (done) {

    var f = files(__dirname, 'support');
    var file;
    
    var req = {
      url: '/img/favicon.ico'
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

    var f = files(__dirname, 'public');
    
    var req = {
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

});