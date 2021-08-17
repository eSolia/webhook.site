// Send SMS via Twilio either for all eSolia or just bookers of a client

twilio_token = var('g_twilio_token');
twilio_token_enc = base64_encode(twilio_token);
twilio_send_sms_url = var('g_twilio_send_sms_url');

if (var('request.query.type')) {
send_type = var('request.query.type');
echo("send_type: " + send_type);
}
if (var('request.query.emailfrom')) {
email_from = var('request.query.emailfrom');
echo("email_from: " + email_from);
}
if (var('request.query.emailsubject')) {
email_subject = var('request.query.emailsubject');
echo("email_subject: " + email_subject);
}
if (var('request.query.smslist')) {
sms_list = var('request.query.smslist');
echo("sms_list: " + sms_list);
}
if (var('request.query.ticketnumber')) {
ticket_number = var('request.query.ticketnumber');
echo("ticket_number: " + to_string(ticket_number));
}
if (var('request.query.clientname')) {
client_name = var('request.query.clientname');
echo("client_name: " + client_name);
}

sms_list_array = string_split(trim(sms_list),"\n");
dump(sms_list_array);

// ===========ALL===========

if (var('request.query.type') == "all") {
	echo("START Processing for general sms emergency send to all")
	
body_text = "Emergency Email received from " + email_from + " with subject «" + email_subject + "» - pls see https://tinyurl.com/esolia99group"
echo("body_text: " + body_text);

for (sms_target in sms_list_array) {
	echo(sms_target);
	body = query([
	  'From': '+12015033510',
	  'Body': body_text,
	  'To': trim(sms_target),
	])
	
	resp = request(
	twilio_send_sms_url,
	body,
	'POST',
	[
		'Content-Type: application/x-www-form-urlencoded',
		'Authorization: Basic ' + twilio_token_enc
	]
)
}
	echo("END Processing for general sms emergency send to all")
}

// ===========BOOKERS===========

if (var('request.query.type') == "bookers") {
	echo("START Processing for sms emergency send to bookers")
	
body_text = "Urgent " + client_name + " P1 Ticket " + to_string(ticket_number) + " recd with subject «" + email_subject + "» from " + email_from + " https://tinyurl.com/esotick"
echo("body_text: " + body_text);

for (sms_target in sms_list_array) {
	echo(sms_target);
	body = query([
	  'From': '+12015033510',
	  'Body': body_text,
	  'To': trim(sms_target),
	])
	
	resp = request(
	twilio_send_sms_url,
	body,
	'POST',
	[
		'Content-Type: application/x-www-form-urlencoded',
		'Authorization: Basic ' + twilio_token_enc
	]
)
}
	echo("END Processing for sms emergency send to bookers")
}
