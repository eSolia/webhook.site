// Return CSV

subst_epoch = var('request.query.e');
echo("Request url param subst epoch: " + subst_epoch);
hash_str = var('request.query.h');
echo("Request url param hash (binhex of md5 in prodb): " + hash_str);

//string_replace(string subject, string search, string replace)
//Replace(Replace(Replace([Expires Epoch Time],"1","T"),"5","A"),"0","E") 
epoch = string_replace(string_replace(string_replace(subst_epoch,"E","0"),"A","5"),"T","1");
echo("Orig epoch: " + epoch);
echo("md5 of orig epoch: " + hash(epoch, "md5"));
echo("epoch md5: " + epoch.hash('md5'));
echo("test client md5: " + "FCSJ".hash('md5'))


// Function for error handling
function error (message) {
	echo('Error: {}'.format(message))
	respond(json_encode(['error': message]), 500)
}

acme_token = string_upper("ACME".hash('md5'));
fcsj_token = string_upper("FCSJ".hash('md5'));
validtokens = ['ACME':acme_token, 'FCSJ':fcsj_token];
tokenisvalid = array_contains(validtokens,hash_str)
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


if (hash_str == fcsj_token) {
	echo("oh baby");
}


// Get reference loads qty for comparison after load
//echo("GET reference loads qty");
//prodb_response1 = request(
//  prodb55438_reference_loads_url,
//  '',
//  'GET',
//  ['Content-Type: application/json',
//   'Authorization: bearer ' + prodb55438_token
//  ]
//)

