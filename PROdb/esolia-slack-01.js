// Process Slack eSolia app /iam slash command

// Call from github 
//result = import('https://raw.githubusercontent.com/RickCogley/webhook.site/master/PROdb/esolia-slack-iam-01.js')
//echo(result) 

// Configuration
prodb_token = var('g_prodb_token');
//slack_token = var('g_slack_token_001');
slack_signsecret = var('g_slack_signsecret_001');
prodb_status_create_url = var('g_prodb_status_create_url');
prodb_contact_search_url = var('g_prodb_contact_search_url');
prodb15331_fax_upsert_url = var('g_prodb15331_fax_upsert_url');

echo("SLACK PAYLOAD and HEADER PARAMS for HMAC CHECK and FORM VARS");

slack_payload = var('request.content');
echo("slack_payload: " + slack_payload);

slack_text = var('request.form.text')
echo("slack_text: " + slack_text);
contact_query = string_slice(slack_text, (string_find_first(slack_text," ") + 1));
echo("contact_query: " + contact_query);
contact_query_enc = url_encode(contact_query);
echo("contact_query_enc: " + contact_query_enc);

slack_response_url = var('request.form.response_url');

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

// PROCESS if iam
if (var('request.form.command') == "/iam") {
    echo("START Processing for iam command")

// Make blank array then array_push request form params
// TS format needed by PROdb: iso8601
// Append .date_format('YYYY-MM-DDThh:mmZ') to force a format, but simple now works in our case
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
// This goes back to slack
  if (prodb_status_response['status'] = 200) {
    echo("END Processing for iam command");
    respond('/iam Successfully Loaded to PROdb STATUSES Table', 200);
  }
// END iam if
}

// PROCESS if prodb command
if (var('request.form.command') == "/prodb") {
    echo("START Processing for prodb command")

// Make blank array then array_push request form params
// TS format needed by PROdb: iso8601
// Append .date_format('YYYY-MM-DDThh:mmZ') to force a format, but simple now works in our case
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

// Prep URL
prodb_contact_search_url_w_param = prodb_contact_search_url + "?filter=Contains(%5BDisplay%20Name%20-%20Key%20Info%204%5D%2C%22" + contact_query_enc + "%22)&top=20"
echo("prodb_contact_search_url_w_param: " + prodb_contact_search_url_w_param);
// ?filter=Contains(%5BDisplay%20Name%20-%20Key%20Info%204%5D%2C%22${SEARCHSTRENC}%22)&top=20


echo("TRANSFORM ARRAY TO JSON AND PUSH TO PRODB");
// echo json to be sent to prodb status table
prodb_status_array_json = json_encode(prodb_status_array);
echo(prodb_status_array_json);

// get contact(s) from prodb
prodb_contact_response = request(
  prodb_contact_search_url_w_param,
  '',
  'GET',
  ['Content-Type: application/json',
   'Authorization: bearer '+ prodb_token
  ]
)

prodb_contact_response_content = prodb_contact_response['content'];
echo(prodb_contact_response_content);
prodb_contact_response_content_array = json_decode(prodb_contact_response_content);
prodb_contacts = "";
for (subObject in prodb_contact_response_content_array) {
   echo(subObject['Display Name - Key Info 4']); 
   prodb_contacts = prodb_contacts + subObject['Display Name - Key Info 4'] + "\n"
   echo(prodb_contacts);
}

slack_callback_data = '{
  "text": "' + prodb_contacts + '",
  "mrkdwn_in": ["text"]
}'
echo(slack_callback_data);

// This goes back to slack
  if (prodb_contact_response['status'] = 200) {
    echo("END Processing for prodb command");
    request(
      slack_response_url,
      slack_callback_data,
      'POST',
      ['Content-Type: application/json']
    )
    respond('/prodb Successfully Searched Contact', 200);
  }
// END prodb if
}

// PROCESS if testfax command
if (var('request.form.command') == "/testfax") {
    echo("START Processing for testfax command")

// Make blank array then array_push request form params
// TS format needed by PROdb: iso8601
// Append .date_format('YYYY-MM-DDThh:mmZ') to force a format, but simple now works in our case
prodb_fax_array = [];
array_push(prodb_fax_array, [
  'Sent TS': to_date('now'),
  'Type': true,
  'Slack Text': var('request.form.text'),
  'Slack User': var('request.form.user_name')+" "+var('request.form.user_id'),
  'Slack Channel': var('request.form.channel_id')+var('request.form.channel_name')
])

//'Slack Token': var('request.form.token'),
//'Slack API App ID': var('request.form.api_app_id'),
//'Slack Is Enterprise Install': var('request.form.is_enterprise_install'),
//'Slack Channel Name': var('request.form.channel_name'),
//'Slack Service Id': var('request.form.service_id'),
//'Slack Team Domain': var('request.form.team_domain'),
//'Slack Team Id': var('request.form.team_id'),
//'Slack Command': var('request.form.command'),
//'Slack Trigger Id': var('request.form.trigger_id'),
//'Slack Response URL': var('request.form.response_url'),
//'Slack User Id': var('request.form.user_id')

echo("TRANSFORM ARRAY TO JSON AND PUSH TO PRODB");
// echo json to be sent to prodb status table
prodb_fax_array_json = json_encode(prodb_fax_array);
echo(prodb_fax_array_json);

// POST fax to prodb
prodb_fax_response = request(
  prodb15331_fax_upsert_url,
  prodb_fax_array_json,
  'POST',
  ['Content-Type: application/json',
   'Authorization: bearer '+ prodb_token
  ]
)

// This goes back to slack
  if (prodb_fax_response['status'] = 200) {
    echo("END Processing for testfax command");
    respond('/testfax Successfully Uploaded Fax to PROdb PS FAX Table', 200);
  }
// END faxtest if
}
