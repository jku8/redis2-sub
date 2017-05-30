//Load express module with `require` directive
var express = require('express');
var app = express();
var NRP = require('node-redis-pubsub');
var config = {
  port  : 6379  , // Port of your locally running Redis server
  scope : 'demo'  // Use a scope to prevent two NRPs from sharing messages
};
var nrp = new NRP(config);
var request = require('request');
var cheerio = require('cheerio');
var pry = require('pryjs');
// Using this url to just test data because main url has empty data
var test_url = 'http://www.imdb.com/title/tt1229340/';
var redis = require("redis");
var client = redis.createClient();

app.get('/', function (req, res) {
  res.send('Hello World');
});

nrp.on('say hello', function(data){
  getData(data.name);
});

function getData(urlName) {
  request(test_url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      var title;
      var json = { title : ""};
      var data;

      $('.title_wrapper').filter(function(){
        data = $(this);
        title = data.children().first().text();
        json.title = title;
      });

      client.set(urlName.toString(), json.title.toString(), redis.print);

      console.log(json);
    }
  });
}

//Launch listening server on port 8080
app.listen(9090, function () {
  console.log('App listening on port 9090!');
});