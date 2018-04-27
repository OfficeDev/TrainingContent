Add-PSSnapin "Microsoft.SharePoint.PowerShell"

$issuerID = "11111111-1111-1111-1111-111111111111"

$targetSiteUrl = "http://wingtipserver"
$targetSite = Get-SPSite $targetSiteUrl
$realm = Get-SPAuthenticationRealm -ServiceContext $targetSite

$registeredIssuerName = $issuerID + '@' + $realm

Write-Host $registeredIssuerName 

$publicCertificatePath = "C:\Certs\WingtipAppCertificate01.cer"
$publicCertificate = Get-PfxCertificate $publicCertificatePath

Write-Host "Create token issuer"
$secureTokenIssuer = New-SPTrustedSecurityTokenIssuer `
                     -Name $issuerID `
                     -RegisteredIssuerName $registeredIssuerName `
                     -Certificate $publicCertificate `
                     -IsTrustBroker

$secureTokenIssuer | select *
$secureTokenIssuer  | select * | Out-File -FilePath "SecureTokenIssuer.txt"


# configure SharePoint to suppport S2S Trusts with HTTP in addition to HTTPS
$serviceConfig = Get-SPSecurityTokenServiceConfig
$serviceConfig.AllowOAuthOverHttp = $true
$serviceConfig.Update()

Write-Host "All done..."