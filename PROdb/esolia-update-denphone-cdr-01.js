// Call from github 
// result = import('https://raw.githubusercontent.com/RickCogley/webhook.site/master/PROdb/esolia-update-denphone-cdr-01.js')
// echo(result) 

// Example
// curl -utoken: "https://cloudapps.denphone.com/cloudapi/cdrcompanycallcharges/v1/view?periodyear=YYYY&periodmonthofyear=MM"

// EXIT script if today not day 01 in month
// echo("Confirming day of month...");
// rightnow = 'now'.to_date();
// daynow = date_format(rightnow, 'DD');
// if (daynow != "01") {
//  echo("Not day 01 in month; exiting");
// 	respond("Not day 01 in month; exiting", 500);
// }

// Configuration
denphone_token_esolia_01_b64 = var('g_denphone_token_esolia_01_b64');
denphone_getcdrcharges_url = var('g_denphone_getcdrcharges_url');
prodb_prodb_cdr_upsert_url = var('g_prodb_cdr_upsert_url');
prodb_token = var('g_prodb_token');
lastmo = 'last month'.to_date();
lastmoyyyy = date_format(lastmo, 'YYYY');
lastmomm = date_format(lastmo, 'MM');
//for manual
//qyr = "2020"
//qmo = "06"

// Send request to Web Service 1, using format() for string placeholders
urlparams = '?periodyear={}&periodmonthofyear={}'.format(
  lastmoyyyy,
  lastmomm
)

echo(urlparams);
requrl = denphone_getcdrcharges_url + urlparams;
echo(requrl);

dp_response = request(
    requrl,
    '',
    'POST',
    ['Authorization: Basic ' + denphone_token_esolia_01_b64]
)

dp_response_content = dp_response['content'];
decoded = json_decode(dp_response_content);
encoded = json_encode(decoded);
echo(encoded);
encoded_2 = string_replace(encoded, "\\\"\\\"", "");
echo(encoded_2);

array = json_decode(encoded_2);
dump(array);
// Make blank array
array2 = [];
// Loop over data and prepare array
echo("LOOP OVER ARRAY and PREP FOR PRODB");
for (subObject in array) {
    //dump(subObject['Cdrcompanycallcharge']['cdrid']);
    // date/time 11413525
    // duration/secs 11413516
    array_push(array2, [
      'Id': subObject['Cdrcompanycallcharge']['cdrid'],
      'CompanyName': subObject['Cdrcompanycallcharge']['companyname'],
      'f_11413525': subObject['Cdrcompanycallcharge']['callchargedatetime'],
      'f_11413516': subObject['Cdrcompanycallcharge']['billableseconds'],
      'OriginalNumber': subObject['Cdrcompanycallcharge']['originalnumber'],
      'PhoneNumber': subObject['Cdrcompanycallcharge']['phonenumber'],
      'CallerId': subObject['Cdrcompanycallcharge']['callerid'],
      'CallerIdFull': subObject['Cdrcompanycallcharge']['calleridfull'],
      'Dest': subObject['Cdrcompanycallcharge']['rateref'], 
      'Currency': subObject['Cdrcompanycallcharge']['currency'],
      'Cost': subObject['Cdrcompanycallcharge']['callchargeamount']
    ])
}

echo("TRANSFORM ARRAY2 TO JSON AND PUSH TO PRODB");
array2_json = json_encode(array2);
// echo json to be sent to prodb cdr table
echo(array2_json);

// upsert to prodb
prodb_cdrupsert_response = request(
  prodb_prodb_cdr_upsert_url,
  array2_json,
  'POST',
  ['Content-Type: application/json',
   'Authorization: bearer '+ prodb_token
  ]
)

