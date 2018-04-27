# load in SharePoint snap-in
Add-PSSnapin Microsoft.SharePoint.PowerShell -WarningAction SilentlyContinue

# assign root domain name to configure URL used to access app webs
Set-SPAppDomain "apps.wingtip.com" –confirm:$false 

$subscriptionSettingsService = Get-SPServiceInstance | where {$_.TypeName -like "Microsoft SharePoint Foundation Subscription Settings Service"}

if($subscriptionSettingsService.Status -ne "Online") { 
    Write-Host "Starting Subscription Settings Service" 
    Start-SPServiceInstance $subscriptionSettingsService | Out-Null
} 

# wait for subscription service to start" 
while ($service.Status -ne "Online") {
    # delay 5 seconds then check to see if service has started   sleep 5
    $service = Get-SPServiceInstance | where {$_.TypeName -like "Microsoft SharePoint Foundation Subscription Settings Service"}
} 

$subscriptionSettingsServiceApplicationName = "Site Subscription Settings Service Application"
$subscriptionSettingsServiceApplication = Get-SPServiceApplication | where {$_.Name -eq $subscriptionSettingsServiceApplicationName} 

# create an instance Subscription Service Application and proxy if they do not exist 
if($subscriptionSettingsServiceApplication -eq $null) { 
    Write-Host "Creating Subscription Settings Service Application..." 
    $pool = Get-SPServiceApplicationPool "SharePoint Web Services Default" 
    $subscriptionSettingsServiceDB= "Sharepoint_SiteSubscriptionSettingsServiceDB"
    $subscriptionSettingsServiceApplication = New-SPSubscriptionSettingsServiceApplication `
                                                -ApplicationPool $pool `
                                                -Name $subscriptionSettingsServiceApplicationName `
                                                -DatabaseName $subscriptionSettingsServiceDB 

    Write-Host "Creating Subscription Settings Service Application Proxy..." 
    $subscriptionSettingsServicApplicationProxy = New-SPSubscriptionSettingsServiceApplicationProxy `
                                                    -ServiceApplication $subscriptionSettingsServiceApplication

}

# assign name to default tenant to configure URL used to access web apps 
Set-SPAppSiteSubscriptionName -Name "WingtipTenant" -Confirm:$false