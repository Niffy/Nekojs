var assert = require('assert')
var neko = require('..')
var request = require('supertest')

describe('req.query', function(){

  it('Should be able to read query string parameters', function (done) {
    var name, age;

    var fn = function (req, res, next) {
      name = req.query.name;
      age = req.query.age;
      next();
    };

    var app = new neko()
      .use(fn)
      .listen();

    request(app)
      .get('/home?name=bob&age=29')
      .expect(200, function (err, res) {  
        app.close();
        assert.equal(name, 'bob');
        assert.equal(age, 29);
        done();
      });
  });

  it('Should be able to read an array in query string parameters', function (done) {
    var result;

    var fn = function (req, res, next) {
      result = req.query.hobbies;
      next();
    };

    var app = new neko()
      .use(fn)
      .listen();

    request(app)
      .get('/home?hobbies=["coding","cycling", "gaming"]')
      .expect(200, function (err, res) {  
        app.close();
        assert.equal(Object.prototype.toString.call(result), '[object Array]');
        assert.equal(result.toString(), 'coding,cycling,gaming');
        done();
      });
  });

});