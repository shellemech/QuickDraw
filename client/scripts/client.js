//drawing functions
var ROOM = "0";
var COLOR = "#ff6600";
var RADIUS = 5;
var SHAPE = "circle";
var mapImg = new Image();

var socket, canvas, context, canvasback, contextback, canvaspin, contextpin;

function change_color(color)
{
	COLOR = color;
}

function change_radius(radius)
{
	RADIUS = radius;
	SHAPE = "circle";
}

function change_shape(shape)
{
	SHAPE = shape;
}

// Updates - room is given the data points to draw on to the canvas
function get_draw(draw_data)
{
	thisshape = draw_data["shape"];
	switch (thisshape) {
		case "circle":
			{
				draw_data["x"] = (draw_data["x"] / 1000.0) * canvas.width;
				draw_data["y"] = (draw_data["y"] / 1000.0) * canvas.height;

				context.beginPath();
				context.arc(draw_data["x"], draw_data["y"], draw_data["radius"], 0, 2 * Math.PI, false);
				context.fillStyle = draw_data["color"];
				context.fill();
			}
			break;
		case "eraser":
			{
				draw_data["x"] = (draw_data["x"] / 1000.0) * canvas.width;
				draw_data["y"] = (draw_data["y"] / 1000.0) * canvas.height;

				context.beginPath();
				context.arc(draw_data["x"], draw_data["y"], draw_data["radius"], 0, 2 * Math.PI, false);
				context.fillStyle = "rgba(0,0,0,1)";
				context.globalCompositeOperation = "destination-out";
				context.fill();
				context.globalCompositeOperation = "source-over";
			}
			break;
		case "pin":
			{
				draw_data["x"] = (draw_data["x"] / 1000.0) * canvaspin.width;
				draw_data["y"] = (draw_data["y"] / 1000.0) * canvaspin.height;
				var pinImg = new Image();
				pinImg.onload = function () {
					contextpin.drawImage(pinImg, draw_data["x"]-10, draw_data["y"]-27, 20, 32);
					setTimeout(function(){
						contextpin.drawImage(pinImg, draw_data["x"]-15, draw_data["y"]-40, 30, 48);
					}, 300);
					setTimeout(function(){
						var blankImg = contextpin.createImageData(30, 48);
						for (var i = blankImg.data.length; --i >= 0; )
						blankImg.data[i] = 0;
					contextpin.putImageData(blankImg, draw_data["x"]-15, draw_data["y"]-40);
					}, 3000);
				}
				pinImg.src = "/images/mappin.png";
			}
			break;
	}

	//mechs
	if (/^clan/.test(thisshape))
	{
		draw_data["x"] = (draw_data["x"] / 1000.0) * canvas.width;
		draw_data["y"] = (draw_data["y"] / 1000.0) * canvas.height;
		var mechImg = new Image();
		mechImg.onload = function () {
			context.drawImage(mechImg, draw_data["x"]-5, draw_data["y"]-20, 55, 70);
		}
		mechImg.src = "/pixelmechs/"+thisshape+".png";
	}
	if (/^is/.test(thisshape))
	{
		draw_data["x"] = (draw_data["x"] / 1000.0) * canvas.width;
		draw_data["y"] = (draw_data["y"] / 1000.0) * canvas.height;
		var mechImg = new Image();
		mechImg.onload = function () {
			context.drawImage(mechImg, draw_data["x"]-5, draw_data["y"]-20, 55, 70);
		}
		mechImg.src = "/pixelmechs/"+thisshape+".png";
	}


}


// Updates - room is given map to draw to canvasback, drowdown updated
function get_drawMap(map) {
	mapImg.src = map
		if (mapImg.src !="") {
			contextback.clearRect(0, 0, canvasback.width, canvasback.height);
			mapImg.onload = function() {
				contextback.drawImage(mapImg, 0, 0, 950, 950);
			}
			var mapPNG = /[^/]*$/.exec(mapImg.src)[0];
			$('#map_select').val(mapPNG);
		}
}


//
// First load - iterate over room data points and send to draw, pull out map and send to mapdraw
//
function get_room(room_data)
{
	room_data.forEach(function (e, i) {
		get_draw(e);
		try {
			if (e.indexOf("png") > -1) get_drawMap(e);
		}
		catch(err) {
			//console.log(err)
		}
	});
}

function get_clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function get_destroy() {
  console.log("destroy received")
	window.location.href = '/new';
}

//
// Check incoming message and run functions
//
function handle_message(msg)
{
	if ("room" in msg) {
		if (msg["room"] != ROOM) return;
	}
	else return;

	if (!("command" in msg)) return;

	if (msg["command"] == "draw") get_draw(msg["data"]);
	if (msg["command"] == "clear") get_clear();
  if (msg["command"] == "destroy") get_destroy();
	if (msg["command"] == "send_room") get_room(msg["data"]);
	if (msg["command"] == "send_map") get_drawMap(msg["mapURL"]);
}

//
// Functions to send clear or map or draw points out to room
//
function clear_room() {
	socket.emit("message", {
		"room": ROOM,
	"command": "clear"
	});
}

function destroy_room() {
	socket.emit("message", {
		"room": ROOM,
	"command": "destroy"
	});
}

function send_map(mapURL) {
	socket.emit("message", {
		"room": ROOM,
	"command": "map",
	"mapURL": mapURL
	});

}

var draw_enabled = false;
function mouse_paint(event)
{
	if (!draw_enabled) return;
	if (SHAPE=="eraser") RADIUS=15;

	var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;

	socket.emit("message", {
		"room": ROOM,
		"command": "draw",
		"data": {
			"shape": SHAPE,
		"x": 1000.0 * (x / rect.width),
		"y": 1000.0 * (y / rect.height),
		"radius": RADIUS,
		"color": COLOR
		},
	})
}

function mouse_down(event)
{
	draw_enabled = true;
	mouse_paint(event);
}

function mouse_move(event)
{
	mouse_paint(event);
}

function mouse_up(event)
{
	draw_enabled = false;
}

//
// INIT
//
function initialize() {
	ROOM = $('#roomid').val();
	canvasback = document.getElementById("canvasback");
	contextback = canvasback.getContext("2d");
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	canvaspin = document.getElementById("canvaspin");
	contextpin = canvaspin.getContext("2d");
	canvaspin.addEventListener("mousedown", mouse_down, false);
	canvaspin.addEventListener("mousemove", mouse_move, false);
	canvaspin.addEventListener("mouseup", mouse_up, false);

	socket = io();
	socket.on("servermessage", handle_message);

	socket.emit("message", {
		"room": ROOM,
		"command": "join"
	});
}

window.addEventListener("load", initialize);
