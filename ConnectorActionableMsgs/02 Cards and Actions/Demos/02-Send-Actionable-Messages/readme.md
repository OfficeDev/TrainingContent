# Cards and Actions Using Outlook Actionable Messages – 300 Level
----------------
In this lab, you will walk through building an Actionable Message card and adding actions. 

## Prerequisites

This demo uses Azure PowerShell. It also requires an Office 365 subscription with an active mailbox. A sample JSON file, `cardsample.json` is used as the basis for this lab. Edit the file to replace the **YOURWEBAPP** placeholder with the name of your Azure Web App.


## Sending Actionable Messages 

In the previous section, you used the [MessageCard Playground]() app to design a card and send it to yourself. In this section, you will use PowerShell to send an email containing a card.

### Write PowerShell to Send Email via Office 365 SMTP Server
PowerShell provides a utility method `Send-MailMessage` that is used to send emails. We can use this method with the Office 365 SMTP Server to send an email using PowerShell.

Open **PowerShell ISE** and expand the script pane. **Copy** the following PowerShell script to the script pane.

````PowerShell
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
````
In the interactive pane, change directory to the location where you saved the JSON file representing the fictitious expense report.

![](../../Images/powershell.png)

**Run** the script. You are prompted for the email From and To properties, enter your own email address for both. You are also prompted for login credentials to your Office 365 mailbox.

After you provide your credentials, the script completes. **Check** your inbox, and you will have a new email containing the card that you just sent.



