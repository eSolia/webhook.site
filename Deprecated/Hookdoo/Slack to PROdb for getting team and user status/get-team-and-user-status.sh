#!/bin/bash
# Prepared by Rick Cogley 20181222
# Run by hookdoo
# For querying eSolia checkin info in PROdb, and returning status to the same channel that was used
# Some variables set within Hookdoo hook setup - SLACKPAYLOAD, SLACKTOKEN, DBFLEXRESTTOKEN, PLOADUSER, PLOADCHAN, PLOADTEXT etc 

# Key point - Think of multiple people doing this simultaneously.  
# Payload like: token=0NJa7xQve0Do3XRmf2QDSogJ&team_id=TEGCR0ESU&team_domain=esolia&channel_id=CEH50BNTC&channel_name=cook&user_id=UEJGU184E&user_name=rickcogley&command=%2Fweare&text=&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FTEGCR0ESU%2F504262587185%2FVphZxRZsqfI23M356PmBNCzQ&trigger_id=504262587201.492433014912.c2d123974972ab6c6e1233ac7f1eb7ff

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
FILEPREFIX="eSolia-GetStatus-${PLOADUSER}-"
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

# Check if text var is there

# capture payload to file with timestamp
echo ${SLACKPAYLOAD} > ${WORKINGDIR}/${FILEPREFIX}${NOWTS}.out

# if there is an arg
if [ -n "${PLOADTEXT}" ]; then
   # if the arg is all AND chan is specific
   if [ "${PLOADTEXT}" = "all" ] && [ "${PLOADCHANID}" = "GH9H3FD7V" ]; then
	  # get all statuses
	  ${CURLBIN} "GET" "https://pro.dbflex.net/secure/api/v2/15331/${DBFLEXRESTTOKEN}/Status/API%20List%20Latest/select.json" > ${WORKINGDIR}/${FILEPREFIX}intermediate1-${NOWTS}.json
   # if the arg is all but chan is other
   elif [ "${PLOADTEXT}" = "all" ] && [ "${PLOADCHANID}" != "GH9H3FD7V" ]; then
	  # Get all statuses from this Channel from PROdb
	  ${CURLBIN} "GET" "https://pro.dbflex.net/secure/api/v2/15331/${DBFLEXRESTTOKEN}/Status/API%20List%20Latest/select.json?filter=%5BSlack%20Channel%20Name%5D%20%3D%20%22${PLOADCHANNAME}%22" > ${WORKINGDIR}/${FILEPREFIX}intermediate1-${NOWTS}.json
   # if the arg is not all but another
   elif [ "${PLOADTEXT}" != "all" ]; then
	  # Get statuses assuming searched user string
	  ${CURLBIN} "GET" "https://pro.dbflex.net/secure/api/v2/15331/${DBFLEXRESTTOKEN}/Status/API%20List%20Latest/select.json?filter=Contains(%5BSlack%20User%20Name%5D%2C%22${PLOADTEXT}%22)" > ${WORKINGDIR}/${FILEPREFIX}intermediate1-${NOWTS}.json
   else
	  # Get statuses assuming searched user string
	  ${CURLBIN} "GET" "https://pro.dbflex.net/secure/api/v2/15331/${DBFLEXRESTTOKEN}/Status/API%20List%20Latest/select.json?filter=Contains(%5BSlack%20User%20Name%5D%2C%22${PLOADTEXT}%22)" > ${WORKINGDIR}/${FILEPREFIX}intermediate1-${NOWTS}.json
   fi
# if there is no arg
else
   # Get all statuses from this Channel from PROdb
   ${CURLBIN} "GET" "https://pro.dbflex.net/secure/api/v2/15331/${DBFLEXRESTTOKEN}/Status/API%20List%20Latest/select.json?filter=%5BSlack%20Channel%20Name%5D%20%3D%20%22${PLOADCHANNAME}%22" > ${WORKINGDIR}/${FILEPREFIX}intermediate1-${NOWTS}.json
fi

# Filter the json for status
cat ${WORKINGDIR}/${FILEPREFIX}intermediate1-${NOWTS}.json | ${JQBIN} --raw-output '.[] | ."Status String"' > ${WORKINGDIR}/${FILEPREFIX}intermediate2-${NOWTS}.out
# Flatten actual cr to literal backslash n and put in variable
SLOADTEXT=$(cat ${WORKINGDIR}/${FILEPREFIX}intermediate2-${NOWTS}.out | ${AWKBIN} -v ORS='\\n' '1')

# ADD RESPONSE BACK

# Use a function because you can use variables in it
# Make sure heredoc token has NO SPACES after either one 
# and is the first thing on the line for the final one
# This POSTS AS APP
gen_curl_post_data() {
cat <<CATTEXT
{
  "text": "${SLOADTEXT}",
  "mrkdwn_in": [
				"text"
			]
}
CATTEXT
}
${CURLBIN} -X "POST" "${PLOADRESPONSEURL}" \
	 -H 'Content-Type: application/json' \
	 --data "$(gen_curl_post_data)"


# Clean up intermediates but leave load json
# ${RMBIN} -rf ${WORKINGDIR}/${FILEPREFIX}${NOWTS}.out
# ${RMBIN} -rf ${WORKINGDIR}/${FILEPREFIX}intermediate-${NOWTS}.json

# KEEP THE BELOW FOR REFERENCE FOR NOW

# Create and send as user
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
