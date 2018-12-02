$( document ).ready(function() {
	$('#empty_msg').hide();
	$('#btn_connect').click(function(){
		if (!$('#txt_room').val()) {
			$('#empty_msg').show(800);
		}
		else btn_connect_pressed();
	});
});

function btn_connect_pressed() {
	var txt_room = document.getElementById("txt_room");
	var room_name = txt_room.value;
	window.location.href = "/draw.html?room=" + room_name;
}


