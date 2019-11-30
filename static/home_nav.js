console.log('Nav functions loaded');

$(document).ready(function() {
	// Button Binding
	$('#nav_login').bind('click', function(){
		//Hide current form, show new form
		$('.form_div').hide();
		$('#login_div').show();

		// Hide message
		$('#message').hide();

		// Hide/clear item-specific commands
		$('#like_btn').hide();
		$('#delete_btn').hide();
		$('#current_msg').text("");
	});

	$('#nav_register').bind('click', function(){
		$('.form_div').hide();
		$('#register_div').show();

		$('#message').hide();

		$('#like_btn').hide();
		$('#delete_btn').hide();
		$('#current_msg').text("");
	});

	$('#nav_verify').bind('click', function(){
		$('.form_div').hide();
		$('#verify_div').show();

		$('#message').hide();

		$('#like_btn').hide();
		$('#delete_btn').hide();
		$('#current_msg').text("");
	});

	$('#nav_profile').bind('click', function(){
		$('.form_div').hide();
		$('#profile_div').show();

		$('#message').hide();

		$('#like_btn').hide();
		$('#delete_btn').hide();
		$('#current_msg').text("");
	});

	$('#nav_additem').bind('click', function(){
		$('.form_div').hide();
		$('#additem_div').show();

		$('#message').hide();

		$('#like_btn').hide();
		$('#delete_btn').hide();
		$('#current_msg').text("");
	});

	$('#nav_getitem').bind('click', function(){
		$('.form_div').hide();
		$('#getitem_div').show();

		$('#message').hide();

		$('#like_btn').hide();
		$('#delete_btn').hide();
		$('#current_msg').text("");
	});

	$('#nav_search').bind('click', function(){
		$('.form_div').hide();
		$('#search_div').show();

		$('#message').hide();

		$('#like_btn').hide();
		$('#delete_btn').hide();
		$('#current_msg').text("");
	});

});

