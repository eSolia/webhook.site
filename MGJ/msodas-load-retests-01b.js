// Call from github
//result = import('https://raw.githubusercontent.com/RickCogley/webhook.site/master/MGJ/mgj-load-csv-01b.js')
//echo(result)

// TWO - Queued Processing
echo("START SCRIPT TWO - QUEUED PROCESSING");

// Configuration
prodb74559_token = var('g_prodb74559_token');
prodb74559_retest_upsert_url = var('g_prodb74559_retest_upsert_url');

url = var('pass_url');
echo(url);
jobstring = var('pass_jobstring');
echo(jobstring);

csv_nozero = var('pass_csv_nozero');

array = csv_to_array(csv_nozero, ',', 0)
dump(array);

// If CSV can't be parsed, or there's less than 2 rows, fail
if (!array or array.length() < 1) {
	respond('
		<h1>Could not parse CSV</h1>
		<a href="{}">Upload Again</a>
	'.format(url));
}

// Make blank array for myriad retests
arraymyrretest = [];
// Loop over data and prepare array
echo("Looping over original array from CSV and pulling myriad account fields");
for (subObject in array) {
	array_push(arraymyrretest, [
	    'ミリアド アカウント': string_replace(subObject['ミリアド アカウント'],"ZZEERROO","0"),
		'Accession ID': string_replace(subObject['Accession ID'],"ZZEERROO","0"),
		'ID-0': string_replace(subObject['ID-0'],"ZZEERROO","0"),
		'匿名符号': string_replace(subObject['匿名符号'],"ZZEERROO","0"),
		'準備完了': string_replace(to_string(subObject['準備完了']),"ZZEERROO","0"),
		'Source': 'CSV',
		'Job': jobstring
	])
}
//'ミリアド ID': to_string(string_replace(subObject['Myriad Account'],"ZZEERROO","0")),
//'SRL病院コード': to_string(string_replace(subObject['SRL 病院コード'],"ZZEERROO","0")),
dump(arraymyrretest);
arraymyrretest_json = json_encode(arraymyrretest);
echo(arraymyrretest_json);
// set('pass_arraymyracct_json', arraymyracct_json)

// upsert to M-SODAS (usually ok)
msodas_myrretestupsert_response = request(
  prodb74559_retest_upsert_url,
  arraymyrretest_json,
  'POST',
  ['Content-Type: application/json',
   'Authorization: bearer '+ prodb74559_token
  ],
  false,
  30
)

echo("END SCRIPT TWO - QUEUED PROCESSING");
