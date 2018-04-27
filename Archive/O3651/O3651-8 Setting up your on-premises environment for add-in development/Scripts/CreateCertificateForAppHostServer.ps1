$makecert = "C:\Program Files\Microsoft Office Servers\15.0\Tools\makecert.exe"
$certmgr = "C:\Program Files\Microsoft Office Servers\15.0\Tools\certmgr.exe"

# specify domain name for SSL certificate
$domain = "wingtipapps.com"

# create output directory to create SSL certificate file
$outputDirectory = "c:\Certs\"
New-Item $outputDirectory -ItemType Directory -Force -Confirm:$false | Out-Null

# create file name for SSL certificate files
$publicCertificatePath  =  $outputDirectory + $domain + ".cer"
$privateCertificatePath = $outputDirectory + $domain + ".pfx"

Write-Host 
Write-Host "Creating .cer certificate file..."
& $makecert -r -pe -n "CN=$domain" -b 01/01/2012 -e 01/01/2022 -eku 1.3.6.1.5.5.7.3.1 -ss my -sr localMachine -sky exchange -sp "Microsoft RSA SChannel Cryptographic Provider" -sy 12 $publicCertificatePath
	
Write-Host 
Write-Host "Registering certificate with IIS..."
& $certmgr /add $publicCertificatePath /s /r localMachine root

# get certificate to obtain thumbprint
$publicCertificate = Get-PfxCertificate -FilePath $publicCertificatePath
$publicCertificateThumbprint = $publicCertificate.Thumbprint

Get-ChildItem cert:\\localmachine\my | Where-Object {$_.Thumbprint -eq $publicCertificateThumbprint} | ForEach-Object {
	Write-Host "  .. exporting private key for certificate (*.PFK)" -ForegroundColor Gray 
	$privateCertificateByteArray = $_.Export("PFX", "Password1")
	[System.IO.File]::WriteAllBytes($privateCertificatePath, $privateCertificateByteArray)
	Write-Host "  Certificate exported" -ForegroundColor Gray 
}  