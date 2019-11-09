console.log('Form functions loaded');

function post_page(json_data, path)
{
	let form = document.createElement('form');
	form.style.visibility = 'hidden';
	form.method = 'POST';
	form.action = path;

	keys = Object.keys(json_data);
	for (let key of Object.keys(json_data))
	{
		let input = document.createElement('input');
		input.name = key;
		input.value = json_data[key];
		form.appendChild(input);
	}

	document.body.appendChild(form);
	form.submit();
}

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

function format_item(item)
{
	return `${item['username']}: ${item['content']}<br>
		${unix_to_datetime(item['timestamp'])}<br>
		Likes: ${item['property']['likes']}, Retweets: ${item['retweeted']}<br>
		ID: ${item['id']}<br>`;
}

function format_search_result(arr)
{
	let str = '';
	for (let obj of arr)
	{
		//console.log(obj);
		str += format_item(obj) + '<br>';
	}
	return str
}

$(document).ready(function() {
	//$('#message').hide();
	let current_item = null;

	$('#login_form').submit(function(event) {
		event.preventDefault(); // Prevents default submit action (GET query)

		//let form_data = JSON.stringify($('#login_form').serializeArray());
		let form_data = $('#login_form').serializeArray();
		let json_data = serialarr_to_json(form_data);
		json_data = JSON.stringify(json_data);
		$.ajax({
			type: "POST",
			url: "/login",
			data: json_data,
			contentType: 'application/json;charset=UTF-8',
			dataType: 'json',
			success: function(result){
				if (!result['status'].localeCompare('OK'))
				{
					success("Log in", result);
					$('#login_form')[0].reset();
					$('#site_header').text(`Welcome ${result['username']}`);
					//$('#nav_logout').show();
				}
				else
				{
					failure("Log in", result);
					$('#login_form')[0].reset();
				}
			},
			error: function(result){
				failure("Log in", result);
				$('#login_form')[0].reset();
			}
		});
	});

	$('#nav_logout').click(function(event) {
		$.ajax({
			type: "POST",
			url: "/logout",
			dataType: 'json',
			success: function(result){
				if (!result['status'].localeCompare('OK'))
				{
					success("Log Out", result);
					$('#site_header').text('Welcome to Moses-Yang Space');
					//$('#nav_logout').hide();
				}
				else
				{
					failure("Logout", result);
				}
			},
			error: function(result){
				failure("Logout", result);
			}
		});
	});

	$('#register_form').submit(function(event) {
		event.preventDefault();

		let form_data = $('#register_form').serializeArray();
		let json_data = serialarr_to_json(form_data);
		json_data = JSON.stringify(json_data);
		$.ajax({
			type: "POST",
			url: "/adduser",
			data: json_data,
			contentType: 'application/json;charset=UTF-8',
			dataType: 'json',
			success: function(result){
				if (!result['status'].localeCompare('OK'))
				{
					success("Register", result);
					$('#register_form')[0].reset();
				}
				else
				{
					failure("Register", result);
				}
			},
			error: function(result){
				failure("Register", result);
			}
		});
	});

	$('#verify_form').submit(function(event) {
		event.preventDefault();

		let form_data = $('#verify_form').serializeArray();
		let json_data = serialarr_to_json(form_data);
		json_data = JSON.stringify(json_data);
		$.ajax({
			type: "POST",
			url: "/verify",
			data: json_data,
			contentType: 'application/json;charset=UTF-8',
			dataType: 'json',
			success: function(result){
				if (!result['status'].localeCompare('OK'))
				{
					success("Verify", result);
					$('#register_form')[0].reset();
				}
				else
				{
					failure("Verify", result);
				}
			},
			error: function(result){
				failure("Verify", result);
			}
		});
	});

	$('#profile_form').submit(function(event) {
		event.preventDefault();

		let form_data = $('#profile_form').serializeArray();
		json_data = serialarr_to_json(form_data);
		username = json_data['username']
		json_data = JSON.stringify(json_data);
		$.ajax({
			type: "GET",
			url: `/user/${username}`,
			dataType: 'json',
			success: function(result){
				if (!result['status'].localeCompare('OK'))
				{
					success("View Profile", result);
					$('#profile_form')[0].reset();
					profile = result['user'];
					profile['username'] = username;
					post_page(profile, '/profile');
				}
				else
				{
					failure("View Profile", result);
				}
			},
			error: function(result){
				failure("View Profile", result);
			}
		});
	});

	$('#additem_form').submit(function(event) {
		event.preventDefault();

		let form_data = $('#additem_form').serializeArray();
		let json_data = serialarr_to_json(form_data);
		json_data = JSON.stringify(json_data);
		$.ajax({
			type: "POST",
			url: "/additem",
			data: json_data,
			contentType: 'application/json;charset=UTF-8',
			dataType: 'json',
			success: function(result){
				if (!result['status'].localeCompare('OK'))
				{
					success("Add item", result);
					$('#msg_text').text(`ID: ${result['id']}`);
					$('#additem_form')[0].reset();
				}
				else
				{
					failure("Add item", result);
				}
			},
			error: function(result){
				failure("Add item", result);
			}
		});
	});

	$('#getitem_form').submit(function(event) {
		event.preventDefault();

		let form_data = $('#getitem_form').serializeArray();
		let json_data = serialarr_to_json(form_data);
		$.ajax({
			type: "GET",
			url: `/item/${json_data['uuid']}`,
			dataType: 'json',
			success: function(result){
				if (!result['status'].localeCompare('OK'))
				{
					success("Get item", result);
					current_item = json_data;
					$('#getitem_form')[0].reset();

					str = format_item(result['item'])
					$('#msg_text').html(str);
					$('#delete_btn').show();
				}
				else
				{
					failure("Get item", result);
					$('#delete_btn').hide();
				}
			},
			error: function(result){
				failure("Get item", result);
				$('#delete_btn').hide();
			}
		});
	});

	$('#delete_btn').bind('click', function() {
		$.ajax({
			type: "DELETE",
			url: `/item/${current_item['uuid']}`,
			dataType: 'json',
			success: function(result){
				if (!result['status'].localeCompare('OK'))
				{
					success("Delete item", result);
					$('#delete_btn').hide();
				}
				else
				{
					let str = $('#msg_text').html();
					failure("Delete item", result);
					$('#msg_text').html(str);
				}
			},
			error: function(result){
				failure("Delete item", result['responseJSON']);
			}
		});
	});

	$('#search_form').submit(function(event) {
		event.preventDefault();

		let form_data = $('#search_form').serializeArray();
		let json_data = serialarr_to_json(form_data);

		if (!json_data['q'])
			delete json_data['q']
		if (!json_data['username'])
			delete json_data['username']

		if (json_data.hasOwnProperty('timestamp'))
		{
			json_data['timestamp'] = parseFloat(json_data['timestamp']);
			if (isNaN(json_data['timestamp']))
				delete json_data['timestamp'];
		}
		if (json_data.hasOwnProperty('limit'))
		{
			json_data['limit'] = parseInt(json_data['limit']);
			if (isNaN(json_data['limit']))
				delete json_data['limit'];
		}
		if (json_data.hasOwnProperty('following') && !json_data['following'].localeCompare('on'))
			json_data['following'] = true;
		else
			json_data['following'] = false;

		console.log(json_data);

		json_data = JSON.stringify(json_data)
		$.ajax({
			type: "POST",
			url: "/search",
			data: json_data,
			contentType: 'application/json;charset=UTF-8',
			dataType: 'json',
			success: function(result){
				if (!result['status'].localeCompare('OK'))
				{
					console.log('Search successful');
					console.log(result)

					text = format_search_result(result['items']);
					$('#search_text').html(`${text}`);
					$('#search_text').show();
				}
				else
				{
					failure("Search", result);
					$('#search_text').hide();
				}
			},
			error: function(result){
				failure("Search", result);
				$('#search_text').hide();
			}
		});
	});

});

