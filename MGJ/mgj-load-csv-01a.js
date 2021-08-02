// Call from github 
//result = import('https://raw.githubusercontent.com/RickCogley/webhook.site/master/MGJ/mgj-load-csv-01a.js')
//echo(result) 

// ONE - Show HTML Page if GET for Collection
echo("START SCRIPT ONE - INITIAL HTML FROM GET");

// Configuration
matchuser = var('g_basic_auth_user_02');
matchpass = var('g_basic_auth_pw_02');
entereduser = var('request.header.php-auth-user');
enteredpass = var('request.header.php-auth-pw');
url = var('request.url');
echo(url);
set('pass_url', url)

// get date for job number keeping Japan TZ
jobdate = 'now'.date_format('YYYY-MM-DD-HHmm', null, 'GMT+9', true)

// setup authenticate function to be DRY
function authenticate() {
    respond('', 401, [
        'WWW-Authenticate: Basic realm="Login to Myriad M-SODAS New User CSV Upload URL"'
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




if (var('request.method') != 'POST') {
  respond('<html lang="ja">
<head>
  <title>MGJ OESのCSVアップロード</title>
 <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre.min.css">
</head>
<body class="text-dark p-2">
    <div class="container grid-lg">
          <div class="columns">
              <div class="column col-10">
                <header class="navbar bg-gray p-2 my-2">
                  <section class="navbar-section">
                    <a href="https://db.myriadgenetics-ops.com/secure/db/74559/overview.aspx?t=724298" class="navbar-brand mr-2"><img class="img-responsive" src="https://assets.esolia.com/mgj/myriad_V_horiz_428px.png" alt="Myriad Logo" width="200px"></a>
                  </section>
                  <section class="navbar-section">
                    <a href="https://db.myriadgenetics-ops.com/secure/db/74559/overview.aspx?t=724298" class="btn btn-link">M-SODAS</a>
                  </section>
                </header>
                <h1 class="text-success mt-4">M-SODASのCSVアップロード</h1>
              <p>この webhook.site URLは、新規ユーザーデータの入った、決まった形式のCSVを受け付けて、様々な変換してからM-SODAS PROdbにアップしてくれます。</p>
              <br>
              <!-- form input control -->
              <form onSubmit="document.getElementById(\'submit\').disabled=true;" action="{}" method="POST" enctype="multipart/form-data" class="form-horizontal">
                <div class="form-group">
                  <div class="col-3 col-sm-12">
                    <label class="form-label" for="csv-load">イニシャル選択</label>
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
                    <label class="form-label" for="jobdate">ジョブ日時</label>
                  </div>
                  <div class="col-9 col-sm-12">
                    <input class="form-input" type="text" name="jobdate" id="jobdate" placeholder="Job Date" value="{}" />
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-3 col-sm-12">
                    <label class="form-label" for="csv-load">CSV選択</label>
                  </div>
                  <div class="col-9 col-sm-12">
                    <div class="input-group">
                      <input class="form-input input-group-addon" id="inputfile" type="file" name="file" />
                      <button class="btn btn-success input-group-btn c-hand btn-lg" type="submit" id="submit">CSV送信</button>
                    </div>
                  </div>
                </div>

                
              </form>
              
              </div>
          </div>
      </div>
</body>
</html>'.format(url,jobdate));
}
// Like a heredoc, chain the html with curly bracket placeholders to format()
// The order of vars passed to format matters

// See and capture the form request
echo(var('request.form.jobdate'));
echo(var('request.form.initials'));
forminit = var('request.form.initials');
formjd = var('request.form.jobdate');
jobstring = forminit + "-" + formjd;
set('pass_jobstring', jobstring)

// Use a comma as delimiter and treat first row (0) as header row
csv_content = var('request.file.file.content')

echo("replace 0 with ZZEERROO in csv");
csv_nozero = string_replace(csv_content,"0","ZZEERROO");
set('pass_csv_nozero', csv_nozero);

echo("END SCRIPT ONE - INITIAL HTML FROM GET");

