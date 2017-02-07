var express = require('express');
var domains = require('./helpers/domains.js');
var app = express();

app.use('/', express.static('public'));

app.get('/api', function(req, res) {
  domains.lookup(req, res);
});

app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}`)
})
