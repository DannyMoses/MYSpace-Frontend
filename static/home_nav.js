console.log('Nav functions loaded');

$(document).ready(function() {
	// Button Binding
	$('#nav_login').bind('click', function(){
		$('#login_div').show();
		$('#register_div').hide();
		$('#verify_div').hide();
		$('#additem_div').hide();
		$('#getitem_div').hide();
		$('#search_div').hide();

		$('#message').hide();
	});

	$('#nav_register').bind('click', function(){
		$('#login_div').hide();
		$('#register_div').show();
		$('#verify_div').hide();
		$('#additem_div').hide();
		$('#getitem_div').hide();
		$('#search_div').hide();

		$('#message').hide();
	});

	$('#nav_verify').bind('click', function(){
		$('#login_div').hide();
		$('#register_div').hide();
		$('#verify_div').show();
		$('#additem_div').hide();
		$('#getitem_div').hide();
		$('#search_div').hide();

		$('#message').hide();
	});

	$('#nav_additem').bind('click', function(){
		$('#login_div').hide();
		$('#register_div').hide();
		$('#verify_div').hide();
		$('#additem_div').show();
		$('#getitem_div').hide();
		$('#search_div').hide();

		$('#message').hide();
	});

	$('#nav_getitem').bind('click', function(){
		$('#login_div').hide();
		$('#register_div').hide();
		$('#verify_div').hide();
		$('#additem_div').hide();
		$('#getitem_div').show();
		$('#search_div').hide();

		$('#message').hide();
	});

	$('#nav_search').bind('click', function(){
		$('#login_div').hide();
		$('#register_div').hide();
		$('#verify_div').hide();
		$('#additem_div').hide();
		$('#getitem_div').hide();
		$('#search_div').show();

		$('#message').hide();
	});
});

