function Get-CurrentUserProfile
{
    Param
    (
        [parameter(Mandatory=$true,
        ValueFromPipeline=$true)]
        [PSCredential]
        $credential,
        [parameter(Mandatory=$true)]
        [string]
        $scopes,
        [parameter(Mandatory=$true)]
        [string]
        $redirecUrl,
        [switch]
        $displayTokens
    )
   
    $clientID = $credential.Username
    $clientSecret = $credential.GetNetworkCredential().Password

    #v2.0 authorize URL
    $authorizeUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
    
    #Permission scopes
    $requestUrl = $authorizeUrl + "?scope=$scopes"

    #Code grant, will receive a code that can be redeemed for a token
    $requestUrl += "&response_type=code"

    #Add your app's Application ID
    $requestUrl += "&client_id=$clientID"
    

    #Add your app's redirect URL
    $requestUrl += "&redirect_uri=$redirecUrl"

    #Options for response_mode are "query" or "form_post". We want the response
    #to include the data in the querystring
    $requestUrl += "&response_mode=query"

    Write-Host
    Write-Host "Copy the following URL and paste the following into your browser:"
    Write-Host
    Write-Host $requestUrl -ForegroundColor Cyan
    Write-Host
    Write-Host "Copy the code querystring value from the browser and paste it below."
    Write-Host
    $code = Read-Host -Prompt "Enter the code"

    $body = "client_id=$clientID&client_secret=$clientSecret&scope=$scopes&grant_type=authorization_code&code=$code&redirect_uri=$redirecUrl"    
    

    #v2.0 token URL
    $tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token"

    $response = Invoke-RestMethod -Method Post -Uri $tokenUrl -Headers @{"Content-Type" = "application/x-www-form-urlencoded"} -Body $body

    if($displayTokens)
    {
        $response | select * | fl
    }

    #Pass the access_token in the Authorization header to the Microsoft Graph
    $token = $response.access_token
    Invoke-RestMethod -Method Get -Uri "https://graph.microsoft.com/v1.0/me" -Headers @{"Authorization" = "bearer $token"} 
}






#offline_acess:  Allows requesting refresh tokens
#openid:  Allows your app to sign the user in and receive an app-specific identifier for the user
#profile: Allows your app access to all other basic information such as name, preferred username, object ID, and others
#User.Read: Allows your app to read the current's user's profile
$scopes = "offline_access+openid+profile+User.Read"

#Redirects to this URL will show a 404 in your browser, but allows you to copy the returned code from the URL bar
#Must match a redirect URL for your registered application
$redirectURL = "https://localhost:8089"

$credential = Get-Credential -Message "Enter the client ID and client secret"
Get-CurrentUserProfile $credential -scopes $scopes -redirecUrl $redirectURL -displayTokens




