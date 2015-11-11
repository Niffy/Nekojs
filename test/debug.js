var assert = require('assert');
var sinon  = require('sinon');
var Debug = require('../lib/debug');

describe('debug', function(){

  it('should be callable', function () {
    assert.doesNotThrow(function () {
      var debug = new Debug({});
    });
  });

  it('should not try to extend the options if the given parameter is not an object', function () {
    var debug = new Debug('woot!');
    assert.equal(Object.keys(debug.options).length, 1);
  });
  
  it('sys calls can run regadless of environment', function () {
    var debug = new Debug();
    debug._write = function () {};
    var spy = sinon.spy(debug, "_write");
    debug.sys('omg it logs');
    assert.equal(spy.called, true);
  });

  it('sys calls can run regadless of environment', function () {
    var debug = new Debug();
    debug._write = function () {};
    var spy = sinon.spy(debug, "_write");
    debug.error('omg it logs');
    assert.equal(spy.called, true);
  });

  describe('info', function () {

    it('should not log if level is set to error', function () {
      var debug = new Debug({ level: 0 });
      var spy = sinon.spy(debug, "_write");
      debug.info('omg it logs');
      assert.equal(spy.called, false); 
    });

    it('should not log if level is set to warning', function () {
      var debug = new Debug({ level: 1 });
      var spy = sinon.spy(debug, "_write");
      debug.info('omg it logs');
      assert.equal(spy.called, false); 
    });    

    it('should log if level is set to info', function () {
      var debug = new Debug({ level: 2 });
      debug._write = function () {};
      var spy = sinon.spy(debug, "_write");
      debug.info('omg it logs');
      assert.equal(spy.called, true); 
    });    

  });

  describe('warn', function () {

    it('should not log if level is set to error', function () {
      var debug = new Debug({ level: 0 });
      var spy = sinon.spy(debug, "_write");
      debug.warn('omg it logs');
      assert.equal(spy.called, false); 
    });

    it('should log if level is set to warning', function () {
      var debug = new Debug({ level: 1 });
      debug._write = function () {};
      var spy = sinon.spy(debug, "_write");
      debug.warn('omg it logs');
      assert.equal(spy.called, true); 
    });    

    it('should log if level is set to info', function () {
      var debug = new Debug({ level: 2 });
      debug._write = function () {};
      var spy = sinon.spy(debug, "_write");
      debug.warn('omg it logs');
      assert.equal(spy.called, true); 
    });    

  });  

});