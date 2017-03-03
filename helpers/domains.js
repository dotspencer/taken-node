var keys = require('./keys.js');
var request = require('request');

exports.lookup = (req, res) => {

  var word = req.query.word;
  if(word == null){
    res.json({});
    return;
  }

  var options = {
    method: 'POST',
    url: 'https://api.godaddy.com/v1/domains/available',
    qs: { checkType: 'FAST' },
    headers:
     { authorization: 'sso-key ' + keys.godaddy,
       'content-type': 'application/json' },
    body:
     [ word + '.com',
        word + '.org',
        word + '.net',
        word + '.co',
        word + '.io',
        word + '.info' ],
    json: true
  };

  request(options, function(error, response, body){
    if (error) throw new Error(error);
    res.json(body);
  });
}
