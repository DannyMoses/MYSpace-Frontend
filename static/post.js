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
	let item_id = $('#current_item').text();
	let user = $('#current_user').text();
	let item = null;

	// Query GET /item/<id> and update page
	$.ajax({
		type: "GET",
		url: `/item/${json_data['uuid']}`,
		dataType: 'json',
		success: function(result){
			if (!result['status'].localeCompare('OK'))
			{
				success("Get item", result);
				item = result['item'];
			}
			else
			{
				failure("Get item", result);
			}
		},
		error: function(result){
			failure("Get item", result);
		}
	});

	if (item !== null) {
		$('#post_text').text(item['content']);
		$('#post_author').text(item['username']);
		$('#num_likes').text(item['property']['likes']);
		$('#num_retweets').text(item['retweeed']);

		if (item['childType'] !== null && item['parent'] !== null) {
			$('#post_parent').text(item['parent']);
			$('#post_parent').show();
		}
		if (item['media'].length > 0) {
			$('#post_media').text(item['media'].join(', '));
			$('#post_media').show();
		}
	}

	// Button Binding
	$('#nav_back').bind('click', function() {
		window.history.back();
	});

	// Enable retweet/reply options
	if (user)
	{
		$('#retweet_btn').show();
		$('#reply_btn').show();

		$('#retweet_btn').bind('click', function() {
			let text = $('#post_text').text();
			let post_data = {
				"content": text,
				"childType": "retweet",
				"parent": item_id
			};
			post_data = JSON.stringify(post_data);

			$.ajax({
				type: "POST",
				url: "/additem",
				data: post_data,
				contentType: 'application/json;charset=UTF-8',
				dataType: 'json',
				success: function(result){
					if (!result['status'].localeCompare('OK'))
					{
						success("Retweet", result);
					}
					else
					{
						failure("Retweet", result);
					}
				},
				error: function(result){
					failure("Add item", result);
				}
			});
		});

		$('#reply_btn').bind('click', function() {
			$('#reply_div').toggle();
		});

		$('#addreply_btn').bind('click', function() {
			event.preventDefault();
			$('#reply_div').hide();

			let form_data = $('#reply_form').serializeArray();
			let json_data = serialarr_to_json(form_data);
			json_data['childType'] = "retweet";
			json_data['parent'] = item_id;
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
						success("Reply", result);
						$('#reply_form')[0].reset();
					}
					else
					{
						failure("Reply", result);
					}
				},
				error: function(result){
					failure("Reply", result);
				}
			});
		});
	}

	if (user == item['username']) {
		$('#delete_btn').show();

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
	}
});

