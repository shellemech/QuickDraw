//Configurations
var PORT = 80;
var DEFAULT_PAGE = "/index.html";
var HOST = 'localhost';
//var serverPort = 8443;

//Setup
var fs = require('fs');
var express = require('express');
var app = express();
//var app = require('express')();
//var https = require('https');

//var io = require('socket.io')(https);
//var key = fs.readFileSync('/etc/ssl/certs/mrbcleague_com.key');
//var key = fs.readFileSync('/etc/letsencrypt/live/mrbcleague.com/privkey.pem');
//var cert = fs.readFileSync('/etc/ssl/certs/maps.mrbcleague.com.crt')
//var cert = fs.readFileSync('/etc/letsencrypt/live/mrbcleague.com/cert.pem');
//var https_options = {
//    key: key,
//    cert: cert
//};
app.use(express.static('client'));

var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html', 'js', 'css', 'png', 'jpg'],
    index: DEFAULT_PAGE,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
};

//var server = https.createServer(https_options, app);
var server = http.createServer(options, app);
var io = require('socket.io')(server);

exports.start = function (port) {
    PORT = port;
    //Start listening
    server.listen(PORT,HOST, function() {
  	console.log('server up and running at %s port', port);
	});
    //var server = https.listen(PORT, function () {
        //var host = server.address().address
        //var port = server.address().port
        //console.log('Server listening at https://%s:%s', host, port)
    //});

    exports.app = app;
    exports.server = server;
    exports.io = io;
};
