var assert = require('assert')
var template = require('../lib/templates/template')
var templates = require('../lib/templates')
var path = require('path');

describe('templates', function(){

  it('Should be callable', function () {
    assert.doesNotThrow(function () {
      var tmpl = new template('', {});
    });
  });

  it('should have a method to render the template', function () {
    var tmpl = new template('<h1>Some Title</h1>', {});
    assert.equal(typeof tmpl.render, 'function');
  });

  it('should be able to render the template', function () {
    var tmpl = new template('<h1>Some Title</h1>', {});
    assert.equal(tmpl.render(), '<h1>Some Title</h1>');    
  });

  it('should be able to render a template with properties', function () {
    var tmpl = new template('<h1><% title %></h1>', { title: 'hello world' });
    assert.equal(tmpl.render(), '<h1>hello world</h1>');        
  });

  it('should be able to execute a function', function () {
    var tmpl = new template('<h1><% title() %></h1>', { 
      title: function () { return 'hello world'; } 
    });
    assert.equal(tmpl.render(), '<h1>hello world</h1>');   
  });

  it('should be able to define a variable', function () {
    var str = '<% var title = "hello world"; %>'
      + '<h1><% title %></h1>';

    var tmpl = new template(str, {});

    assert.equal(tmpl.render(), '<h1>hello world</h1>');
  });

  it('should be able to run a for loop', function () {
    
    var str = '<% for (var i = 0; i < arr.length; i++) { %>'
      + '<p><% arr[i] %></p>'
      + '<% } %>';

    var tmpl = new template(str, {
      arr: ['one', 'two', 'three'] 
    });

    assert.equal(tmpl.render(), '<p>one</p><p>two</p><p>three</p>');
  });

  it('should be able to run a for in loop', function () {
    
    var str = '<% for (var key in obj) { %>'
      + '<p><% obj[key] %></p>'
      + '<% } %>';

    var tmpl = new template(str, {
      obj: {
        one: 'pow',
        two: 'woot',
        three: 'ninja'
      }
    });

    assert.equal(tmpl.render(), '<p>pow</p><p>woot</p><p>ninja</p>');
  });

  it('should be able to run an if statement', function () {
    var str = '<% if (type === "ninja") { %>'
      + '<p><% type %></p>'
      + '<% } else { %>'
      + '<p>not a ninja</p>'
      + '<% } %>';

    var tmpl1 = new template(str, { type: 'ninja' });
    var tmpl2 = new template(str, { type: 'duck' });

    assert.equal(tmpl1.render(), '<p>ninja</p>');
    assert.equal(tmpl2.render(), '<p>not a ninja</p>');

  });

  it('should be able to run a switch statement', function () {
    var str = '<% for (var key in obj) { %>'
      + '<% switch (key) { %>'
      + '<% case "duck": %>'
      + '<p>flap flap</p>'
      + '<% break; %>'
      + '<% case "ninja": %>'
      + '<p>Yargh!</p>'
      + '<% break; %>'
      + '<% default: %>'
      + '<p>wtf</p>'
      + '<% } } %>';

    var tmpl = new template(str, {
      obj: {
        pow: false,
        duck: true,
        woot: true,
        ninja: true,
      }
    });

    assert.equal(tmpl.render(), '<p>wtf</p><p>flap flap</p><p>wtf</p><p>Yargh!</p>');

  });

  it('should have a method to render template files', function () {
    assert.equal(typeof templates.render, 'function');
  });

  it('should be able to render a template file', function (done) {
    var path = require('path').join(__dirname, 'support/views/vars.html');
    var data = {
      title: 'hello world',
      heading: 'greetings'
    };

    templates.render(path, data, function (err, content) {
      assert.equal(err, null);  
      done();
    });
  });

  it('should error if it cannot find the file', function () {
    var path = require('path').join(__dirname, 'support/views/pow.html');
    templates.render(path, {}, function (err, content) {
      assert.equal(true, err instanceof Error);
      done();
    });
  });

});