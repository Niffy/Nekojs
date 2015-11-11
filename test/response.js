var assert = require('assert')
var path = require('path')
var neko = require('..')
var request = require('supertest')

describe('response', function(){

  describe('res.send', function () {

    it('Should be able to send a response', function (done) {
      var header;

      var fn1 = function (req, res, next) {
        res.send('hello world');
      };   

      var app = new neko().use(fn1).listen();
      
      request(app)
        .get('/')
        .expect(200, function (err, res) {  
          app.close();
          assert.equal(res.text, 'hello world');
          done();
        });
    }); 

  });

  describe('res.set', function () {    

    it('Should be able to set a header', function (done) {
      var header;

      var fn1 = function (req, res, next) {
        res.set("Accept", 'application/json');
        res.send();
      };   

      var app = new neko().use(fn1).listen();
      
      request(app)
        .get('/')
        .expect('Accept', 'application/json')
        .expect(404, function () {  
          app.close();
          done();
        });
    }); 

  });

  describe('res.status', function () {

    it('Should be able to set a status code', function (done) {
      var header;

      var fn1 = function (req, res, next) {
        res.status(500);
        res.send();
      };   

      var app = new neko().use(fn1).listen();
      
      request(app)
        .get('/')
        .expect(500, function () {  
          app.close();
          done();
        });
    }); 

  });  

  describe('res.type', function () {

    it('Should be able to set the content type', function (done) {
      var header;

      var fn1 = function (req, res, next) {
        res.type('html');
        res.send();
      };   

      var app = new neko().use(fn1).listen();
      
      request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(500, function () {  
          app.close();
          done();
        });
    }); 

    it('Should be able to set the content type with a / in the name', function (done) {
      var header;

      var fn1 = function (req, res, next) {
        res.type('text/html');
        res.send();
      };   

      var app = new neko().use(fn1).listen();
      
      request(app)
        .get('/')
        .expect('Content-Type', 'text/html')
        .expect(500, function () {  
          app.close();
          done();
        });
    });     

  });  

  describe('res.json', function () {

    it('Should be able to send a json response', function (done) {
      var header;

      var fn1 = function (req, res, next) {
        res.json({
          message: 'hello world'
        });
      };   

      var app = new neko().use(fn1).listen();
      
      request(app)
        .get('/')
        .expect('Content-Type', 'application/json')
        .expect(200, function (er, res) {  
          assert.equal(res.body.status, 'success')
          assert.equal(res.body.data.message, 'hello world');
          app.close();
          done();
        });
    }); 

    it('Should be able to handle and error', function (done) {
      var header;

      var fn1 = function (req, res, next) {
        res.json(new Error('omg it broke'));
      };   

      var app = new neko().use(fn1).listen();
      
      request(app)
        .get('/')
        .expect('Content-Type', 'application/json')
        .expect(500, function (er, res) {  
          assert.equal(res.body.status, 'error')
          assert.equal(res.body.meta.message, 'omg it broke');
          app.close();
          done();
        });
    }); 


  });    

  describe('res.render', function () {

    it('Should be able to render a template', function (done) {
      var header;

      var fn1 = function (req, res, next) {
        res.render('home');
      };   

      var app = new neko()
        .set('view path', path.join(__dirname, 'support/views'))
        .set('view ext', 'html')
        .use(fn1)
        .listen();
      
      request(app)
        .get('/')
        .expect(200, function (err, res) {  
          app.close();
          var contains = /This is a test/.test(res.text);
          assert.equal(contains, true);
          done();
        });
    });


    it('Should be able to render a template and merge locals with extra properties', function (done) {
      var header;

      var fn1 = function (req, res, next) {

        res.locals.title = 'test';

        res.render('vars', {
          heading: 'pow'
        });
      };   

      var app = new neko()
        .set('view path', path.join(__dirname, 'support/views'))
        .set('view ext', 'html')
        .use(fn1)
        .listen();
      
      request(app)
        .get('/')
        .expect(200, function () {  
          app.close();
          done();
        });
    });     

    it('should send an error response to say the view path is not set', function (done) {
      var header;

      var fn1 = function (req, res, next) {
        res.render('home');
      };   

      var app = new neko()
        .set('view ext', 'html')
        .use(fn1)
        .listen();
      
      request(app)
        .get('/')
        .expect(500, function (err, res) {  
          app.close();
          assert.equal(res.text, 'Templates not configured set: view path');
          done();
        });
    }); 

    it('should send an error response to say the view ext is not set', function (done) {
      var header;

      var fn1 = function (req, res, next) {
        res.render('home');
      };   

      var app = new neko()
        .set('view path', path.join(__dirname, 'support/views'))
        .use(fn1)
        .listen();
      
      request(app)
        .get('/')
        .expect(500, function (err, res) {  
          app.close();
          assert.equal(res.text, 'Templates not configured set: view ext');
          done();
        });
    });   

    it('should send an error response if the template is broken', function (done) {
      var header;

      var fn1 = function (req, res, next) {
        res.render('broken');
      };   

      var app = new neko()
        .set('view path', path.join(__dirname, 'support/views'))
        .set('view ext', 'html')
        .use(fn1)
        .listen();
      
      request(app)
        .get('/')
        .expect(500, function (err, res) {  
          app.close();
          assert.equal(res.text, 'Template Error: omg is not defined');
          done();
        });
    });             

  });  

});