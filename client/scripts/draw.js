$( document ).ready(function() {
	//Wipe data points and resend map
	function wipeRemap() {
		mapPNG=$('#map_select').find(":selected").val();
		mapURL="/maps/"+mapPNG;
		clear_room();
		send_map(mapURL);
	}

	$('#map_select').on('change', function() {
		wipeRemap();
	});

  //Left Buttons
	$('#wipe').click(function(){
		wipeRemap();
	});

	$('#new').click(function(){
		window.location.href = '/new';
	});

	$('#close').click(function(){
		destroy_room();
	});

	//button highlight
	$('.color_button').click(function(){
		$(".color_button.active").removeClass("active");
		$(this).addClass("active");
	});
	$('.tool_button').click(function(){
		$(".tool_button.active").removeClass("active");
		$(this).addClass("active");
		thisid = $(this).attr("id");
		// change cursor
		if (thisid == "pin") $('#canvaspin').css('cursor', 'url("/images/mappin-cur.png") 10 20, alias');
		else if (thisid == "era") $('#canvaspin').css('cursor', 'url("/images/eraser-cur.png") 5 20, not-allowed');
		else if (/^clan.*/.test(thisid)) $('#canvaspin').css('cursor', 'url("/pixelmechs/'+thisid+'.png") 5 20, crosshair');
		else if (/^is.*/.test(thisid)) $('#canvaspin').css('cursor', 'url("/pixelmechs/'+thisid+'.png") 5 20, crosshair');
		else if (/^rad.*\d/.test(thisid)) $('#canvaspin').css('cursor', 'url("/images/marker-cur.png") 5 20, crosshair');
	});

	//Select map text
	var tempcanvas = document.getElementById("canvasback");
	var ctx = tempcanvas.getContext("2d");
	ctx.font = "30px Wallpoet";
	ctx.fillStyle = "#d6d6d6";
	ctx.fillText("Select a map...",390,250);

	//tooltip
	$('[title!=""]').qtip({
		content: {
			attr: 'title'
		},
		style: { classes: 'qtip-tipsy' }
	});
});
