// Return CSV

subst_epoch = var('request.query.e');
echo("Request url param subst epoch: " + subst_epoch);
hash_str = var('request.query.h');
echo("Request url param hash: " + hash_str);



//string_replace(string subject, string search, string replace)
//Replace(Replace(Replace([Expires Epoch Time],"1","T"),"5","A"),"0","E") 
epoch = string_replace(string_replace(string_replace(subst_epoch,"E","0"),"A","5"),"T","1");
echo("Orig epoch: " + epoch);
//1631491200
echo(base64_encode(epoch));
echo(bin2hex(epoch));
echo(bin2hex(hash_str));


dece = bin2hex(base64_decode(epoch));
echo(dece);

echo("md5 of orig epoch: " + hash(epoch, "md5"));
echo(bin2hex(hash(epoch, "md5")));
echo(hash(hash_str, "md5"));
echo("bin2hex of hash of hash_str: " + bin2hex(hash(hash_str, "md5")));

echo('1631404800'.hash('md5'));
echo("constant md5 hash: " + '1631491200'.hash('md5'));
echo("epoch md5: " + epoch.hash('md5'));
echo("base64 of epoch md5: " + base64_encode(epoch.hash('md5')));
echo("base64 of hash md5: " + bin2hex(hash_str.hash('md5')));


echo('now'.date_format('x'))
echo(now());


// since you can't unhash md5, probably obscure the date, then unobscure it, and do math to find out if it's ok

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

