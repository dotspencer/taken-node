var keys = require('./keys.js');

exports.lookup = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  var word = req.query.word;
  if(word == null){
    res.send("{}");
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
        word + '.io',
        word + '.info' ],
    json: true
  };

  request(options, function(error, response, body){
    if (error) throw new Error(error);
    res.send(body);
  });
}
