'use strict';

var fs = require('fs'),
    express = require('express'),
    https = require('https');

var https_options = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost-cert.pem')
};

var PORT = 8443,
    HOST = 'localhost';

var app = express();

// set static routes
app.use('/', express.static(__dirname + '/src'));
app.use('/vendor', express.static(__dirname + '/bower_components'));

var server = https.createServer(https_options, app)
                  .listen(PORT, HOST);

console.log('+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+');
console.log('HTTPS Server listening on %s:%s', HOST, PORT);
console.log('+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+');
