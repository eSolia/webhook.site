#!/bin/sh

# Run by hookdoo but script runs on attached server
# Purpose is to get params from Slack and send a fax for testing

# Prepared by Rick Cogley 20181226
# Run by hookdoo
# For sending Faxes via a Slack slash command, and Denphone outbound fax service
# Some variables set within Hookdoo hook setup - SLACKPLOAD, SLACKTEXT etc
# Payload: token=0NJa7xQve0Do3XRmf2QDSogJ&team_id=TEGCR0ESU&team_domain=esolia&channel_id=GEXQBH1HU&channel_name=acme&user_id=UEJGU184E&user_name=rickcogley&command=%2Ftestfax&text=0335933511+a+comment&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FTEGCR0ESU%2F511189732294%2F2Ho9IXWxYuYRXsSfF5eT3ElD&trigger_id=510841322855.492433014912.9c244ac21d4fe25f33cf4ca19ee84059

JQBIN="/home/rcogley/bin/jq"
RMBIN="/usr/bin/rm"
AWKBIN="/usr/bin/awk"
PHPBIN="/usr/local/bin/php"
PERLBIN="/usr/bin/perl"
OPENSSLBIN="/usr/bin/openssl"
CMPBIN="/usr/bin/cmp"
CURLBIN="/usr/bin/curl"
MAILBIN="/usr/bin/mailx"
WORKINGDIR="/home/rcogley/webapps/hook_slack_fax_01"
# WORKINGDIR="$HOME"
NOWTS=$(TZ=":Japan" date -d "today" +"%Y%m%d%H%M")
NOWTSHUMAN=$(TZ=":Japan" date)
FILEPREFIX="eSolia-Slack2Fax-"
FAXNUM=$(echo ${SLACKTEXT} | ${AWKBIN} -F' ' '{print $1}')
FAXNUMSP="${FAXNUM} "
COMMENTSTR=${SLACKTEXT#"$FAXNUMSP"}
FAXFROM="03-4577-3309"
# Obfuscate channel name with xxd
CHANXXD=$(echo ${SLACKCHANNAME} | xxd -ps -c 200 | tr -d '\n')
# Obfuscate channel name with simple atbash cipher
CHANATBASH=$(echo ${SLACKCHANNAME} | tr abcdefghijklmnopqrstuvwxyz zyxwvutsrqponmlkjihgfedcba)
# echo "thestring" | xxd -ps -r
EMAILFROM="eSolia Fax<fax@esolia.net>"
BASESTRING="v0:${XSLACKREQUESTTIMESTAMP}:${SLACKPLOAD}"
HMACBASESTRING=$(echo -n ${BASESTRING} | ${OPENSSLBIN} sha256 -hmac ${SLACKSIGNINGSECRET} | ${AWKBIN} '{print $2}')
LOCALSLACKSIGNATURE="v0=${HMACBASESTRING}"

# Exit if local signature does not match sent signature
if [ ${XSLACKSIGNATURE} != ${LOCALSLACKSIGNATURE} ]
  then
	echo "ERROR! Local hmac signature does not match received one!"
	echo "Received ${XSLACKSIGNATURE}"
	echo "Expected ${LOCALSLACKSIGNATURE}"
	exit 1
fi

cd ${WORKINGDIR}

# echo ${SLACKPLOAD} > ${WORKINGDIR}/${FILEPREFIX}payload-${NOWTS}.out
# cat ${WORKINGDIR}/${FILEPREFIX}payload-${NOWTS}.out | ${PHPBIN} -R 'echo urldecode($argn)."\n";' > ${WORKINGDIR}/${FILEPREFIX}payload-decoded-${NOWTS}.out

# GET PDF where G switch makes the data fields become url params
${CURLBIN} -o ${WORKINGDIR}/${FILEPREFIX}${SLACKCHANNAME}-${SLACKUSER}-Test-PDF-${NOWTS}.pdf "${WTURL}" -G \
--data "user=${SLACKUSER}" \
--data-urlencode "date=${NOWTSHUMAN}" \
--data "channelid=${SLACKCHANID}" \
--data "number=${FAXNUM}" \
--data "from=${FAXFROM}" \
--data "channel=${CHANATBASH}" \
--data-urlencode "comment=${COMMENTSTR}" 

# FAX it via Denphone fax blast
echo "" | ${MAILBIN} -s "${FAXNUM}" -S "from=${EMAILFROM}" -a ${WORKINGDIR}/${FILEPREFIX}${SLACKCHANNAME}-${SLACKUSER}-Test-PDF-${NOWTS}.pdf faxprocess@denphone.com

# ADD RESPONSE BACK

# Use a function because you can use variables in it
# Make sure heredoc token has NO SPACES after either one 
# and is the first thing on the line for the final one
# This POSTS AS APP

gen_curl_post_data() {
cat <<CATTEXT
{
  "text": "Attempting to fax ${FAXNUM} triggered by ${SLACKUSER} :robot_face:"
}
CATTEXT
}

${CURLBIN} -X "POST" "${SLACKRESPONSEURL}" \
	 -H 'Content-Type: application/json' \
	 --data "$(gen_curl_post_data)"

# Cleanup

# no need, the PDF is tiny
# rm -rf ${WORKINGDIR}/${FILEPREFIX}Test-PDF.pdf
# rm -rf ${WORKINGDIR}/${FILEPREFIX}Test-PDF-${NOWTS}.pdf