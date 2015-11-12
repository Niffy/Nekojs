var assert = require('assert');
var sinon  = require('sinon');
var Router = require('../lib/router');
var Route = require('../lib/router/route');

describe('route', function () {

  it('should be callable', function () {
    assert.doesNotThrow(function () {
      var fn = function () {};
      var route = new Route('/home', fn, '*');
    });
  });

  describe('checkMethod', function () {
    var route;

    beforeEach(function () {
      var fn = function () {};
      route = new Route('/home', fn, 'get');
    });

    afterEach(function () {
      route = null;
    });

    it('should hve a function to check the method', function () {
      assert.equal('function', typeof route.checkMethod);
    });

    it('should compare the route.method with the given method', function () {
      var method1 = 'GET';
      var method2 = 'POST';
      assert.equal(route.checkMethod(method1), true);
      assert.equal(route.checkMethod(method2), false);
    });

  });

  describe('handle', function () {
    var route, done;

    beforeEach(function () {
      var fn = function () {};
      var done = function (req, res) {};
      route = new Route('/home', fn, 'get');
    });

    afterEach(function () {
      route = null;
      done = null;
    });

    it('should hve a function to dispatch the route', function () {
      assert.equal('function', typeof route.handle);
    });

  });  

});

describe('router', function(){

  it('should be callable', function () {
    assert.doesNotThrow(function () {
      var router = new Router();
    });
  });

  it('should contain a list of handlers', function () {
    var router = new Router();
    assert(Object.prototype.toString.call(router.handlers), '[object Array]');
  });

  describe('router.use', function () {
    var router;

    beforeEach(function () {
      router = new Router();
    });

    afterEach(function () {
      router = null;
    });

    it('should have a method to add middleware', function () {
      assert.equal(typeof router.use, 'function');
    });

    it('should be able to add a bit of middleware for all routes', function () {
      var fn = function (req, res, next) {};
      router.use(fn);
      assert.equal(router.handlers[0].fn, fn);
    });

    it('should be able to add a bit of middleware for specific routes', function () {
      var fn = function (req, res, next) {};
      router.use('/', fn);
      assert.equal(router.handlers[0].fn, fn);
    });

    it('Must throw if not given a callback method', function () {
      assert.throws(function () {
        router.use('/whooooop');
      });
    });

  });

  describe('router.create', function () {
    var router;

    beforeEach(function () {
      router = new Router();
    });

    afterEach(function () {
      router = null;
    });

    it('should have a method to add a route handler', function () {
      assert.equal(typeof router.create, 'function');
    });

    it('should throw if the route is not a string', function () {
      assert.throws(function () {
        router.create(function() {}, function() {}, 'get');
      });
    });    

    it('should be able to add a route handler', function () {
      var fn = function (req, res) {};
      router.create('/', fn, 'get');
      var handler = router.handlers[0];
      assert.equal(handler.fn, fn);
      assert.equal(handler.method, 'get');
    });

    it('should be able to remove the trailing slash', function () {
      var fn = function (req, res) {};
      router.create('/pow/', fn);
      var handler = router.handlers[0];
      assert.equal(handler.route, '/pow');
    });

    it('should be able to add to set the method type', function () {
      var fn = function (req, res) {};
      router.create('/', fn, 'post');
      var handler = router.handlers[0];
      assert.equal(handler.fn, fn);
      assert.equal(handler.method, 'post');
    });    
  });  

  describe('router.handle', function () {
    var router, req, res;

    beforeEach(function () {
      router = new Router();
      req = { method: 'get' };
      res = { };
    });

    it('Should run the given 404 handler if no route matched', function (done) {
      var spy = sinon.spy();
      router.handle(req, res, spy);
      // Need to delay the check to give it time to execute the spy
      setTimeout(function () {
        assert.equal(spy.called, true);
        done();
      }, 25);
    });

    it('Should run middleware on a route', function (done) {
      var index = 0;
      var method = function (req, res, next) {
        index++;
        next();
      };

      router.use(method);
      router.use(method);      

      router.handle(req, res, function () {
        assert.equal(index, 2);
        done();
      });
    });

    it('should not execute the next middleware if the headers sent flag is true', function (done) {
      var index = 0;

      var sendMessage = function (req, res, next) {
        res.headersSent = true;
        index++;
        next();
      };

      var extraMethod = function (req, res, next) {
        index++;
        next();
      };

      var annotherMethod = function (req, res, next) {
        index++;
        next();
      };

      router.use(sendMessage);
      router.use(extraMethod);
      router.use(annotherMethod);

      router.handle(req, res, function () {
        assert.equal(index, 1);
        done();
      });

    });

    it('should be able to match all routes', function (done) {
      var index = 0;

      var sendMessage = function (req, res, next) {
        index++;
        next();
      };

      router.use('*', sendMessage);

      req.url = '/api/users/123';

      router.handle(req, res, function () {
        assert.equal(index, 1);
        done();
      });
    });

    it('should be able to match a specific route', function (done) {
      var index = 0;

      var sendMessage = function (req, res, next) {
        index++;
        next();
      };

      router.use('*', sendMessage);
      router.use('/api/users/:id/profile', sendMessage);
      router.use('/api/users/:id', sendMessage);

      req.url = '/api/users/123';

      router.handle(req, res, function () {
        assert.equal(index, 2);
        done();
      });
    });    

    it('should be able to handle a slash', function (done) {
      var index = 0;

      var sendMessage = function (req, res, next) {
        index++;
        next();
      };

      router.use('*', sendMessage);
      router.use('/api', sendMessage);
      router.use('/', sendMessage);

      req.url = '/';

      router.handle(req, res, function () {
        assert.equal(index, 2);
        done();
      });
    });  

    it('should not execute the next middleware if the url does not match', function (done) {
      var index = 0;

      var sendMessage = function (req, res, next) {
        index++;
        next();
      };

      router.use('/api/users/:id/profile', sendMessage);
      router.use('/api/users/:id', sendMessage);
      router.use('/api/users', sendMessage);
      router.use('*', sendMessage);

      req.url = '/api/users/123';

      router.handle(req, res, function () {
        assert.equal(index, 2);
        done();
      });

    });   

    it('should not execute the next middleware if the method does not match', function (done) {
      var index = 0;

      var sendMessage = function (req, res, next) {
        index++;
        next();
      };

      router.create('/api/users/:id/profile', sendMessage, '*');
      router.create('/api/users/:id', sendMessage, '*');
      router.create('/api/users', sendMessage, '*');
      router.create('*', sendMessage, 'get');
      router.create('*', sendMessage, 'post');

      req.url = '/api/users/123';

      router.handle(req, res, function () {
        assert.equal(index, 2);
        done();
      });

    });  

    it('should be able to handle passing an error - it will skip other middleware untill it finds an error handler or call done', 
      function (done) {
        var index = 0;
        var up = new Error('omg it broke');
        var err;

        var sendError = function (req, res, next) {
          index++;
          next(up);
        };

        var sendMessage = function (req, res, next) {
          index++;
          next();
        };      

        var handleIt = function (e, req, res, next) {
          err = e;
          index++;
          next();
        };

        router.use('*', sendError);
        router.use('*', sendMessage);
        router.use('*', handleIt);

        req.url = '/api/users/123';

        router.handle(req, res, function () {
          assert.equal(err.message, 'omg it broke');
          assert.equal(index, 2);
          done();
        });
      }
    );          

    it('should handle middleware throwing an error', function () {
      var up = new Error('omg it broke');

      var sendError = function (req, res, next) {
        throw up // LOL
      };

      var sendMessage = function (req, res, next) {
        index++;
        next();
      }; 

      router.use('*', sendError);
      router.use('*', sendMessage);

      router.handle(req, res, function (err) {
        assert.equal(err.message, 'omg it broke');
        assert.equal(index, 1);
        done();
      });
    });

  });

  describe('route.params', function () {

    var router, req, res;

    beforeEach(function () {
      router = new Router();
      req = { method: 'get' };
      res = { };      
    });

    afterEach(function () {
      router = null;
      req = null;
      res = null;
    });

    it('should set a params object onto the req object', function (done) {

      var sendMessage = function (req, res, next) {
        next();
      }; 

      router.use('*', sendMessage);

      router.handle(req, res, function (err, req, res) {
        console.log(req.params);
        assert.equal(Object.prototype.toString.call(req.params), '[object Object]');
        done();
      });     
    });

  });

});