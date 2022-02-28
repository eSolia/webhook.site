// Call from github
//result = import('https://raw.githubusercontent.com/RickCogley/webhook.site/master/MGJ/mgj-load-csv-01c.js')
//echo(result)

// THREE - Show Results
echo("START SCRIPT THREE - SHOW RESULTS");

// Configuration
// Need jobstring,url,arraymyracct_json,arraynewextuser_json
jobstring = var('pass_jobstring');
arraymyracct_json = var('pass_arraymyracct_json');
arraynewextuser_json = var('pass_arraynewextuser_json');
url = var('pass_url');

// Display the parsed CSV in JSON format 
respond('<html lang="ja">
  <head>
	<title>M-SODAS再検査管理レコードCSVアップロード結果</title>
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
				 <h1 class="text-error mt-4">CSVアップロード完了</h1>
				 <p>アップロードしたCSVがM-SODAS PROdbに渡され、現在ジョブ「{}」がバックグラウンドで処理中 (データ量とタイミングによって少々お時間かかる場合もあります)。<br><br>
				 当画面を閉じて頂くか、次のボタンで最初の画面に戻り、別のCSVをアップロードすることができます。</p>
				 <br>
				 <p><button class="btn btn-error c-hand"><a href="{}" class="text-light">別のCSVアップロードする</a></button></p>
					
				</div>
			</div>
		</div>
  </body>
</html>
'.format(jobstring,url));
// Like a heredoc, chain the html with curly bracket placeholders to format()
// The order of vars passed to format matters

echo("END SCRIPT THREE - SHOW RESULTS");
