var assert = require('assert')
var neko = require('..')
var request = require('supertest')

describe('request', function(){

  describe('req.get', function () {

    it('Should be able to get the "referer" with by passing "referer"', function (done) {
      var referer;

      var fn = function (req, res, next) {
        referer = req.get("referer");
        next();
      };

      var app = new neko().use(fn).listen();
      
      request(app)
        .get('/')
        .set('referer', 'pow')
        .expect(404, function () {  
          app.close();
          assert.equal(referer, 'pow');
          done();
        });
    });

    it('Should be able to get the "referer" with by passing "referrer"', function (done) {
      var referer;

      var fn = function (req, res, next) {
        referer = req.get("referrer");
        next();
      };

      var app = new neko().use(fn).listen();
      
      request(app)
        .get('/')
        .set('referrer', 'pow')
        .expect(404, function () {  
          app.close();
          assert.equal(referer, 'pow');
          done();
        });
    }); 

    it('Should also deal with other headers', function (done) {
      var header;

      var fn = function (req, res, next) {
        header = req.get("Accept");
        next();
      };

      var app = new neko().use(fn).listen();
      
      request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect(404, function () {  
          app.close();
          assert.equal(header, 'application/json');
          done();
        });
    }); 

  });

});