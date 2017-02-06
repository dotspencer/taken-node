var express = require('express');
var domains = require('./helpers/domains.js');
var app = express();

app.use('/', express.static('public'));

app.get('/api', function(req, res) {
  domains.lookup(req, res);
});

var server = app.listen('3000', function() {
  console.log("Server running on http://localhost:3000");
});
