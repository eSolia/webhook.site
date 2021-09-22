// Return CSV

// Configuration
prodb_token = var('g_prodb15331_token_for_csv');
prodb_fcsj_tasks_csv_url = var('g_prodb_fcsj_select_tasks_csv_url');
task2csv_hmac_secret_fcsj = var('g_task2csv_hmac_secret_fcsj');

subst_epoch = var('request.query.e');
echo("Request url param subst epoch: " + subst_epoch);
hmac_str = var('request.query.h');
echo("Request url param hmac (binhex of md5 in prodb with client code as key): " + hmac_str);

// string_replace(string subject, string search, string replace)
// In PROdb: Replace(Replace(Replace([Expires Epoch Time],"1","T"),"5","A"),"0","E") 
epoch = string_replace(string_replace(string_replace(subst_epoch,"E","0"),"A","5"),"T","1");
echo("Orig epoch: " + epoch);

// Function for error handling
function error (message) {
	echo('« eSolia Inc. » ERROR: {}'.format(message))
	respond(json_encode(['error': message]), 500)
}

// Check hmac
// hmac(string value, string algo, string secret) : string/false
acme_token = string_upper("ACME".hash('md5'));
fcsj_token = string_upper(hmac(epoch, "md5", task2csv_hmac_secret_fcsj));
validtokens = ['ACME':acme_token, 'FCSJ':fcsj_token];
tokenisvalid = array_contains(validtokens,hmac_str);
echo(tokenisvalid);

// If the token was invalid
if (!tokenisvalid) {
  error('Invalid token')
}

// How Epoch is Calculated in PROdb:
// ToText(Format(ToDays(((Today() + Days(7))-ToDate("1970/01/01")))*86400,"#"))
// The received epoch (now + 7d when email sent) much still be greater than current
urlisvalid = to_number(epoch) > to_number('now'.date_format('X'));
echo(urlisvalid);
// If the URL was invalid return an error
if (!urlisvalid) {
  error('Expired URL');
}


if (hmac_str == fcsj_token) {
	echo("hmac matches");
	// Get csv 
	echo("GET csv");
	prodb_response = request(
	  prodb_fcsj_tasks_csv_url,
	  '',
	  'GET',
	  ['Content-Type: application/json',
	   'Authorization: bearer ' + prodb_token
	  ]
	)
	// BUILD RESPONSE
	// prep csv to var
	response_csv = prodb_response['content'];
	// prep DL file timestamp
	csvdate = 'now'.date_format('YYYY-MM-DD-HHmm', null, 'GMT+9', true)
	// prep header string
	header_prep = "Content-Disposition: attachment; filename=" + "eSolia_FCSJ-Tasks-" + csvdate + ".csv"
	// create header array from var
	headers = [header_prep];
	dump(headers);
	respond(response_csv, 200, headers);
}
