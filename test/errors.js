var assert = require('assert');
var errors = require('../lib/errors');
var codes = require('http').STATUS_CODES;

describe('errors', function(){

  for (var key in codes) {
    var name = codes[key];
    it('should have an error for ' + name, function () {
      var fnName = name.replace(/-/g, '').replace(/\s/g, ''); // create the function name
      var err = new errors[fnName];
      assert.equal(typeof errors[fnName], 'function');
      assert.equal(err instanceof Error, true);
      assert.equal(err.statusCode, key);
      assert.equal(err.message, name);
    })
  }

});