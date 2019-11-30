console.log('Form functions loaded');

function serialarr_to_json(arr)
{
	json_data = {};
	for (let obj of arr)
	{
		json_data[obj['name']] = obj['value'];
	}
	return json_data;
}

function success(func_name, content)
{
	console.log(`${func_name} successful`);
	console.log(content)
	//delete content['status'];

	$('#message').show();
	$('#msg_header').text(`${func_name} successful`);
	$('#msg_text').text('');
}

function failure(func_name, content)
{
	console.log(`${func_name} failed`);
	console.log(content)
	//delete content['status'];

	$('#message').show();
	$('#msg_header').text(`${func_name} failed`);
	if (content.hasOwnProperty('error'))
		$('#msg_text').text(content['error']);
	else
		$('#msg_text').text('');
}

function unix_to_datetime(timestamp)
{
	let date = new Date(timestamp * 1000);
	return date.toUTCString();
	/*
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let year = date.getFullYear();
	let hour = date.getHours();
	let min = date.getMinutes();
	min = min < 10 ? '0'+min : min;
	let sec = date.getSeconds();
	sec = sec < 10 ? '0'+sec : sec;
	*/
}

function format_results(arr, key)
{
	let str = '';
	for (let item of arr)
	{
		//console.log(obj);
		str += item + '<br>';
	}
	return str
}

$(document).ready(function() {
	let username = $('#site_header').text()

	$('#posts_form').submit(function(event) {
		event.preventDefault(); // Prevents default submit action (GET query)

		let form_data = $('#posts_form').serializeArray();
		let json_data = serialarr_to_json(form_data);

		if (json_data.hasOwnProperty('limit'))
		{
			json_data['limit'] = parseInt(json_data['limit']);
			if (isNaN(json_data['limit']))
				delete json_data['limit'];
		}

		$.ajax({
			type: "GET",
			url: `/user/${username}/posts`,
			data: json_data,
			dataType: 'json',
			success: function(result){
				if (!result['status'].localeCompare('OK'))
				{
					success("Posts", result);
					$('#posts_form')[0].reset();

					text = format_results(result['items'], 'id');
					$('#posts_text').html(`${text}`);
					$('#posts_text').show();
				}
				else
				{
					failure("Posts", result);
					$('#posts_form')[0].reset();
				}
			},
			error: function(result){
				failure("Posts", result);
				$('#posts_form')[0].reset();
			}
		});
	});

	$('#followers_form').submit(function(event) {
		event.preventDefault(); // Prevents default submit action (GET query)

		let form_data = $('#followers_form').serializeArray();
		let json_data = serialarr_to_json(form_data);

		if (json_data.hasOwnProperty('limit'))
		{
			json_data['limit'] = parseInt(json_data['limit']);
			if (isNaN(json_data['limit']))
				delete json_data['limit'];
		}

		$.ajax({
			type: "GET",
			url: `/user/${username}/followers`,
			data: json_data,
			dataType: 'json',
			success: function(result){
				if (!result['status'].localeCompare('OK'))
				{
					success("Followers", result);
					$('#followers_form')[0].reset();

					text = format_results(result['users'], 'username');
					$('#followers_text').html(`${text}`);
					$('#followers_text').show();
				}
				else
				{
					failure("Followers", result);
					$('#followers_form')[0].reset();
				}
			},
			error: function(result){
				failure("Followers", result);
				$('#followers_form')[0].reset();
			}
		});
	});

	$('#following_form').submit(function(event) {
		event.preventDefault(); // Prevents default submit action (GET query)

		let form_data = $('#following_form').serializeArray();
		let json_data = serialarr_to_json(form_data);

		if (json_data.hasOwnProperty('limit'))
		{
			json_data['limit'] = parseInt(json_data['limit']);
			if (isNaN(json_data['limit']))
				delete json_data['limit'];
		}

		$.ajax({
			type: "GET",
			url: `/user/${username}/following`,
			data: json_data,
			dataType: 'json',
			success: function(result){
				if (!result['status'].localeCompare('OK'))
				{
					success("Following", result);
					$('#following_form')[0].reset();

					text = format_results(result['users'], 'username');
					$('#following_text').html(`${text}`);
					$('#following_text').show();
				}
				else
				{
					failure("Following", result);
					$('#following_form')[0].reset();
				}
			},
			error: function(result){
				failure("Following", result);
				$('#following_form')[0].reset();
			}
		});
	});

});

