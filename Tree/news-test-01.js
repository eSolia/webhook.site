//dd("bypass");

// config
// コンフィグ
prodb71237_token = var('g_prodb71273_token');
prodb71273_news_listchanged_url = var('g_prodb71273_news_listchanged_url');

// pull the page_id from Tree payload (none means it's the home page so it is blank)
// Treeからのペイロードの、page_idを引っ張ってみる (無しならホームページ)
pageid = json_path(var('$request.content$'), '.page_id');
echo(pageid);

if (pageid == "") {
    echo("pageid is unset therefore Home Page");
    
    
    
    seedjsonstatic = '{
	"code": 200,
	"title": "ニュース",
	"blocks": [{
			"type": "heading3",
			"value": "ニュースの一覧"
		},
		{
			"type": "text",
			"value": "最新のニュースです。下記の一覧をご覧ください。"
		},
		{
			"type": "divider"
		},
		{
			"type": "collection",
			"value": {
				"items": [{
						"newsid": "123asdf",
						"title": "何かのニュースですよ",
						"description": "lorem ipsum dolor...",
						"photo": "https://source.unsplash.com/800x600/?forest"
					},
					{
						"newsid": "345asdf",
						"title": "もう一つのニュースですよ",
						"description": "lorem ipsum dolor...",
						"photo": "https://source.unsplash.com/800x600/?beach"
					},
					{
						"newsid": "456asdf",
						"title": "さらにもう一つのニュースですよ",
						"description": "lorem ipsum dolor...",
						"photo": "https://source.unsplash.com/800x600/?mountain"
					}
				]
			},
			"attrs": {
				"viewType": "gallery",
				"itemSize": "large",
				"renderItem": {
					"blocks": [{
							"type": "image",
							"value": "${get(item, \'photo\')}"
						},
						{
							"type": "heading4",
							"value": "${get(item, \'title\')}"
						},
						{
							"type": "button",
							"value": "Like"
						}
					]
				}
			}
		},
		{
			"type": "divider"
		}
	]
}'

// Return response to Tree
// Treeへ、レスする
echo("Send response to Tree");
echo(seedjsonstatic);
// set CORS header
// CORSヘッダー設定
headers = ["Access-Control-Allow-Origin: *","Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS","Access-Control-Allow-Headers: Authorization, Accept, Content-Type"];
// respond with the page's json
// 選ばれたページを返す

result = import('https://raw.githubusercontent.com/fredsted/webhookscripts/ec22946a83ea85f607fcc6bff83f9d81ed2fe4ed/hello_world.ws')
echo(result) // value


//respond(ret_content, 200, headers);
respond(seedjsonstatic, 200, headers);

echo("END if statement checking if home page");
};
