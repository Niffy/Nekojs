var assert = require('assert')
var neko = require('..')
var request = require('supertest')

describe('app', function(){

  it('should use a default environment if not set', function () {
    delete process.env.NODE_ENV;
    var app = new neko();
    assert.equal(app.settings.env, 'development');
    process.env.NODE_ENV = 'test';
  });

  it('should enable the view cahce in production environment', function () {
    process.env.NODE_ENV = 'production';
    var app = new neko();
    assert.equal(app.settings['view cache'], true);
    process.env.NODE_ENV = 'test';
  });  

  it('should inherit from event emitter', function(done){
    var app = new neko();
    app.on('foo', done);
    app.emit('foo');
  });

  it('should have a method for handling requests', function () {
    var app = new neko();
    assert.equal(typeof app.handler, 'function');
  });

  it('should have a method to start the app', function () {
    var app = new neko();
    assert.equal(typeof app.listen, 'function');
  });

  it('Should 404 without routes', function (done) {
    var app = new neko().listen();
    request(app)
      .get('/')
      .expect(404, function () {  
        app.close();
        done();
      });
  });

  it('Should not run the 404 the last middleware has called send and next', function (done) {
    var fn = function (req, res, next) {
      res.send();
      next();
    };

    var app = new neko().use(fn).listen();
    
    request(app)
      .get('/pow')
      .expect(200, function () {  
        app.close();
        done();
      });
  });  

  it('Should run a callback when starting and pass along the port number', function (done) {
    var fn = function (port) { console.log(port); };
    var app = new neko().listen(fn);
    request(app)
      .get('/')
      .expect(404, function () {
        app.close();
        done();
      });
  });  

  describe('app.settings', function () {
    it('should be able to set a setting', function () {
      var app = new neko();
      assert.notEqual(typeof app.settings.pow, 'string');
      app.set('pow', 'test');
      assert.equal(app.settings.pow, 'test');
    });

    it('should be able to return a setting if the value is not passed', function () {
      var app = new neko();
      app.set('test', '123');
      assert.equal(app.set('test'), '123');
    });

    it('should be able to check if a setting is enabled', function () {
      var app = new neko();
      assert.equal(app.enabled('x-powered-by'), true);
    });

    it('should be able to check if a setting is disabled', function () {
      var app = new neko();
      assert.equal(app.disabled('x-powered-by'), false);
    });

    it('should be able to enable a setting', function () {
      var app = new neko();
      app.enable('ninja-power');
      assert.equal(app.enabled('ninja-power'), true);
    });

    it('should be able to disable a setting', function () {
      var app = new neko();
      
      app.enable('fail-sauce');
      assert.equal(app.disabled('fail-sauce'), false);

      app.disable('fail-sauce');
      assert.equal(app.disabled('fail-sauce'), true);
    });    
  });

  describe('app.get', function () {
    var app;

    beforeEach(function () {
      app = new neko();
    });

    afterEach(function () {
      app = null;
    });

    it('should be a function', function () {
      assert.equal('function', typeof app.get);
    });

    it('should be able to set a GET route', function () {
      app.get('/ninja', function (req, res) {});
      var handler = app.router.handlers[2];
      assert.equal('/ninja', handler.route);    
    });

  });

  describe('app.put', function () {
    var app;

    beforeEach(function () {
      app = new neko();
    });

    afterEach(function () {
      app = null;
    });

    it('should be a function', function () {
      assert.equal('function', typeof app.put);
    });

    it('should be able to set a PUT route', function () {
      app.put('/ninja', function (req, res) {});
      var handler = app.router.handlers[2];
      assert.equal('/ninja', handler.route);    
    });

  });

  describe('app.post', function () {
    var app;

    beforeEach(function () {
      app = new neko();
    });

    afterEach(function () {
      app = null;
    });

    it('should be a function', function () {
      assert.equal('function', typeof app.post);
    });

    it('should be able to set a POST route', function () {
      app.post('/ninja', function (req, res) {});
      var handler = app.router.handlers[2];
      assert.equal('/ninja', handler.route);    
    });

  });  

  describe('app.delete', function () {
    var app;

    beforeEach(function () {
      app = new neko();
    });

    afterEach(function () {
      app = null;
    });

    it('should be a function', function () {
      assert.equal('function', typeof app.del);
    });

    it('should be able to set a DELETE route', function () {
      app.del('/ninja', function (req, res) {});
      var handler = app.router.handlers[2];
      assert.equal('/ninja', handler.route);    
    });

  });  

});