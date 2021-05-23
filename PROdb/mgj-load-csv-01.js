// Call from github 
//result = import('https://raw.githubusercontent.com/RickCogley/webhook.site/master/PROdb/mgj-load-csv-01.js')
//echo(result) 

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
echo(url);

// get date for job number keeping Japan TZ

jobdate = 'now'.date_format('YYYY-MM-DD-HHmm', null, 'GMT+9', true)

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
//echo(var(request.method));


if (var('request.method') != 'POST') {
  respond('<html lang="ja">
<head>
  <title>Upload OES CSV</title>
      <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre.min.css">
  </head>
<body class="text-dark p-2">
    <div class="container grid-lg">
          <div class="columns">
              <div class="column col-10">
                  <h1 class="text-success mt-4">Upload OES CSV</h1>
              <p>This webhook.site URL accepts upload of a CSV formatted in <i>this way</i>, formats it, and pushes it up to the MGJ PROdb database. The purpose is ... Instructions available <a href="#" target="_blank">here</a>...</p>
              <br>
              <!-- form input control -->
              <form action="{}" method="POST" enctype="multipart/form-data" class="form-horizontal">
                <div class="form-group">
                  <div class="col-3 col-sm-12">
                    <label class="form-label" for="csv-load">Select Initials</label>
                  </div>
                  <div class="col-9 col-sm-12">
                    <select name="initials" id="initials" autocomplete="initials" class="form-select" placeholder="イニシャル">
                      <option>YK</option>
                      <option>KC</option>
                      <option>JRC</option>
                      <option>Myriad</option>
                      <option>eSolia</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-3 col-sm-12">
                    <label class="form-label" for="jobdate">Job Date</label>
                  </div>
                  <div class="col-9 col-sm-12">
                    <input class="form-input" type="text" id="jobdate" placeholder="Job Date" value="{}">
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-3 col-sm-12">
                    <label class="form-label" for="csv-load">Select CSV</label>
                  </div>
                  <div class="col-9 col-sm-12">
                    <input class="form-input" id="inputfile" type="file" name="file" />
                  </div>
                </div>

                <button class="btn btn-primary c-hand" type="submit">Upload CSV</button>
              </form>
              
              <br>
              <img class="img-responsive rounded" src="https://assets.esolia.com/mgj/myriad-logo.png" alt="Myriad Logo">
              </div>
          </div>
      </div>
</body>
</html>'.format(url,jobdate));
}
// Like a heredoc, chain the html with curly bracket placeholders to format()
// The order of vars passed to format matters 

// See the request
echo(var('request.form.'));

// Use a comma as delimiter and treat first row (0) as header row
array = csv_to_array(var('request.file.file.content'), ',', 0)
dump(array);

// If CSV can't be parsed, or there's less than 2 rows, fail
if (!array or array.length() < 1) {
    respond('
        <h1>Could not parse CSV</h1>
        <a href="{}">Upload Again</a>
    '.format(url));
}


// Make blank array for hospitals
arrayhosp = [];
// Loop over data and prepare array
echo("Looping over original array from CSV and pulling hospital fields");
for (subObject in array) {
    array_push(arrayhosp, [
        'SRL 病院コード': subObject['SRL 病院コード'],
        'SRL 病院名': subObject['SRL 病院名'],
        'SRL 担当メール': subObject['SRL 担当メール']
    ])
}
dump(arrayhosp);
echo(json_encode(arrayhosp));

// Make blank array for myriad account
arraymyracct = [];
// Loop over data and prepare array
echo("Looping over original array from CSV and pulling myriad account fields");
for (subObject in array) {
    array_push(arraymyracct, [
        'First Name': subObject['First Name'],
        'Last Name': subObject['Last Name'],
        'Email Address': subObject['Email Address'],
        'ミリアド ID': subObject['Myriad Account'],
        'SRL 病院コード': subObject['SRL 病院コード']
    ])
}
dump(arraymyracct);
echo(json_encode(arraymyracct));

// Make blank array for myriad account
arraynewextuser = [];
// Loop over data and prepare array
echo("Looping over original array from CSV and pulling fields for new external user");
for (subObject in array) {
    array_push(arraynewextuser, [
        'First Name': subObject['First Name'],
        'Last Name': subObject['Last Name'],
        'Email': subObject['Email Address'],
        'Myriad Account': subObject['Myriad Account'],
        'Source': 'CSV'
    ])
}
dump(arraynewextuser);
echo(json_encode(arraynewextuser));

// Display the parsed CSV in JSON format 
respond('<html lang="ja">
  <head>
    <title>Response</title>
        <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre.min.css">
    </head>
  <body class="text-dark p-2">
      <div class="container grid-lg">
            <div class="columns">
                <div class="column col-10">
                    <h1 class="text-success mt-4">Upload Successful</h1>
                    <br>
                    <p>asdf asdf</p>
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
'.format(url, json_encode(array)));
// Like a heredoc, chain the html with curly bracket placeholders to format()
// The order of vars passed to format matters