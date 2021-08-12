#!/bin/bash
# Prepared by Rick Cogley 2018122
# Run by hookdoo 
# For bulk sending SMS via Twilio, when a P1 ticket comes in
# Some variables set within Hookdoo hook setup - TICKNUM, CLINAME, SMSLIST

JQBIN="/home/rcogley/bin/jq"
RMBIN="/usr/bin/rm"
AWKBIN="/usr/bin/awk"
PHPBIN="/usr/local/bin/php"
PERLBIN="/usr/bin/perl"
OPENSSLBIN="/usr/bin/openssl"
CMPBIN="/usr/bin/cmp"
CURLBIN="/usr/bin/curl"
WORKINGDIR="/home/rcogley/webapps/hook_prodb_sms01"
# WORKINGDIR="$HOME"
NOWTS=$(TZ=":Japan" date -d "today" +"%Y%m%d%H%M")
FILEPREFIX="eSolia-P1-SMS-"

echo ${SMSLIST} > ${WORKINGDIR}/${FILEPREFIX}raw-${NOWTS}.out

cat ${WORKINGDIR}/${FILEPREFIX}raw-${NOWTS}.out | awk '{gsub(/\\r\\n/,RS)}1' | sort -u > ${WORKINGDIR}/${FILEPREFIX}list-${NOWTS}.out


# Send via Twilio
while IFS= read -r line; do
${CURLBIN} "https://api.twilio.com/2010-04-01/Accounts/AC7f9b58641a66d473654bac2e205ef1df/Messages.json" -X POST \
--data-urlencode "To=${line}" \
--data-urlencode "From=+12015033510" \
--data-urlencode "Body=Urgent ${CLINAME} P1 Ticket #${TICKNUM} recd with subject «${SUBLINE}» from ${EMAILFROM} https://tinyurl.com/esotick" \
-u AC7f9b58641a66d473654bac2e205ef1df:a43cc671aeff43cfcdea3793911d6eef
done < ${WORKINGDIR}/${FILEPREFIX}list-${NOWTS}.out

