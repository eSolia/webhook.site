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
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
  <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://assets.esolia.com/mgj/components-v2.css?id=ce239bc44ec92ee60098" />
  <script src="https://assets.esolia.com/mgj/components-v2.js?id=a5b939e76670659191b6"></script>
  <script src="https://assets.esolia.com/mgj/iframe.js?id=1b0c2717805a0c9fbb06"></script>
  <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.3.5/dist/alpine.js" defer></script>
</head>
<style>
  .kc-bg-color-11 {background-color:#007bb7;}
  .kc-bg-color-10 {background-color:#00619d;}
  .kc-bg-color-20 {background-color:#a3e0e6;}
  .kc-bg-color-21 {background-color:#00a0b4;}
  .kc-bg-color-30 {background-color:#f08527;}
  .kc-bg-color-31 {background-color:#e54f07;}
  .kc-bg-color-40 {background-color:#c1c5c8;}
  .kc-bg-color-41 {background-color:#3f4346;}
  
  .kc-color-10 {
    color:#c1c5c8;
    background-color:#f08527}

  .kc-color-11 {
    color:#dbdfe2;
    background-color:#f08527}

  .kc-color-20 {
    color:#dbdfe2;
    background-color:#00619d}

  .kc-color-30 {
    color:#c1c5c8;
    background-color:#00bace}
   
  .kc-color-31 {
    color:#3f4346;
    background-color:#a3e0e6}

  .kc-color-40 {
    color:#3f4346;}   

  .kc-color-50 {
    color:#3f4346;} 



  .kc-button-10 {
    color:#dbdfe2;
    background-color:#f08527}
  
  .kc-button-10:hover {
    opacity: 0.5;
  }

  .kc-button-20 {
    color:#dbdfe2;
    background-color:#00619d}

  .kc-button-20:hover {
    opacity: 0.5;
  }
  

  
</style>

<body class="">
<div class="min-h-screen kc-color-20">
  <div class="kc-color-20 pb-32">
    <nav class="kc-bg-color-20 border-b border-blue-300 border-opacity-25 lg:border-none">
      <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div class="relative h-16 flex items-center justify-between lg:border-b lg:border-blue-400 lg:border-opacity-25">
          <div class="px-2 flex items-center lg:px-0">
            <div class="flex-shrink-0">
              <img class="block h-8 w-20" src="https://assets.esolia.com/mgj/myriad-logo.png" alt="eSolia">
            </div>
            
          </div>
          <div class="px-2 justify-end flex items-center lg:px-0">
            <div class="hidden lg:block text-white lg:ml-20">
              <!-- Current: "bg-indigo-700 text-white", Default: "text-white hover:bg-indigo-500 hover:bg-opacity-75" -->
                <a href="https://db.myriadgenetics-ops.com/secure/db/74559/overview.aspx?t=724298" class="kc-button-20 rounded-md py-2 px-3 text-sm font-medium m-1">
                  OES
                </a>
            </div>
          </div>

        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state. -->
      <div class="lg:hidden" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <!-- Current: "bg-indigo-700 text-white", Default: "text-white hover:bg-indigo-500 hover:bg-opacity-75" -->
          <a href="https://db.myriadgenetics-ops.com/secure/db/74559/overview.aspx?t=724298" class="kc-button-20 block rounded-md py-2 px-3 text-base font-medium">
            OES
          </a>


        </div>

      </div>
    </nav>
    <header class="py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold kc-color-20">
          ミリアド ・ ジェネティクス
        </h1>
        <p class="kc-color-20">OESアカウントロード入力</p>
      </div>
    </header>
  </div>

  <main class="-mt-32">
    <div class="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
      
<div class="relative bg-white">
    <div class="absolute inset-0">
      <div class="absolute inset-y-0 left-0 w-1/2 bg-gray-50"></div>
    </div>
    <div class="relative max-w-7xl mx-auto lg:grid lg:grid-cols-5">
      <div class="bg-gray-50 py-16 px-4 sm:px-6 lg:col-span-2 lg:px-8 lg:py-24 xl:pr-12">
        <div class="max-w-lg mx-auto">
          <h2 class="text-2xl font-extrabold tracking-tight kc-color-40 sm:text-3xl">
            使い方
          </h2>
          <p class="mt-3 text-lg leading-6 text-gray-500">
            分子商品は、さまざまな商品分子の分野を革新する対応的なニーズサポート開発法を開発し、革新し、ミリ化しことによって、アドさん一人一人をするたニーズの開発をするていた。
          </p>
          
        </div>
      </div>
      <div class="bg-white py-16 px-4 sm:px-6 lg:col-span-3 lg:py-24 lg:px-8 xl:pl-12">
        <div class="max-w-lg mx-auto lg:max-w-none">
          <form action="{}" method="POST" class="grid grid-cols-1 gap-y-6 text-gray-500" enctype="multipart/form-data">
            <div>
              <label for="initials" class="sr-only">イニシャル</label>
              <select name="initials" id="initials" autocomplete="initials" class="block w-full shadow-sm py-3 px-4 placeholder-gray-900 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" placeholder="イニシャル">
                <option>YK</option>
                <option>KC</option>
                <option>JRC</option>
                <option>Myriad</option>
                <option>eSolia</option>
              </select>
            </div>
            <div>
              <label for="job" class="sr-only">ジョブ</label>
              <input type="text" id="job" name="job" class="block w-full shadow-sm py-3 px-4 placeholder-gray-900 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" placeholder="ジョブ" value="{}">
            </div>
            <div class="text-sm font-semibold px-3 py-2 rounded-md hover:bg-gray-100">
              <label for="file" class="sr-only">File</label>
              <input class="rounded" type="file" id="csvfile" name="file">
            </div>
            <div>
              <button type="submit" class="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md kc-button-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                送信
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  
      <!-- /End replace -->
    </div>
  </main>

<!-- This example requires Tailwind CSS v2.0+ -->
<footer class="kc-color-31">
  <div class="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
    <nav class="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
      <div class="px-5 py-2">
        <a href="https://esolia.co.jp/about/" class="text-base hover:text-gray-900">
          会社概要
        </a>
      </div>

      <div class="px-5 py-2">
        <a href="https://esolia.co.jp/services/" class="text-base hover:text-gray-900">
          サービス
        </a>
      </div>

      <div class="px-5 py-2">
        <a href="https://esolia.co.jp/solutions/" class="text-base hover:text-gray-900">
          ソリューション
        </a>
      </div>

      <div class="px-5 py-2">
        <a href="https://esolia.co.jp/success-stories/" class="text-base hover:text-gray-900">
          成功事例
        </a>
      </div>

      <div class="px-5 py-2">
        <a href="https://esolia.co.jp/post/" class="text-base hover:text-gray-900">
          ニュース
        </a>
      </div>

      <div class="px-5 py-2">
        <a href="https://esolia.co.jp/privacy/" class="text-base hover:text-gray-900">
          プライバシー
        </a>
      </div>
    </nav>
    <div class="kc-color-31　mt-8 flex justify-center space-x-6">

      <a href="https://twitter.com/esolia_inc" class="hover:text-gray-500">
        <span class="sr-only">Twitter</span>
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      </a>


      <a href="http://www.linkedin.com/company/esolia-inc" class="hover:text-gray-500">
        <span class="sr-only">LinkedIn</span>
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3
          C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548
          c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669
          v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037
          c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z"/>
        </svg>
      </a>

    </div>
    <p class="mt-8 text-center text-base kc-color-31">
      &copy; 1999-2021 株式会社イソリア All Rights Reserved.
    </p>
  </div>
</footer>
</div>
</body>
</html>'.format(url,jobdate));
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

