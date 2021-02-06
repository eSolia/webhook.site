// Call from github 
// result = import('https://raw.githubusercontent.com/RickCogley/webhook.site/master/PROdb/esolia-convert-markdown-to-html.js')
// echo(result) 

// Prep 
decodedreq = html_decode(var("request.content"));
echo(decodedreq);
md = markdown_to_html(decodedreq);
echo(md);
