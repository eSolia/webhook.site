if (var('request.method') != 'POST') {
  respond('<html lang="ja">
<head>
  <title>M-SODASダッシュボード</title>
 <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre.min.css">
</head>
<body class="text-dark p-2">
    <div class="container grid-lg">
        <div class="columns">
            <div class="column col-12">
            
                <header class="navbar bg-gray p-2 my-2">
                  <section class="navbar-section">
                    <a href="https://db.myriadgenetics-ops.com/secure/db/74559/overview.aspx?t=724298" class="navbar-brand mr-2"><img class="img-responsive" src="https://assets.esolia.com/mgj/myriad_V_horiz_428px.png" alt="Myriad Logo" width="200px"></a>
                  </section>
                  <section class="navbar-section">
                    <a href="https://db.myriadgenetics-ops.com/secure/db/74559/overview.aspx?t=724298" class="btn btn-link">M-SODAS</a>
                  </section>
                </header>
                
                <h1 class="text-dark mt-4">M-SODASダッシュボード</h1>

              　<div class="columns">
                  <div class="column col-6 col-xs-12">
                    <div class="card">
                      <div class="card-image"><img class="img-responsive img-fit-contain" src="https://assets.esolia.com/mgj/doctor-unsplash3.jpeg" alt="OS X El Capitan"></div>
                      <div class="card-header">
                        <div class="card-title text-success h5">新規外部ユーザー</div>
                        <div class="card-subtitle text-gray">CSVデータのアップロード</div>
                      </div>
                      <div class="card-body">CSVをロードすることによって、新規外部ユーザーレコードを作成する。</div>
                      <div class="card-footer"><a class="btn btn-success" target="_blank" href="https://hooks.esolia.pro/msodas-load-users-01">ロードページへ移る</a></div>
                    </div>
                  </div>
                  <div class="column col-6 col-xs-12">
                    <div class="card">
                      <div class="card-image"><img class="img-responsive img-fit-contain" src="https://assets.esolia.com/mgj/test-cdc-unsplash3.jpeg" alt="OS X El Capitan"></div>
                      <div class="card-header">
                        <div class="card-title text-error h5">再検査管理</div>
                        <div class="card-subtitle text-gray">CSVデータのアップロード</div>
                      </div>
                      <div class="card-body">CSVをロードすることによって、再検査管理レコードを作成する。</div>
                      <div class="card-footer"><a class="btn btn-error" target="_blank" href="https://hooks.esolia.pro/msodas-load-retests-01">ロードページへ移る</a></div>
                    </div>
                  </div>
                </div>
                
            </div>
        </div>
    </div>
</body>
</html>'.format());
}
// Like a heredoc, chain the html with curly bracket placeholders to format()
// The order of vars passed to format matters
