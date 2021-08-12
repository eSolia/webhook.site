#!/bin/bash
# Prepared by Rick Cogley 20181224
# Run by hookdoo
# For posting eSolia checkin from Slack to PROdb, and returning status to the same channel that was used
# Some variables set within Hookdoo hook setup - SLACKPAYLOAD, SLACKTOKEN, DBFLEXRESTTOKEN, PLOADUSER, PLOADCHAN, PLOADTEXT etc 

# Key point - Think of multiple people doing this simultaneously.  
# Payload like: token=0NJa7xQve0Do3XRmf2QDSogJ&team_id=TEGCR0ESU&team_domain=esolia&channel_id=CEH50BNTC&channel_name=cook&user_id=UEJGU184E&user_name=rickcogley&command=%2Fset&text=status%3A+testing&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FTEGCR0ESU%2F498801480769%2F6g41N0Ewa7Dt5Fj6qNFBcPlW&trigger_id=500805928502.492433014912.39f5221083202990149a932ba6b3f769

JQBIN="/home/rcogley/bin/jq"
RMBIN="/usr/bin/rm"
AWKBIN="/usr/bin/awk"
PHPBIN="/usr/local/bin/php"
PERLBIN="/usr/bin/perl"
OPENSSLBIN="/usr/bin/openssl"
CMPBIN="/usr/bin/cmp"
CURLBIN="/usr/bin/curl"
WORKINGDIR="/home/rcogley/webapps/hook_slack_01"
# WORKINGDIR="$HOME"
NOWTS=$(TZ=":Japan" date -d "today" +"%Y%m%d%H%M")
FILEPREFIX="eSolia-Status-${PLOADUSER}-"
BASESTRING="v0:${XSLACKREQUESTTIMESTAMP}:${SLACKPAYLOAD}"
HMACBASESTRING=$(echo -n ${BASESTRING} | ${OPENSSLBIN} sha256 -hmac ${SLACKSIGNINGSECRET} | ${AWKBIN} '{print $2}')
LOCALSLACKSIGNATURE="v0=${HMACBASESTRING}"

# Signature Debug
# echo ${BASESTRING} > ${WORKINGDIR}/signed.txt
# echo ${SLACKSIGNINGSECRET} >> ${WORKINGDIR}/signed.txt
# echo -n ${BASESTRING} | ${OPENSSLBIN} sha256 -hmac ${SLACKSIGNINGSECRET} | ${AWKBIN} '{print $2}' >> ${WORKINGDIR}/signed.txt
# echo ${HMACBASESTRING} >> ${WORKINGDIR}/signed.txt
# echo ${LOCALSLACKSIGNATURE} >> ${WORKINGDIR}/signed.txt
# echo ${XSLACKSIGNATURE} >> ${WORKINGDIR}/signed.txt

# Change to working directory
cd ${WORKINGDIR}
# source ${WORKINGDIR}/variables.local

# Exit if local signature does not match sent signature
if [ ${XSLACKSIGNATURE} != ${LOCALSLACKSIGNATURE} ]
  then
	echo "ERROR! Local hmac signature does not match received one!"
	echo "Received ${XSLACKSIGNATURE}"
	echo "Expected ${LOCALSLACKSIGNATURE}"
	exit 1
fi

# capture payload to file with timestamp
echo ${SLACKPAYLOAD} > ${WORKINGDIR}/${FILEPREFIX}${NOWTS}.out
# Parse url params to intermediate json
cat ${WORKINGDIR}/${FILEPREFIX}${NOWTS}.out | ${PHPBIN} -R 'parse_str($argn, $parsed); echo json_encode($parsed)."\n";' > ${WORKINGDIR}/${FILEPREFIX}intermediate-${NOWTS}.json
# Prep intermediate json for PROdb load
cat ${WORKINGDIR}/${FILEPREFIX}intermediate-${NOWTS}.json | ${JQBIN} '. | [.] | map(. + {"Slack Timestamp":(now|todateiso8601)}) | map(. + {"Slack Token": .token} | del(.token)) | map(. + {"Slack API App ID": .api_app_id} | del(.api_app_id)) | map(. + {"Slack Is Enterprise Install": .is_enterprise_install} | del(.is_enterprise_install)) |map(. + {"Slack Channel Id": .channel_id} | del(.channel_id)) | map(. + {"Slack Channel Name": .channel_name} | del(.channel_name)) | map(. + {"Slack Service Id": .service_id} | del(.service_id)) | map(. + {"Slack Team Domain": .team_domain} | del(.team_domain)) | map(. + {"Slack Team Id": .team_id} | del(.team_id)) | map(. + {"Slack Text": .text} | del(.text)) | map(. + {"Slack Command": .command} | del(.command)) | map(. + {"Slack Trigger Id": .trigger_id} | del(.trigger_id)) | map(. + {"Slack Response URL": .response_url} | del(.response_url)) | map(. + {"Slack User Id": .user_id} | del(.user_id)) | map(. + {"Slack User Name": .user_name} | del(.user_name))' > ${WORKINGDIR}/${FILEPREFIX}dbload-${NOWTS}.json
# Send to PROdb Status table
${CURLBIN} -X "POST" "https://pro.dbflex.net/secure/api/v2/15331/${DBFLEXRESTTOKEN}/Status/create.json" \
	 -H 'Content-Type: application/json; charset=utf-8' \
	 -d @${WORKINGDIR}/${FILEPREFIX}dbload-${NOWTS}.json

# Clean up intermediates but leave load json
${RMBIN} -rf ${WORKINGDIR}/${FILEPREFIX}${NOWTS}.out
${RMBIN} -rf ${WORKINGDIR}/${FILEPREFIX}intermediate-${NOWTS}.json

# ADD RESPONSE BACK

# Use a function because you can use variables in it
# Make sure heredoc token has NO SPACES after either one 
# and is the first thing on the line for the final one
# This POSTS AS APP

gen_curl_post_data() {
cat <<CATTEXT
{
  "text": "*${PLOADUSER}* is ${PLOADTEXT} <!here> :rocket:",
  "mrkdwn_in": [
				"text"
			]
}
CATTEXT
}

# DOING FROM PRODB INSTEAD
# ${CURLBIN} -X "POST" "${PLOADRESPONSEURL}" \
#     -H 'Content-Type: application/json' \
#     --data "$(gen_curl_post_data)"

# Create and send as user but sends as Rick due to token apparently...
# curl -X "POST" "https://slack.com/api/chat.postMessage" --data-urlencode "token=${SLACKTOKEN}" --data-urlencode "channel=${PLOADCHAN}" --data-urlencode "text=${PLOADTEXT} @here :rocket:" --data-urlencode "as_user=${PLOADUSER}" --data-urlencode "link_names=true" --data-urlencode "unfurl_links=true" --data-urlencode "pretty=1"

# Set user status VIA PRODB?

# Use a function because you can use variables in it
# Make sure heredoc token has NO SPACES after either one 
# and is the first thing on the line for the final one
# gen_curl_status_data() {
# cat <<CATSTAT
# {
#     "profile": {
#         "status_text": "${PLOADTEXT}",
#         "status_emoji": ":mega:",
#         "status_expiration": 0
#     }
# }
# CATSTAT
# }

# curl -X "POST" "https://slack.com/api/users.profile.set"  \
#      -H 'Content-Type: application/json; charset=utf-8' \
#      -H 'Authorization: Bearer xoxp_secret_token' \
#      --data "$(gen_curl_status_data)"
