//Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
//See LICENSE in the project root for license information.

using Microsoft.Graph;
using Microsoft.Identity.Client;
using System;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

public class AuthenticationHelper
{
    // The Client ID is used by the application to uniquely identify itself to the v2.0 authentication endpoint.
    static string clientId = ConfigurationManager.AppSettings["clientId"].ToString();
    public static string[] Scopes = { "User.Read" , "User.ReadBasic.All"};

    public static PublicClientApplication IdentityClientApp = new PublicClientApplication(clientId);

    private static GraphServiceClient graphClient = null;

    // Get an access token for the given context and resourceId. An attempt is first made to 
    // acquire the token silently. If that fails, then we try to acquire the token by prompting the user.
    public static GraphServiceClient GetAuthenticatedClient()
    {
        if (graphClient == null)
        {
            // Create Microsoft Graph client.
            try
            {
                graphClient = new GraphServiceClient(
                    "https://graph.microsoft.com/v1.0",
                    new DelegateAuthenticationProvider(
                        async (requestMessage) =>
                        {
                            var token = await GetTokenForUserAsync();
                            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", token);
                        }));
                return graphClient;
            }

            catch (Exception ex)
            {
                Debug.WriteLine("Could not create a graph client: " + ex.Message);
            }
        }

        return graphClient;
    }


    /// <summary>
    /// Get Token for User.
    /// </summary>
    /// <returns>Token for user.</returns>
    public static async Task<string> GetTokenForUserAsync()
    {
        AuthenticationResult authResult = null;
        try
        {
            authResult = await IdentityClientApp.AcquireTokenSilentAsync(Scopes, IdentityClientApp.Users.FirstOrDefault());
            return authResult.AccessToken;
        }        
        catch (MsalUiRequiredException ex)
        {
            // A MsalUiRequiredException happened on AcquireTokenSilentAsync. 
            //This indicates you need to call AcquireTokenAsync to acquire a token            
            authResult = await IdentityClientApp.AcquireTokenAsync(Scopes);
            return authResult.AccessToken;            
        }            
    }

    /// <summary>
    /// Signs the user out of the service.
    /// </summary>
    public static void SignOut()
    {
        foreach (var user in IdentityClientApp.Users)
        {
            IdentityClientApp.Remove(user);
        }
        graphClient = null;        

    }

}

