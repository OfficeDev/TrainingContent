# Demo: Sending Actionable Messages

In this demo, you will use PowerShell to send an email containing a message card.

## Prerequisites

This demo uses Azure PowerShell. It also requires an Office 365 subscription with an active mailbox. A sample JSON file, `cardsample.json` is used as the basis for this lab. Edit the file to replace the **YOURWEBAPP** placeholder with the name of your Azure Web App.

## Write PowerShell to send email via Microsoft Office 365 SMTP Server

PowerShell provides a utility method `Send-MailMessage` that is used to send emails. You can use this method with the Office 365 SMTP Server to send an email using PowerShell.

1. Open the **PowerShell ISE** and expand the script pane. Copy the following PowerShell script to the script pane:

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

1. In the interactive pane, change the directory to the location where you saved the JSON file representing the fictitious expense report.

    ![Screenshot of Powershell script.](../../Images/powershell.png)

1. Run the script. When prompted, enter your own email address for both emails. Also enter your login credentials for your Microsoft Office 365 mailbox.

1. When the script completes, check your inbox for the email just sent.