//Configurations
var PORT = 3001;
var DEFAULT_PAGE = "/index.html";
var HOST = 'localhost';

//Setup
var express = require('express');
var app = express();
var http = require('http');
var helmet = require('helmet');
var bodyParser = require("body-parser");
var path = require("path");
app.use(helmet());
app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var options = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['htm', 'html', 'js', 'css', 'png', 'jpg'],
	index: DEFAULT_PAGE,
	root: __dirname + '/client/',
	maxAge: '1d',
	redirect: false,
	setHeaders: function (res, path, stat) {
		res.set('x-timestamp', Date.now())
	}
};

var server = http.createServer(app);
var io = require('socket.io')(server);

//Routes

app.post('/', function (req, res) {
	var room = req.body.txt_room;
	var cleanroom = room.replace(/[|&;$%@"<>()+,]/g, "");
        res.redirect('/draw.html?room=' + cleanroom);
});

//Start
exports.start = function () {
	server.listen(PORT, HOST, function() {
		console.log('server up and running at %s port', PORT);
	});

	exports.app = app;
	exports.server = server;
	exports.io = io;
};
