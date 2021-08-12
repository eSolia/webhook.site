#!/bin/bash
# Prepared by Rick Cogley 20181224
# Run by hookdoo
# For searching PROdb contacts from Slack, returning the found contact list to the channel
# Some variables set within Hookdoo hook setup - SLACKPAYLOAD, SLACKTOKEN, DBFLEXRESTTOKEN, PLOADUSER, PLOADCHAN, PLOADTEXT etc 

JQBIN="/home/rcogley/bin/jq"
RMBIN="/usr/bin/rm"
AWKBIN="/usr/bin/awk"
PHPBIN="/usr/local/bin/php"
PERLBIN="/usr/bin/perl"
OPENSSLBIN="/usr/bin/openssl"
CMPBIN="/usr/bin/cmp"
CURLBIN="/usr/bin/curl"
WORKINGDIR="/home/rcogley/webapps/hook_slack_search_01"
# WORKINGDIR="$HOME"
NOWTS=$(TZ=":Japan" date -d "today" +"%Y%m%d%H%M")
FILEPREFIX="eSolia-Contacts-${PLOADUSER}-"
BASESTRING="v0:${XSLACKREQUESTTIMESTAMP}:${SLACKPAYLOAD}"
HMACBASESTRING=$(echo -n ${BASESTRING} | ${OPENSSLBIN} sha256 -hmac ${SLACKSIGNINGSECRET} | ${AWKBIN} '{print $2}')
LOCALSLACKSIGNATURE="v0=${HMACBASESTRING}"
# Bash parameter substitution
CMDNAME=$(echo ${SLACKTEXT} | ${AWKBIN} -F' ' '{print $1}')
CMDNAMESP="${CMDNAME} "
SEARCHSTR=${SLACKTEXT#"$CMDNAMESP"}
SEARCHSTRENC=$(${PHPBIN} -r "echo urlencode(\"$SEARCHSTR\");")

# Change to working directory
cd ${WORKINGDIR}

# Exit if local signature does not match sent signature
if [ ${XSLACKSIGNATURE} != ${LOCALSLACKSIGNATURE} ]
  then
	echo "ERROR! Local hmac signature does not match received one!"
	echo "Received ${XSLACKSIGNATURE}"
	echo "Expected ${LOCALSLACKSIGNATURE}"
	exit 1
fi

# Compare as lowercase with comma comma
if [ ${CMDNAME,,} = "contacts" ]; then

# Search a contact from PROdb
	${CURLBIN} "GET" "https://pro.dbflex.net/secure/api/v2/15331/${DBFLEXRESTTOKEN}/Contact/API%20Search%20Contacts/select.json?filter=Contains(%5BDisplay%20Name%20-%20Key%20Info%204%5D%2C%22${SEARCHSTRENC}%22)&top=20" > ${WORKINGDIR}/${FILEPREFIX}searchresult1-${NOWTS}.json

else
# Get all statuses in Channel from PROdb
	exit 1
fi

# Filter the json for status
cat ${WORKINGDIR}/${FILEPREFIX}searchresult1-${NOWTS}.json | ${JQBIN} --raw-output '.[] | ."Display Name - Key Info 4"' > ${WORKINGDIR}/${FILEPREFIX}intermediate2-${NOWTS}.out
# Flatten actual cr to literal backslash n and put in variable
SRESPTEXT=$(cat ${WORKINGDIR}/${FILEPREFIX}intermediate2-${NOWTS}.out | ${AWKBIN} -v ORS='\\n' '1')

# ADD RESPONSE BACK

# Use a function because you can use variables in it
# Make sure heredoc token has NO SPACES after either one 
# and is the first thing on the line for the final one
# This POSTS AS APP
gen_curl_post_data() {
cat <<CATTEXT
{
  "text": "${SRESPTEXT}",
  "mrkdwn_in": [
				"text"
			]
}
CATTEXT
}
${CURLBIN} -X "POST" "${SLACKRESPONSEURL}" \
	 -H 'Content-Type: application/json' \
	 --data "$(gen_curl_post_data)"

# Cleanup

rm -rf ${WORKINGDIR}/${FILEPREFIX}searchresult1-${NOWTS}.json
rm -rf ${WORKINGDIR}/${FILEPREFIX}intermediate2-${NOWTS}.out
