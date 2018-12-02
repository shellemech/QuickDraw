//Configurations
var PORT = 3001;
var DEFAULT_PAGE = "/index.html";
var HOST = 'localhost';

//Setup
var express = require('express');
var app = express();
var http = require('http');

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

var server = http.createServer(app);
var io = require('socket.io')(server);

exports.start = function () {
    //Start listening
    server.listen(PORT, HOST, function() {
  	console.log('server up and running at %s port', PORT);
	});

    exports.app = app;
    exports.server = server;
    exports.io = io;
};
