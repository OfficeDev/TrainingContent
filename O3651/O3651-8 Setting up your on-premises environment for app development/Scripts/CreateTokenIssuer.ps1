$issuerID = "11111111-1111-1111-1111-111111111111"
$realm = Get-SPAuthenticationRealm

$registeredIssuerName = $issuerID + '@' + $realm

Write-Host $registeredIssuerName 

$publicCertificatePath = "C:\Certs\wingtipapps.com.cer"
$publicCertificate = Get-PfxCertificate $publicCertificatePath

Write-Host "Create token issuer"
$secureTokenIssuer = New-SPTrustedSecurityTokenIssuer `
		                -Name $issuerID `
		                -RegisteredIssuerName $registeredIssuerName `
		                -Certificate $publicCertificate `
		                -IsTrustBroker

$secureTokenIssuer  | select * | Out-File -FilePath "SecureTokenIssuer.txt"

$serviceConfig = Get-SPSecurityTokenServiceConfig
$serviceConfig.AllowOAuthOverHttp = $true
$serviceConfig.Update()

Write-Host "All done..."
