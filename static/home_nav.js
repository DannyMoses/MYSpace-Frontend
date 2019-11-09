console.log('Nav functions loaded');

$(document).ready(function() {
	// Button Binding
	$('#nav_login').bind('click', function(){
		$('.form_div').hide();
		$('#login_div').show();

		$('#message').hide();
		$('#delete_btn').hide();
	});

	$('#nav_register').bind('click', function(){
		$('.form_div').hide();
		$('#register_div').show();

		$('#message').hide();
		$('#delete_btn').hide();
	});

	$('#nav_verify').bind('click', function(){
		$('.form_div').hide();
		$('#verify_div').show();

		$('#message').hide();
		$('#delete_btn').hide();
	});

	$('#nav_profile').bind('click', function(){
		$('.form_div').hide();
		$('#profile_div').show();

		$('#message').hide();
		$('#delete_btn').hide();
	});

	$('#nav_additem').bind('click', function(){
		$('.form_div').hide();
		$('#additem_div').show();

		$('#message').hide();
		$('#delete_btn').hide();
	});

	$('#nav_getitem').bind('click', function(){
		$('.form_div').hide();
		$('#getitem_div').show();

		$('#message').hide();
	});

	$('#nav_search').bind('click', function(){
		$('.form_div').hide();
		$('#search_div').show();

		$('#message').hide();
		$('#delete_btn').hide();
	});

});

