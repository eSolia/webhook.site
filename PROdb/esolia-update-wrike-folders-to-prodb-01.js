// Call from github 
// result = import('https://raw.githubusercontent.com/RickCogley/webhook.site/master/PROdb/esolia-update-wrike-folders-to-prodb-01.js')
// echo(result) 

// Configuration
prodb_token = var('g_prodb_token');
wrike_token = var('g_wrike_token');
prodb_task_upsert_url = var('g_prodb_task_upsert_url');
prodb_tasktask_upsert_url = var('g_prodb_tasktask_upsert_url');
prodb_change_log_create_url = var('g_prodb_change_log_create_url');
prodb_wmstatus_listall_select_url = var('g_prodb_wmstatus_listall_select_url');
prodb_wmstatus_upsert_url = var('g_prodb_wmstatus_upsert_url');
prodb_wmfolder_upsert_url = var('g_prodb_wmfolder_upsert_url');
wrike_workflows_url = var('g_wrike_workflows_url');
wrike_folders_url = var('g_wrike_folders_url');


// Get Wrike Workflows
echo("GET WRIKE FOLDERS");
wrike_folders_response = request(
  wrike_folders_url,
  '',
  'GET',
  ['Content-Type: application/json',
   'Authorization: bearer '+ wrike_token
  ]
)

// Prep data
wresp = wrike_folders_response['content'];
wrespdata = json_path(wresp,'data[]');
// dump(wrespdata);
// Make blank array
transformed = [];
// Loop over data and prepare array
echo("LOOP OVER DATA");
for (subObject in wrespdata) {
  // initialize vars
  paid = "";
  pcsid = "";
  poids = "";
  psd = "";
  ped = "";
  pcts = "";
  // if the array has a project sub object, then set proj vars 
  if (array_has(subObject, 'project')) {
     paid = subObject['project']['authorId'];
     pcsid = subObject['project']['customStatusId'];
     poids = string_join(' | ', array_get(subObject['project'], 'ownerIds', ""));
     psd = array_get(subObject['project'], 'startDate', "");
     ped = array_get(subObject['project'], 'endDate', "");
     pcts = array_get(subObject['project'], 'createdDate', "");
  }
  // array_push into transformed array created above
  array_push(transformed, [
        'f_17968085': subObject['id'],
        'Title': subObject['title'],
        'Scope': subObject['scope'],
        'Project Author Id': paid,
        'Project Owner Ids': poids,
        'Project Custom Status Id': pcsid,
        'Project Start Date': psd,
        'Project End Date': ped,
        'Project Created TS': pcts
      ])
}
echo("TRANSFORM ARRAY TO JSON AND PUSH TO PRODB");
// echo json to be sent to prodb wmstatus table
// dump(transformed);
echo(json_encode(transformed));
transformed_json = json_encode(transformed);
// upsert to prodb
prodb_wmfolder_response = request(
  prodb_wmfolder_upsert_url,
  transformed_json,
  'POST',
  ['Content-Type: application/json',
   'Authorization: bearer '+ prodb_token
  ]
)
if (prodb_wmfolder_response['status'] = 200) {
    respond('Loaded to PROdb', 200);
}
