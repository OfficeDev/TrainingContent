Param(
  [Parameter(Mandatory = $true, 
    HelpMessage="The Office 365 email address the email is being sent from")]
  [ValidateNotNullOrEmpty()]
  [string]$from,

  [Parameter(Mandatory = $true, 
    HelpMessage="The email address the email is being sent to")]
  [ValidateNotNullOrEmpty()]
  [string]$to
  )

$emailHeader = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><script type='application/ld+json'>"
$jsonBody = Get-Content .\CardSample.json
$emailFooter = "</script></head><body>Visit the <a href='https://docs.microsoft.com/en-us/outlook/actionable-messages'>Outlook Dev Portal</a> to learn more about Actionable Messages.</body></html>"

$emailBody = $emailHeader + $jsonBody + $emailFooter

$msolcred = Get-Credential
Send-MailMessage –From $from –To $to –Subject "MessageCard Demo" –Body $emailBody -BodyAsHtml -SmtpServer smtp.office365.com -Credential $msolcred -UseSsl -Port 587