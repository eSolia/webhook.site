// Process Slack eSolia app /iam slash command

// Call from github 
//result = import('https://raw.githubusercontent.com/RickCogley/webhook.site/master/PROdb/esolia-slack-iam-01.js')
//echo(result) 

// Configuration
prodb_token = var('g_prodb_token');
//slack_token = var('g_slack_token_001');
slack_signsecret = var('g_slack_signsecret_001');
prodb_status_create_url = var('g_prodb_status_create_url');

echo("SLACK PAYLOAD FORM and HEADER PARAMS");

slack_payload = var('request.content');
echo("slack_payload: " + slack_payload);

//sp_user_name = var('request.form.user_name');
//echo("sp_user_name: " + sp_user_name);

//sp_channel_id = var('request.form.channel_id');
//echo("sp_channel_id: " + sp_channel_id);

//sp_text = var('request.form.text');
//echo("sp_text: " + sp_text);

//sp_token = var('request.form.token');
//echo("sp_token: " + sp_token);

//sp_response_url = var('request.form.response_url');
//echo("sp_response_url: " + sp_response_url);

x_slack_request_timestamp = var('request.header.x-slack-request-timestamp');
echo("x_slack_request_timestamp: " + to_string(x_slack_request_timestamp));

x_slack_signature = var('request.header.x-slack-signature');
echo("x_slack_signature: " + x_slack_signature);

hmac_string_value = "v0:" + to_string(x_slack_request_timestamp) + ":" + slack_payload;
echo("hmac_string_value: " + hmac_string_value);

local_slack_signature = "v0=" + hmac(hmac_string_value, 'sha256', slack_signsecret)
echo("local_slack_signature: " + local_slack_signature);

// Function for error handling
function error (message) {
	echo('Error: {}'.format(message))
	respond(json_encode(['error': message]), 500)
}

// If the locally calculated sig does not match the received sig:
if (local_slack_signature != x_slack_signature) {
  error('ERROR Invalid HMAC Signature')
}

// Make blank array
// TS format: '2021-08-11T05:08:56Z'
//.date_format('YYYY-MM-DDThh:mmZ')
prodb_status_array = [];
array_push(prodb_status_array, [
  'Slack Timestamp': to_date('now'),
  'Slack Token': var('request.form.token'),
  'Slack API App ID': var('request.form.api_app_id'),
  'Slack Is Enterprise Install': var('request.form.is_enterprise_install'),
  'Slack Channel Id': var('request.form.channel_id'),
  'Slack Channel Name': var('request.form.channel_name'),
  'Slack Service Id': var('request.form.service_id'),
  'Slack Team Domain': var('request.form.team_domain'),
  'Slack Team Id': var('request.form.team_id'),
  'Slack Text': var('request.form.text'),
  'Slack Command': var('request.form.command'),
  'Slack Trigger Id': var('request.form.trigger_id'),
  'Slack Response URL': var('request.form.response_url'),
  'Slack User Id': var('request.form.user_id'),
  'Slack User Name': var('request.form.user_name')
])


echo("TRANSFORM ARRAY TO JSON AND PUSH TO PRODB");
// echo json to be sent to prodb status table
// dump(transformed);
prodb_status_array_json = json_encode(prodb_status_array);
echo(prodb_status_array_json);

// upload to prodb
prodb_status_response = request(
  prodb_status_create_url,
  prodb_status_array_json,
  'POST',
  ['Content-Type: application/json',
   'Authorization: bearer '+ prodb_token
  ]
)
if (prodb_status_response['status'] = 200) {
	respond('/iam Successfully Loaded to PROdb STATUSES Table', 200);
}
