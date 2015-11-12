var assert = require('assert');
var cookies = require('../lib/middleware/cookies');

describe('cookies middleware', function(){

  it('Should just call next if there are no cookies', function (done) {
    
    var req = { headers: {} };
    var res = {};
    var jar = cookies('test', {});

    function result (req, res) {
      done();
    }

    jar(req, res, result);

  });

   it('Should throw if cookie header is not a string', function () {
    assert.throws(function () {
      var req = { 
        headers: {
          cookie: {}
        } 
      };
      var res = {};
      var jar = cookies('test');

      function result () {}

      jar(req, res, result);
    });

  });  


   it('Should just call next if the cookies are already set', function (done) {
    
    var req = { 
      headers: {
        cookie: 'name=Jon; age=29'
      } 
    };
    var res = {};
    var jar = cookies('test');

    function result (req, res) {
      done();
    }

    jar(req, res, function () {
      jar(req, res, function () {
        result(req, res);
      });
    });

  });    

   it('Should be able to parse cookies', function (done) {
    
    var req = { 
      headers: {
        cookie: 'name=Jon; age=29'
      } 
    };
    var res = {};
    var jar = cookies('test');

    function result (req, res) {
      assert.equal(req.cookies.name, 'Jon');
      done();
    }

    jar(req, res, function () {
      result(req, res);
    });

  }); 

   it('Should handle quotes', function (done) {
    
    var req = { 
      headers: {
        cookie: 'name="Jon"; age=29'
      } 
    };
    var res = {};
    var jar = cookies('test');

    function result (req, res) {
      assert.equal(req.cookies.name, 'Jon');
      done();
    }

    jar(req, res, function () {
      result(req, res);
    });

  }); 

   it('Should handle whitespace', function (done) {
    
    var req = { 
      headers: {
        cookie: 'name="Jon"; age = 29'
      } 
    };
    var res = {};
    var jar = cookies('test');

    function result (req, res) {
      assert.equal(req.cookies.name, 'Jon');
      done();
    }

    jar(req, res, function () {
      result(req, res);
    });

  });      

   it('Should handle duplicates', function (done) {
    
    var req = { 
      headers: {
        cookie: 'name="Jon"; age=29; name="Bob"'
      } 
    };
    var res = {};
    var jar = cookies('test');

    function result (req, res) {
      assert.equal(req.cookies.name, 'Jon');
      done();
    }

    jar(req, res, function () {
      result(req, res);
    });

  });

   it('Should handle invalid cookie pair', function (done) {
    
    var req = { 
      headers: {
        cookie: 'name="Jon"; age=29; name="Bob"; test:2; email=test@test.com'
      } 
    };
    var res = {};
    var jar = cookies('test');

    function result (req, res) {
      assert.equal(req.cookies.name, 'Jon');
      assert.equal(req.cookies.email, 'test@test.com');
      done();
    }

    jar(req, res, function () {
      result(req, res);
    });

  });   

});