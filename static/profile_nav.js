console.log('Nav functions loaded');

$(document).ready(function() {
	// Button Binding
	$('#nav_back').bind('click', function(){
		window.history.back();
	});

	$('#nav_main').bind('click', function(){
		$('.page_div').hide();
		$('#profile_div').show();
		$('#message').hide();
	});

	$('#nav_posts').bind('click', function(){
		$('.page_div').hide();
		$('#posts_div').show();
		$('#message').hide();
	});

	$('#nav_followers').bind('click', function(){
		$('.page_div').hide();
		$('#followers_div').show();
		$('#message').hide();
	});

	$('#nav_following').bind('click', function(){
		$('.page_div').hide();
		$('#following_div').show();
		$('#message').hide();
	});

});

