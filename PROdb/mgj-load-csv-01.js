// Call from github 
// result = import('https://raw.githubusercontent.com/RickCogley/webhook.site/master/PROdb/mgj-load-csv-01.js')
// echo(result) 

// Configuration
prodb74559_token = var('g_prodb74559_token');
prodb74559_hosp_upsert_url = var('g_prodb74559_hosp_upsert_url');
prodb74559_myracct_upsert_url = var('g_prodb74559_myracct_upsert_url');
prodb74559_userprops_upsert_url = var('g_prodb74559_userprops_upsert_url');
prodb74559_myracctuserprops_upsert_url = var('g_prodb74559_myracctuserprops_upsert_url');

matchuser = var('g_basic_auth_user_02');
matchpass = var('g_basic_auth_pw_02');
entereduser = var('request.header.php-auth-user');
enteredpass = var('request.header.php-auth-pw');
url = var('request.url');

// setup authenticate function to be DRY
function authenticate() {
    respond('', 401, [
        'WWW-Authenticate: Basic realm="Login to Myriad Utility URL"'
    ]);
}

// authenticate if there is no entered user or pass
if (!entereduser or !enteredpass) {
    authenticate()
}
// authenticate if the entered user or pass fails to match the expected ones kept in variables
if (entereduser != matchuser and enteredpass != matchpass) {
    authenticate()
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

// Prep qty data
//presp1 = prodb_response1['content'];
//echo(presp1);
//qtybefore = json_path(presp1, '0."Display Name 2"');
//echo(qtybefore);

// Display file upload form and exit if HTTP method is not POST
// That is, if someone just accesses the utility URL in a standard way, doing a GET
if (var('request.method') != 'POST') {
    respond('<html lang="ja">
	<head>
		<title>Upload Vimeo Stats CSV</title>
        <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre.min.css">
    </head>
	<body class="text-dark p-2">
	    <div class="container grid-lg">
            <div class="columns">
                <div class="column col-10">
                    <h1 class="text-success mt-4">Upload Vimeo Stats CSV</h1>
    		        <p>This webhook.site URL accepts upload of a statistics CSV downloaded from <a href="https://vimeo.com/analytics/video" target="_blank">Vimeo</a>, formats it as expected and pushes it up to the ABMD PROdb database "Training Video" table. The purpose is to update statistics for the Vimeo videos available only via the downloaded CSV. The frequency of uploads should be either once per month during regular maintenance or, whenever a new video is uploaded to Vimeo. Instructions available <a href="https://pro.dbflex.net/secure/db/15331/preview.aspx?t=140617&id=643" target="_blank">here</a>, but be sure to <strong><mark>select the largest date range possible</mark></strong>.</p>
        		    <br>
        		    <!-- form input control -->
            		<form action="{}" method="POST" enctype="multipart/form-data">
            			<div class="form-group">
                            <div class="col-2">
                              <label class="form-label" for="input-example-16">Select File</label>
                            </div>
                            <div class="col-7">
                              <input class="form-input" id="inputfile" type="file" name="file" />
                            </div>
                        </div>
            			<button class="btn btn-primary c-hand" type="submit">Upload CSV</button>
            		</form>
            		<br>
            		<p><strong>Reference Loads Quantity Before CSV Upload</strong>: {}</p>
            		<br>
            		<img class="img-responsive rounded" src="https://assets.esolia.com/eSolia_Square_Chicklet_Logo_YellowBlue.svg" alt="eSolia Logo">
                </div>
            </div>
        </div>
	</body>
</html>'.format(url));
}
// Like a heredoc, chain the html with curly bracket placeholders to format()
// The order of vars passed to format matters

// Use a comma as delimiter and treat first row (0) as header row
array = csv_to_array(var('request.file.file.content'), ',', 0)

// If CSV can't be parsed, or there's less than 2 rows, fail
if (!array or array.length() < 2) {
    respond('
        <h1>Could not parse CSV</h1>
        <a href="{}">Upload again</a>
    '.format(url));
}

dump(array);

// Make blank array
array2 = [];
// Loop over data and prepare array
// Replace extraneous string in uri field
// convert mean_percent to number and divide by 100 so it formats correctly in PROdb percent numeric field
echo("LOOP OVER ARRAY and CHERRYPICK");
for (subObject in array) {
    array_push(array2, [
        'Id': string_replace(subObject['uri'],"/videos/",""),
        'plays': subObject['plays'],
        'loads': subObject['loads'],
        'finishes': subObject['finishes'],
        'unique_loads': subObject['unique_loads'],
        'mean_percent': to_number(subObject['mean_percent']) / 100,
        'mean_seconds': subObject['mean_seconds'],
        'sum_seconds': subObject['sum_seconds'],
        'total_seconds': subObject['total_seconds'],
        'unique_viewers': subObject['unique_viewers']
    ])
}

//'Stats Manual Updated TS': to_date('now').date_format('YYYY-MM-DDThh:mmZ')

dump(array2);
echo("TRANSFORM ARRAY2 TO JSON AND PUSH TO PRODB");
// echo json to be sent to prodb wmstatus table
echo(json_encode(array2));
array2_json = json_encode(array2);
// upsert to prodb
prodb_statsupsert_response = request(
  prodb55438_video_upsert_url,
  array2_json,
  'POST',
  ['Content-Type: application/json',
   'Authorization: bearer '+ prodb55438_token
  ]
)

// Get reference loads qty after
echo("GET reference loads qty after CSV");
prodb_response2 = request(
  prodb55438_reference_loads_url,
  '',
  'GET',
  ['Content-Type: application/json',
   'Authorization: bearer ' + prodb55438_token
  ]
)

// Prep qty data
presp2 = prodb_response2['content'];
echo(presp2);
qtyafter = json_path(presp2, '0."Display Name 2"');
echo(qtyafter);

// Display the parsed CSV in JSON format 
respond('<html lang="ja">
	<head>
		<title>Upload Vimeo Stats CSV</title>
        <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre.min.css">
    </head>
	<body class="text-dark p-2">
	    <div class="container grid-lg">
            <div class="columns">
                <div class="column col-10">
                    <h1 class="text-success mt-4">Stats CSV Upload Successful</h1>
                    <br>
                    <p><strong>Reference Loads Quantity Before CSV Upload</strong>: {}<br>
                    <strong>Reference Loads Quantity After CSV Upload</strong>: {}</p>
                    <p>If the quantity decreased, there is something wrong with your date range selection when exporting the CSV. Please confirm and retry.</p>
                    <p><button class="btn btn-success c-hand"><a href="{}" class="text-warning">Upload Again</a></button></p>
                    <br>
            		<img class="img-responsive rounded" src="https://assets.esolia.com/eSolia_Square_Chicklet_Logo_YellowBlue.svg" alt="eSolia Logo">
                    <br>
                    <h2>Uploaded Data in JSON Format</h2>
                    <pre>{}</pre>
                </div>
            </div>
        </div>
	</body>
</html>
'.format("before", "after", url, json_encode(array2)));
// Like a heredoc, chain the html with curly bracket placeholders to format()
// The order of vars passed to format matters