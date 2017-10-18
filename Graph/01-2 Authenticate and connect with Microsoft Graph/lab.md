
# Microsoft Graph: Building Microsoft Graph Applications - 200 Level
----------------
In this lab, you will walk through authentication and permissions sceanrios leveraging the Microsoft Graph using the Graph SDK and Microsoft Authentication Library (MSAL).

## Table of Contents
1. [Obtain tokens and connect with the Microsoft Graph using REST](#powershellrest)
2. [Connecting with Microsoft Graph using OpenID Connect](#openidconnect)
3. [Dynamic permissions with the v2.0 endpoint and Microsoft Graph](#openidconnect)

## Prerequisites

This lab uses PowerShell ISE and Visual Studio 2017. It also requires an **Azure Active Directory** directory and a user who can log in with administrative privileges as well as a directory user who does not have administrative privileges.

## Setup

Open the Visual Studio Installer and enable the **.NET desktop development**, **Mobile applications with .NET**, **Azure development**,and **Universal Windows Platform** features. Make sure to update Visual Studio 2017 to the latest version, and update VSIX packages (Tools / Extensions and Updates).

<a name="powershellrest"></a>

## 1. Obtain tokens and connect with the Microsoft Graph using REST

This lab will walk you through connecting to the v2.0 endpoints to authorize the application, obtain a token, and connect with the Microsoft Graph.

### Register the application

Visit the [Application Registration Portal](https://apps.dev.microsoft.com/) to register the application.

- Once the application is created, an Application Id is provided on the screen. **Copy this ID**, you will use it as the Client ID.
- Add a new secret by clicking the **Generate new password** button and copy the secret to use later as the Client Secret.
- Click the **Add Platform** button. A popup is presented, choose **Web Application**.
- Change the Redirect URL to **http://localhost:8089**.
- Click **Save** to save all changes.

![](Images/01.png)

**Open** a new PowerShell ISE window. **Copy** the following code and **paste** in the script pane.

````powershell
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
````

This script will first create an URL to the authorize endpoint, providing the client ID, permission scopes, and redirect URL. If we attempted to use Invoke-RestMethod to this endpoint, the result would be the HTML content of the resulting login screen. We need to actually log in and authorize the application, so we will copy the URL to a browser.

**Run** the PowerShell script. You are prompted to enter a username and password. The username is the Application ID generated when you registered the application, and the password is the secret that was generated.

![](Images/02.png)

**Copy** the resulting URL.

![](Images/03.png)

**Paste** the URL to a browser window. You are prompted to sign in.

![](Images/04.png)

After you sign in an authorize the application, the browser is redirected. Since we don't have a web server listening for requests at http://localhost:8089, the browser shows a 404 error screen. However, the URL contains the code needed.

**Copy** the code value from the querystring in the browser's URL bar, up to the trailing &session_state querystring value.

![](Images/05.png)

**Paste** the code value into the PowerShell window.

![](Images/06.png)

The result is a successful call to the Microsoft Graph, getting the profile of the currently signed-in user.

![](Images/07.png)

The output includes 3 tokens: an id token, an access token, and a refresh token. These tokens are JWT tokens that, as of the time of this writing, can be decoded and their contents inspected.

> **Note:** These tokens are currently not encrypted but that is subject to change.

**Copy** the token value in the output.

![](Images/08.png)

Open a browser to https://jwt.calebb.net and paste the encoded token to inspect its contents.

![](Images/09.png)

<a name="openidconnect"></a>

## 2. Connecting with Microsoft Graph using OpenID Connect

This lab will walk you through creating a web application that connects with Microsoft Graph using OpenID Connect.

### Requirements

- Visual Studio 2017
- A personal Microsoft Account with access to an Outlook.com enabled mailbox
- A work or school account with access to an Office 365 enabled mailbox

### Register the application

Visit the [Application Registration Portal](https://apps.dev.microsoft.com/) to register the application.

- Once the application is created, an Application Id is provided on the screen. **Copy this ID**, you will use it as the Client ID.
- Add a new secret by clicking the **Generate new password** button and copy the secret to use later as the Client Secret.
- Click the **Add Platform** button. A popup is presented, choose **Web Application**.
- Change the Redirect URL to **https://localhost:44326/**. 
- Click **Save** to save all changes.

![](Images/11.png)

From your shell or command line:

````shell
git clone https://github.com/Azure-Samples/active-directory-dotnet-webapp-openidconnect-v2.git
````

**Edit** the `web.config` file with your app's coordinates. Find the appSettings key `ida:ClientId` and provide the Application ID from your app registration. Find the appSettings key `ida:ClientSecret` and provide the value from the secret generated in the previous step.

### Inspect the code sample

Open the `Startup.Auth.cs` file. This is where authentication begins using the OWIN middleware.

````csharp
app.UseOpenIdConnectAuthentication(
    new OpenIdConnectAuthenticationOptions
    {
        // The `Authority` represents the v2.0 endpoint - https://login.microsoftonline.com/common/v2.0
        // The `Scope` describes the initial permissions that your app will need.  See https://azure.microsoft.com/documentation/articles/active-directory-v2-scopes/                    
        ClientId = clientId,
        Authority = String.Format(CultureInfo.InvariantCulture, aadInstance, "common", "/v2.0"),
        RedirectUri = redirectUri,                    
        Scope = "openid email profile offline_access Mail.Read",
        PostLogoutRedirectUri = redirectUri,
        TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            // In a real application you would use IssuerValidator for additional checks, like making sure the user's organization has signed up for your app.
            //     IssuerValidator = (issuer, token, tvp) =>
            //     {
            //        //if(MyCustomTenantValidation(issuer)) 
            //        return issuer;
            //        //else
            //        //    throw new SecurityTokenInvalidIssuerException("Invalid issuer");
            //    },
        },
````

When an authorization code is received, the code is redeemed for an access token and a refresh token, which are stored in cache.

````csharp
Notifications = new OpenIdConnectAuthenticationNotifications
{
    // If there is a code in the OpenID Connect response, redeem it for an access token and refresh token, and store those away.
    AuthorizationCodeReceived = async (context) =>
    {
        var code = context.Code;
        string signedInUserID = context.AuthenticationTicket.Identity.FindFirst(ClaimTypes.NameIdentifier).Value;
        TokenCache userTokenCache = new MSALSessionCache(signedInUserID, 
            context.OwinContext.Environment["System.Web.HttpContextBase"] as HttpContextBase).GetMsalCacheInstance();                            
        ConfidentialClientApplication cca =
            new ConfidentialClientApplication(clientId, redirectUri, new ClientCredential(appKey), userTokenCache,null);
        string[] scopes = { "Mail.Read" };
        try
        {
            AuthenticationResult result = await cca.AcquireTokenByAuthorizationCodeAsync(code, scopes);
        }
        catch (Exception eee)
        {
                                
        }
    },
    AuthenticationFailed = (notification) =>
    {
        notification.HandleResponse();
        notification.Response.Redirect("/Error?message=" + notification.Exception.Message);
        return Task.FromResult(0);
    }
}
````

Open the `Models/MsalSessionCache.cs` file. Notice that the token is persisted in session state.

````csharp
public void Load()
{
    SessionLock.EnterReadLock();
    cache.Deserialize((byte[])httpContext.Session[CacheId]);
    SessionLock.ExitReadLock();
}

public void Persist()
{
    SessionLock.EnterWriteLock();

    // Optimistically set HasStateChanged to false. We need to do it early to avoid losing changes made by a concurrent thread.
    cache.HasStateChanged = false;

    // Reflect changes in the persistent store
    httpContext.Session[CacheId] = cache.Serialize();
    SessionLock.ExitWriteLock();
}
````

In case of a load-balanced application, such as an Azure Web App with multiple instances, you may need to centrally persist the state to avoid forcing the user to log on multiple times.

Open the `Controllers/HomeController.cs` file and view the About controller method. The `Authorize` attribute ensures that only authenticated users can exercise this code. The `About` method contains code to retrieve the current user's claims and makes them available via the `ViewBag` for display by the view. Recall that the Azure AD v2.0 authorize endpoint returns an id_token back to the application which contains these claims. The data backing these claims is present because the OpenID Connect scopes "openid" and "profile" were requested.

````csharp
[Authorize]
public async Task<ActionResult> About()
{
    ViewBag.Name = ClaimsPrincipal.Current.FindFirst("name").Value;
    ViewBag.AuthorizationRequest = string.Empty;
    // The object ID claim will only be emitted for work or school accounts at this time.
    Claim oid = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier");
    ViewBag.ObjectId = oid == null ? string.Empty : oid.Value;

    // The 'preferred_username' claim can be used for showing the user's primary way of identifying themselves
    ViewBag.Username = ClaimsPrincipal.Current.FindFirst("preferred_username").Value;

    // The subject or nameidentifier claim can be used to uniquely identify the user
    ViewBag.Subject = ClaimsPrincipal.Current.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;
    return View();
}
````

Open the `Controllers/HomeController.cs` file and view the ReadMail controller method. Unlike the `About` method, this method is not decorated with the `Authorize` attribute. The method retrieves the current user's token cache and creates a new `ConfidentialClientApplication` using the user's token cache. If there are users in the cache, the code calls `AcquireTokenSilentAsync` which will look in the cache for a token matching the user and the requested scope. If one is not present, it will attempt to use the refresh token. It then attaches the token to the request to the Microsoft Graph to retrieve the user's messages.

````csharp
public async Task<ActionResult> ReadMail()
{            
    try
    {
        string signedInUserID = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
        TokenCache userTokenCache = new MSALSessionCache(signedInUserID, this.HttpContext).GetMsalCacheInstance();

        ConfidentialClientApplication cca = 
            new ConfidentialClientApplication(clientId, redirectUri, new ClientCredential(appKey), userTokenCache, null);
        if (cca.Users.Count() > 0)
        {
            string[] scopes = { "Mail.Read" };
            AuthenticationResult result = await cca.AcquireTokenSilentAsync(scopes, cca.Users.First());

            HttpClient hc = new HttpClient();
            hc.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", result.AccessToken);
            HttpResponseMessage hrm = await hc.GetAsync("https://graph.microsoft.com/v1.0/me/messages");
            string rez = await hrm.Content.ReadAsStringAsync();
            ViewBag.Message = rez;
        }
        else { }
        return View();
    }
    catch (MsalUiRequiredException)
    {
        ViewBag.Relogin = "true";
        return View();
    }
    catch (Exception eee)
    {
        ViewBag.Error = "An error has occurred. Details: " + eee.Message;
        return View();
    }
}
````

### Run the application

Run the application.

![](Images/13.png)

Clicking the About link or clicking the sign in link in the top right will prompt you to sign in.

![](Images/14.png)

After signing in, the user is prompted for consent.

- View your basic profile
- View your email address
- Access your data anytime
- Sign in as you
- Read your mail

![](Images/15.png)

After consenting, click the **About** link. Information about the user is displayed from their current set of claims in the OpenID Connect flow.

![](Images/16.png)

Since the user is now logged in, the Read Mail link is now visible. Click the **Read Mail** link. You can now read email messages from your inbox.

<a name="dynamicpermissions"></a>

## 3. Dynamic permissions with the v2.0 endpoint and Microsoft Graph

This lab will walk you through creating a web application that connects with Microsoft Graph using OpenID Connect and requests additional permissions.

### Register the application

You can reuse the same application registration from the previous lab, [Connecting with Microsoft Graph using OpenID Connect](#openidconnect). If you have already completed the app registration, move to the next section.

Visit the [Application Registration Portal](https://apps.dev.microsoft.com/) to register the application.

- Once the application is created, an Application Id is provided on the screen. **Copy this ID**, you will use it as the Client ID.
- Add a new secret by clicking the **Generate new password** button and copy the secret to use later as the Client Secret.
- Click the **Add Platform** button. A popup is presented, choose **Web Application**.
- Change the Redirect URL to **https://localhost:44326/**.
- Click **Save** to save all changes.

![](Images/11.png)

From your shell or command line:

````shell
git clone https://github.com/Azure-Samples/active-directory-dotnet-webapp-openidconnect-v2.git
````

**Edit** the `web.config` file with your app's coordinates. Find the appSettings key `ida:ClientId` and provide the Application ID from your app registration. Find the appSettings key `ida:ClientSecret` and provide the value from the secret generated in the previous step.

### Inspect the code sample

Open the `Startup.Auth.cs` file. This is where authentication begins using the OWIN middleware.

````csharp
app.UseOpenIdConnectAuthentication(
    new OpenIdConnectAuthenticationOptions
    {
        // The `Authority` represents the v2.0 endpoint - https://login.microsoftonline.com/common/v2.0
        // The `Scope` describes the initial permissions that your app will need.  See https://azure.microsoft.com/documentation/articles/active-directory-v2-scopes/                    
        ClientId = clientId,
        Authority = String.Format(CultureInfo.InvariantCulture, aadInstance, "common", "/v2.0"),
        RedirectUri = redirectUri,                    
        Scope = "openid email profile offline_access Mail.Read",
        PostLogoutRedirectUri = redirectUri,
        TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            // In a real application you would use IssuerValidator for additional checks, like making sure the user's organization has signed up for your app.
            //     IssuerValidator = (issuer, token, tvp) =>
            //     {
            //        //if(MyCustomTenantValidation(issuer)) 
            //        return issuer;
            //        //else
            //        //    throw new SecurityTokenInvalidIssuerException("Invalid issuer");
            //    },
        },
````

When an authorization code is received, the code is redeemed for an access token and a refresh token, which are stored in cache.

````csharp
Notifications = new OpenIdConnectAuthenticationNotifications
{
    // If there is a code in the OpenID Connect response, redeem it for an access token and refresh token, and store those away.
    AuthorizationCodeReceived = async (context) =>
    {
        var code = context.Code;
        string signedInUserID = context.AuthenticationTicket.Identity.FindFirst(ClaimTypes.NameIdentifier).Value;
        TokenCache userTokenCache = new MSALSessionCache(signedInUserID, 
            context.OwinContext.Environment["System.Web.HttpContextBase"] as HttpContextBase).GetMsalCacheInstance();                            
        ConfidentialClientApplication cca =
            new ConfidentialClientApplication(clientId, redirectUri, new ClientCredential(appKey), userTokenCache,null);
        string[] scopes = { "Mail.Read" };
        try
        {
            AuthenticationResult result = await cca.AcquireTokenByAuthorizationCodeAsync(code, scopes);
        }
        catch (Exception eee)
        {
                                
        }
    },
    AuthenticationFailed = (notification) =>
    {
        notification.HandleResponse();
        notification.Response.Redirect("/Error?message=" + notification.Exception.Message);
        return Task.FromResult(0);
    }
}
````

Notice the scope that is requested, `Mail.Read`. The token that is received is only valid for reading emails. If the application attempts to send an email, it would fail because the app has not been granted consent.

Open the `Controllers/HomeController.cs` file and scroll down to the `SendMail` method with no parameters. When an HTTP GET is issued to this page, it will create a token cache and create a new `ConfidentialClientApplication` using the app secret. It then calls `AcquireTokenSilentAsync` using the `Mail.Send` scope. This scope was not requested when the app started, the user will not have already consented.  The MSAL code will look in the cache for a token matching the scope, then attempt using the refresh token, and finally will fail if the user has not consented.

````csharp
[Authorize]
public async Task<ActionResult> SendMail()
{            
    // try to get token silently
    string signedInUserID = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
    TokenCache userTokenCache = new MSALSessionCache(signedInUserID, this.HttpContext).GetMsalCacheInstance();            
    ConfidentialClientApplication cca = new ConfidentialClientApplication(clientId, redirectUri,new ClientCredential(appKey), userTokenCache, null);
    if (cca.Users.Count() > 0)
    {
        string[] scopes = { "Mail.Send" };
        try
        {
            AuthenticationResult result = await cca.AcquireTokenSilentAsync(scopes,cca.Users.First());
        }
        catch (MsalUiRequiredException)
        {
            try
            {// when failing, manufacture the URL and assign it
                string authReqUrl = await WebApp.Utils.OAuth2RequestManager.GenerateAuthorizationRequestUrl(scopes, cca, this.HttpContext, Url);
                ViewBag.AuthorizationRequest = authReqUrl;
            }
            catch (Exception ee)
            {

            }
        }
    }
    else
    {

    }
    return View();
}
````

Open the `utils/OAuth2CodeRedeemerMiddleware.cs` file and scroll down to the `GenerateAuthorizationRequestUrl` method. This method will generate the request to the Authorize endpoint to request additional permissions.

````csharp
public static async Task<string> GenerateAuthorizationRequestUrl(string[] scopes, ConfidentialClientApplication cca, HttpContextBase httpcontext, UrlHelper url)
{
    string signedInUserID = ClaimsPrincipal.Current.FindFirst(System.IdentityModel.Claims.ClaimTypes.NameIdentifier).Value;
    string preferredUsername = ClaimsPrincipal.Current.FindFirst("preferred_username").Value;
    Uri oauthCodeProcessingPath = new Uri(httpcontext.Request.Url.GetLeftPart(UriPartial.Authority).ToString());
    string state = GenerateState(httpcontext.Request.Url.ToString(), httpcontext, url, scopes);
    string tenantID = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid").Value;
    string domain_hint = (tenantID == "9188040d-6c67-4c5b-b112-36a304b66dad") ? "consumers" : "organizations";
    Uri authzMessageUri =
        await cca.GetAuthorizationRequestUrlAsync(
            scopes,
        oauthCodeProcessingPath.ToString(),
        preferredUsername, 
        state == null ? null : "&state=" + state + "&domain_hint=" + domain_hint,
        null,
        // TODo change
        cca.Authority
        );
    return authzMessageUri.ToString();

}
````

### Run the application

Run the application.

![](Images/13.png)

Clicking the About link or clicking the sign in link in the top right will prompt you to sign in.

![](Images/14.png)

After signing in, if you have not already granted consent, the user is prompted for consent.

- View your basic profile
- View your email address
- Access your data anytime
- Sign in as you
- Read your mail

![](Images/15.png)

After consenting, click the **About** link. Information about the user is displayed from their current set of claims in the OpenID Connect flow.

![](Images/15.png)

Since the user is now logged in, the Read Mail link is now visible. Click the **Read Mail** link. You can now read email messages from your inbox.

The app was consented the ability to read mail, but was not consented to send an email on the user's behalf. The MSAL code attempts a call to `AcquireTokenSilentAsync`, which fails because the user did not consent. The application catches the exception and the code builds a URL to the authorize endpoint to request the Mail.Send permission. The link looks similar to:

https://login.microsoftonline.com/common/oauth2/v2.0/authorize?scope=Mail.Send+offline_access+openid+profile&response_type=code&client_id=0777388d-640c-4bc3-9053-671d6a8300c4&redirect_uri=https:%2F%2Flocalhost:44326%2F&login_hint=AdeleV%40msgraphdemo.onmicrosoft.com&prompt=select_account&domain_hint=organizations

![](Images/17.png)

Click on the link, and the user is now prompted to consent. The permissions include "Send mail as you". 

![](Images/18.png)

After clicking **Accept**, the user is redirected back to the application and the app can now send an email on the user's behalf.

![](Images/19.png)