//Web server
var web = require("./server/web.js");
web.start();

//Main logic
var socket;
var rooms = [];
var roomIds = {};

// get entire room including data points and map
function getRoom(roomId)
{	
    if (!(roomId in roomIds))
    {
        roomIds[roomId] = rooms.length;
        rooms.push([]);
    } 
    return rooms[roomIds[roomId]];
}

//send room back to client
function sendRoom(roomId)
{ 
    web.io.emit("servermessage", {
        "room": roomId,
        "command": "send_room",
        "data": getRoom(roomId)
    });
}

//add data points (if not the pin type) to the room array
function draw(msg)
{
    var room = getRoom(msg["room"]);
    if (msg["data"]['shape'] != "pin") room.push(msg["data"]);
    web.io.emit("servermessage", {
        "room": msg["room"],
        "command": "draw",
        "data": msg["data"]
    });
}

//add map to room array
function map(msg)
{
    var room = getRoom(msg["room"]);
    room.push(msg["mapURL"]);
    web.io.emit("servermessage", {
        "room": msg["room"],
        "command": "send_map",
        "mapURL": msg["mapURL"]
    });
}

//clear room data array
function clear(msg)
{
    var room = getRoom(msg["room"]);
    while (room.length) {
		room.pop();
	}
    web.io.emit("servermessage", {
        "room": msg["room"],
        "command": "clear"
    });
}

function join(msg)
{
    console.log("Client wants to join " + msg["room"]);
    sendRoom(msg["room"]);
}

function handleMessage(msg)
{
    try
    {
        //check if message is valid
        if (!("room" in msg &&
            "command" in msg))
            return;

        if (msg["command"] == "draw") draw(msg);
        if (msg["command"] == "join") join(msg);
        if (msg["command"] == "clear") clear(msg);
		if (msg["command"] == "map") map(msg);
    }
    catch (err)
    {
        console.log(err);
    }
}

web.io.on('connection', function (socket) {
    console.log((new Date()) + ' Connection established.');
    socket.on("message", handleMessage);
});
