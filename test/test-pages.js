var expect  = require('chai').expect;
var request = require('request');
var server = require('../index.js');

describe('server response', function () {
  before(function () {
    server.listen(8080);
  });

  after(function () {
    server.close();
  });
});

it('Main page content', function(done) {
  request('http://localhost:9090' , function(error, response, body) {
    expect(body).to.equal('Hello World');
    done();
  });
});