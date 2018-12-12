$cardJson = Get-Content .\expenseCard.json
$cardPayload = "<script type='application/ld+json'>" + $cardJson + "</script>"

$htmlMessage = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'>"
$htmlMessage += $cardPayload
$htmlMessage += "</head><body>"
$htmlMessage += "Visit the <a href='https://docs.microsoft.com/en-us/outlook/actionable-messages'>Outlook Dev Portal</a> to learn more about Actionable Messages."
$htmlMessage += "</body></html>"

$msolcred = Get-Credential
Send-MailMessage –From $msolcred.UserName –To $msolcred.UserName –Subject "MessageCard Demo" –Body $htmlMessage -BodyAsHtml -SmtpServer smtp.office365.com -Credential $msolcred -UseSsl -Port 587
