//Configurations
var PORT = 3001;
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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'))

var options = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['htm', 'html', 'js', 'css', 'png', 'jpg'],
	maxAge: '1d',
	redirect: false,
	setHeaders: function (res, path, stat) {
	res.set('x-timestamp', Date.now())
	}
};
var regx = /[!@£#€$%^&*(){}"'|~;:]/g
var server = http.createServer(app);
var io = require('socket.io')(server);

//Routes

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/new', function(req, res) {
    res.render('index');
});

//New room
app.post('/new', function (req, res, next) {
	  var roomid = req.body.txt_room;
	  var cleanroom = roomid.replace(regx, "");
    req.room = cleanroom;
    res.redirect('/draw/'+cleanroom);
});

//Existing room
app.get('/draw/:roomid', function (req, res) {
	var roomid = req.params.roomid;
	var cleanroom = roomid.replace(regx, "");
	if (roomid != cleanroom) {
		res.redirect('/draw/'+cleanroom);
	}
	else {
	  res.render('draw', {room:cleanroom});
	}
});

//Start
exports.start = function () {
	server.listen(PORT, HOST, function() {
		console.log('Server up and running at %s port', PORT);
	});

	exports.app = app;
	exports.server = server;
	exports.io = io;
};
