// Call from github 
// result = import('https://raw.githubusercontent.com/RickCogley/webhook.site/master/PROdb/esolia-convert-markdown-to-html.js')
// echo(result) 

// Prep 
// decd = html_decode(var("request.content"));
decd = string_replace(var("request.content"), "<br />","\n");


echo(decd);
md = markdown_to_html(decd);
echo(md);
