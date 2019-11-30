console.log('Follow functions loaded');

$(document).ready(function() {
	let username = $('#site_header').text();
	let user = $('#current_user').text();
	let is_follow = null;

	// Enable follow/unfollow buttons
	if (user)
	{
		// Get follow status
		let json_data = { "username": username };
		$.ajax({
			type: "GET",
			url: `/follow`,
			data: json_data,
			dataType: 'json',
			success: function(result){
				if (!result['status'].localeCompare('OK'))
				{
					console.log(result)
					if (result['follow'])
					{
						is_follow = true;
						$('#unfollow_btn').show();
					}
					else
					{
						is_follow = false;
						$('#follow_btn').show();
					}
				}
				else
				{
					console.log("Could not get follow info");
					console.log(result);
					is_follow = false;
					$('#follow_btn').show();
				}
			},
			error: function(result){
				console.log("Could not get follow info");
				console.log(result);
				is_follow = false;
				$('#follow_btn').show();
			}
		});

		$('#follow_btn').bind('click', function(){
			let follow_data = {
				"username": username,
				"follow": true
			};
			follow_data = JSON.stringify(follow_data);
			$('#num_followers').text(parseInt($('#num_followers').text()) + 1);

			$.ajax({
				type: "POST",
				url: `/follow`,
				data: follow_data,
				contentType: 'application/json;charset=UTF-8',
				dataType: 'json',
				success: function(result){
					if (!result['status'].localeCompare('OK'))
					{
						console.log(result)
						is_follow = true;
						$('#follow_btn').hide();
						$('#unfollow_btn').show();
					}
					else
					{
						console.log("Could not perform follow");
						console.log(result);
						$('#num_followers').text(parseInt($('#num_followers').text()) - 1);
					}
				},
				error: function(result){
					console.log("Could not perform follow");
					console.log(result);
					$('#num_followers').text(parseInt($('#num_followers').text()) - 1);
				}
			});
		});

		$('#unfollow_btn').bind('click', function(){
			let follow_data = {
				"username": username,
				"follow": false
			};
			follow_data = JSON.stringify(follow_data);
			$('#num_followers').text(parseInt($('#num_followers').text()) - 1);

			$.ajax({
				type: "POST",
				url: `/follow`,
				data: follow_data,
				contentType: 'application/json;charset=UTF-8',
				dataType: 'json',
				success: function(result){
					if (!result['status'].localeCompare('OK'))
					{
						console.log(result)
						is_follow = false;
						$('#unfollow_btn').hide();
						$('#follow_btn').show();
					}
					else
					{
						console.log("Could not perform unfollow");
						console.log(result);
						$('#num_followers').text(parseInt($('#num_followers').text()) + 1);
					}
				},
				error: function(result){
					console.log("Could not perform unfollow");
					console.log(result);
					$('#num_followers').text(parseInt($('#num_followers').text()) + 1);
				}
			});
		});

	}

});

