console.log('Follow functions loaded');

$(document).ready(function() {
	let item_id = $('#current_item').text();
	let user = $('#current_user').text();
	let is_like = null;

	// Enable like/unlike options
	if (user)
	{
		// Get like/unlike status
		let json_data = { "username": user };
		$.ajax({
			type: "GET",
			url: `/item/${item_id}/like`,
			data: json_data,
			dataType: 'json',
			success: function(result){
				if (!result['status'].localeCompare('OK'))
				{
					console.log(result)
					if (result['follow'])
					{
						is_like = true;
						$('#unlike_btn').show();
					}
					else
					{
						is_like = false;
						$('#like_btn').show();
					}
				}
				else
				{
					console.log("Could not get like info");
					console.log(result);
					is_like = false;
					$('#like_btn').show();
				}
			},
			error: function(result){
				console.log("Could not get like info");
				console.log(result);
				is_follow = true;
				$('#like_btn').show();
			}
		});

		// Bind buttons
		$('#like_btn').bind('click', function(){
			$.ajax({
				type: "POST",
				url: `/item/${item_id}/like`,
				data: JSON.stringify({ "like": true }),
				contentType: 'application/json;charset=UTF-8',
				dataType: 'json',
				success: function(result){
					if (!result['status'].localeCompare('OK'))
					{
						console.log(result)
						is_like = true;
						$('#like_btn').hide();
						$('#unlike_btn').show();
						$('#num_likes').text(parseInt($('#num_likes').text()) + 1);
					}
					else
					{
						console.log("Could not perform like");
						console.log(result);
					}
				},
				error: function(result){
					console.log("Could not perform like");
					console.log(result);
				}
			});
		});

		$('#unlike_btn').bind('click', function(){
			$.ajax({
				type: "POST",
				url: `/item/${item_id}/like`,
				data: JSON.stringify({ "like": false }),
				contentType: 'application/json;charset=UTF-8',
				dataType: 'json',
				success: function(result){
					if (!result['status'].localeCompare('OK'))
					{
						console.log(result)
						is_like = true;
						$('#unlike_btn').hide();
						$('#like_btn').show();
						$('#num_likes').text(parseInt($('#num_likes').text()) - 1);
					}
					else
					{
						console.log("Could not perform unlike");
						console.log(result);
					}
				},
				error: function(result){
					console.log("Could not perform unlike");
					console.log(result);
				}
			});
		});
	}
}

