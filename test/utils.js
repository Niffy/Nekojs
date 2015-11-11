var assert = require('assert');
var sinon  = require('sinon');
var utils = require('../lib/utils');

describe('utils', function(){

  describe('shift', function () {
    it('should shift an array', function () {
      var myFish = ['angel', 'clown', 'mandarin', 'surgeon'];
      
      assert.equal(myFish.toString(), 'angel,clown,mandarin,surgeon');

      var shifted = utils.shift.call(myFish); 

      assert.equal(myFish.toString(), 'clown,mandarin,surgeon');
      assert.equal(shifted, 'angel');
    });
  });

  describe('unshift', function () {
    it('should unshift an array', function () {
      var myFish = ['clown', 'mandarin', 'surgeon'];
      
      assert.equal(myFish.toString(), 'clown,mandarin,surgeon');

      utils.unshift.call(myFish, 'angel'); 

      assert.equal(myFish.toString(), 'angel,clown,mandarin,surgeon');
    });  
  });

  describe('objType', function () {
    it('should be able to get the type of an object', function () {
      var obj = utils.objType({});
      var arr = utils.objType([]);
      var fn = utils.objType(function () {});

      assert.equal('[object Object]', obj);
      assert.equal('[object Array]', arr);
      assert.equal('[object Function]', fn);

    });
  });

  describe('stripTrailingSlash', function () {
    it('Should remove the trailing slash from a string', function () {
      var before = 'omg/pow/';
      assert.equal(utils.stripTrailingSlash(before), 'omg/pow');
    });

    it('should not modify the string if it does not contain a trailing slash', function () {
      var before = 'omg/pow';
      assert.equal(utils.stripTrailingSlash(before), 'omg/pow');
    });
  });

  describe('merge', function () {

    it('should megre string properties', function () {
      var obj = { test: 'woot' };
      var obj2 = { testing: 'pow' };
      utils.merge(obj, obj2);
      assert.equal(obj.test, 'woot');
      assert.equal(obj.testing, 'pow');
    });

    it('should overwrite a property', function () {
      var obj = { test: 'woot' };
      var obj2 = { test: 'pow' };
      utils.merge(obj, obj2);
      assert.equal(obj.test, 'pow');
    });

  });  

  describe('charset', function () {

    it('should be able to create a charset string', function () {
      var test = utils.charset('text/html', 'utf-8');
      assert.equal(test, 'text/html; charset=utf-8');
    });

    it('should be able to just output the type if thecharset is not given', function () {
      var test = utils.charset('text/html');
      assert.equal(test, 'text/html');
    });
  }); 

  describe('nestedValue', function () {

    it('should be able to get a nested value from an object', function () {
      var obj = { 
        test: { 
          testing: { 
            ninja: 'woot',
            pow: 'wtf' 
          } 
        } 
      };
      assert(utils.nestedValue('test.testing.pow', obj), 'wtf');
    });

    it('should return undefined if the property does not exist', function () {
      var obj = { 
        test: { 
          testing: true
        },
        ninja: {
            woot: 'omg'
        }
      };

      assert(typeof utils.nestedValue('test.ninja.pow', obj), 'undefined');      
    })

    it('should throw if the property is not a string', function () {
      assert.throws(function () {
        utils.nestedValue(function () {}, {});
      });
    });

    it('should pass the result to the callback if one was given', function (done) {
      var obj = { 
        test: { 
          testing: { 
            ninja: 'woot',
            pow: 'wtf' 
          } 
        } 
      };
      utils.nestedValue('test.testing.pow', obj, function (val) {
        assert.equal(val, 'wtf');
        done();
      });
    });

  });  

});