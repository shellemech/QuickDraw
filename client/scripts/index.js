$( document ).ready(function() {
	$('#btn_connect').attr('disabled', 'true');
	$('#txt_room').bind('input', function() {
		if ($(this).val().length > 0) {
			$("#btn_connect").removeAttr("disabled");
			$('#empty_msg').hide(800);
		} else {
			$("#btn_connect").attr("disabled", "true");        
		}
	});    
});

