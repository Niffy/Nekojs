var assert = require('assert');
var mime = require('../lib/mime');

describe('mime types', function(){

  it('should export a list of file extensions and their mime types', function () {
    assert.equal(mime.types.ico, 'image/x-icon');
  });

  it('should have a function to look up a mime type from file extension', function () {
    assert.equal(mime.find('html'), 'text/html');
  });

  it('should return text/plain if no mim type was found', function () {
    assert.equal(mime.find('omgwtffile'), 'text/plain');
  })

});