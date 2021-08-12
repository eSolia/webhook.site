#!/bin/bash
# Prepared by Rick Cogley 20181222
# Run by hookdoo
# For bulk sending SMS via Twilio, when an emergency email comes in
# Some variables set within Hookdoo hook setup - EMAILFROM, EMAILSUBJECT, SMSLIST

JQBIN="/home/rcogley/bin/jq"
RMBIN="/usr/bin/rm"
AWKBIN="/usr/bin/awk"
PHPBIN="/usr/local/bin/php"
PERLBIN="/usr/bin/perl"
OPENSSLBIN="/usr/bin/openssl"
CMPBIN="/usr/bin/cmp"
CURLBIN="/usr/bin/curl"
WORKINGDIR="/home/rcogley/webapps/hook_mail2twilio01"
# WORKINGDIR="$HOME"
NOWTS=$(TZ=":Japan" date -d "today" +"%Y%m%d%H%M")
FILEPREFIX="eSolia-SMS-"

echo ${SMSLIST} > ${WORKINGDIR}/${FILEPREFIX}raw-${NOWTS}.out
# $SMSMSG="Urgent Ticket $TICKNUM at $CLINAME"
# echo $TICKNUM > ~/eSolia-Ticket-Number.out
# echo $CLINAME > ~/eSolia-Client-Name.out
cat ${WORKINGDIR}/${FILEPREFIX}raw-${NOWTS}.out | awk '{gsub(/\\r\\n/,RS)}1' | sort -u > ${WORKINGDIR}/${FILEPREFIX}list-${NOWTS}.out

# while IFS= read -r line; do
#  echo "TEST TEST Urgent Ticket" "$TICKNUM" "at" "$CLINAME" "$line" >> ~/OIOIOI.txt
# done < ~/eSolia-Ticket-SMS-List.out

# Use double quotes in curl params to get env vars to work
while IFS= read -r line; do
${CURLBIN} "https://api.twilio.com/2010-04-01/Accounts/AC7f9b58641a66d473654bac2e205ef1df/Messages.json" -X POST \
--data-urlencode "To=${line}" \
--data-urlencode "From=+12015033510" \
--data-urlencode "Body=Emergency Email received from ${EMAILFROM} with subject «${EMAILSUBJECT}» - pls see https://tinyurl.com/esolia99group" \
-u AC7f9b58641a66d473654bac2e205ef1df:a43cc671aeff43cfcdea3793911d6eef
done < ${WORKINGDIR}/${FILEPREFIX}list-${NOWTS}.out

