var assert = require('assert')
var neko = require('..')
var request = require('supertest')

describe('init middleware', function(){

  it('Should create a locals object', function (done) {
    var locals;

    var fn = function (req, res, next) {
      res.locals.name = 'bob';
      locals = res.locals;
      next();
    };

    var app = new neko()
      .use(fn)
      .listen();

    request(app)
      .get('/home')
      .expect(200, function (err, res) {  
        app.close();
        assert.equal(locals.name, 'bob');
        done();
      });
  });

  it('Should set the X-Powered-By header if enabled', function (done) {
    var app = new neko()
      .enable('x-powered-by')
      .listen();

    request(app)
      .get('/home')
      .expect(200, function (err, res) {  
        app.close();
        assert.equal(res.headers['x-powered-by'], 'Nekojs');
        done();
      });
  });  

  it('Should not set the X-Powered-By header if disabled', function (done) {
    var app = new neko()
      .disable('x-powered-by')
      .listen();

    request(app)
      .get('/home')
      .expect(200, function (err, res) {  
        app.close();
        assert.equal(res.headers['x-powered-by'], undefined);
        done();
      });
  }); 

});