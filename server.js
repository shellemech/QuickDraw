//Web server
var web = require("./server/web.js");
web.start();

//Main logic
var socket;
var roomData = [];
var roomObj = {};

//Add roomObj and initialise empty roomData array if new room
//Return the room data array for given room
function getRoom(room)
{
    if (!(room in roomObj))
    {
        roomObj[room] = roomData.length;
        roomData.push([]);
        console.log("===> Room " + room + " created on " + new Date());
        console.log("Current rooms:" );
        console.log(roomObj);
    }
    return roomData[roomObj[room]];
}

//Get room data array
//Add data object (if not the pin type) to the array
//Broadcast object
function draw(msg)
{
    var thisData = getRoom(msg["room"]);
    if (msg["data"]['shape'] != "pin")
    {
      thisData.push(msg["data"]);
    }
    web.io.emit("servermessage", {
        "room": msg["room"],
        "command": "draw",
        "data": msg["data"]
    });
}

//Get room data array
//Add map to the array
//Broadcast map
function map(msg)
{
    var thisData = getRoom(msg["room"]);
    thisData.push(msg["mapURL"]);
    web.io.emit("servermessage", {
        "room": msg["room"],
        "command": "send_map",
        "mapURL": msg["mapURL"]
    });
}

//Get room data array
//Remove each object
//Broadcast command
function clear(msg)
{
    var thisData = getRoom(msg["room"]);
    while (thisData.length) {
		  thisData.pop();
	  }
    web.io.emit("servermessage", {
        "room": msg["room"],
        "command": "clear"
    });
}

//Get room data array
//Remove each object
//Remove room
//Broadcast command
function destroy(msg)
{
    var thisData = getRoom(msg["room"]);
    while (thisData.length) {
		  thisData.pop();
	  }
    delete roomObj[msg["room"]];
    web.io.emit("servermessage", {
        "room": msg["room"],
        "command": "destroy"
    });
}

//Client wants to see the room
//Broadcast roomData
function join(msg)
{
    console.log("----> Client joining " + msg["room"]);
    web.io.emit("servermessage", {
        "room": msg["room"],
        "command": "send_room",
        "data": getRoom(msg["room"])
    });
}


//Deal with incoming updates
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
        if (msg["command"] == "destroy") destroy(msg);
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
