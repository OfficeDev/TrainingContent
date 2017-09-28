Param(
  [Parameter(Mandatory = $true, 
    HelpMessage="The URL of the registered Office 365 connector webhook")]
  [ValidateNotNullOrEmpty()]
  [string]$url
  )


$jsonBody = Get-Content .\CardSample.json

Invoke-RestMethod -Method Post -Uri $url -Body $jsonBody -ContentType application/json