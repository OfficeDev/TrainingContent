using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Security.Claims;
using GraphUsersGroups.TokenStorage;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OpenIdConnect;

namespace GraphUsersGroups.Auth
{
    public class AuthHelper
    {
        // This is the logon authority
        // i.e. https://login.microsoftonline.com/common
        public string Authority { get; set; }
        // This is the application ID obtained from registering at
        // https://apps.dev.microsoft.com
        public string AppId { get; set; }
        // This is the application secret obtained from registering at
        // https://apps.dev.microsoft.com
        public string AppSecret { get; set; }
        // This is the token cache
        public SessionTokenCache TokenCache { get; set; }

        public AuthHelper(string authority, string appId, string appSecret, SessionTokenCache tokenCache)
        {
            Authority = authority;
            AppId = appId;
            AppSecret = appSecret;
            TokenCache = tokenCache;
        }

        // Makes a POST request to the token endopoint to get an access token using either
        // an authorization code or a refresh token. This will also add the tokens
        // to the local cache.
        public async Task<TokenRequestSuccessResponse> GetTokensFromAuthority(string grantType, string grantParameter, string redirectUri)
        {
            // Build the token request payload
            FormUrlEncodedContent tokenRequestForm = new FormUrlEncodedContent(
              new[]
              {
          new KeyValuePair<string,string>("grant_type", grantType),
          new KeyValuePair<string,string>("code", grantParameter),
          new KeyValuePair<string,string>("client_id", this.AppId),
          new KeyValuePair<string,string>("client_secret", this.AppSecret),
          new KeyValuePair<string,string>("redirect_uri", redirectUri)
              }
            );

            using (HttpClient httpClient = new HttpClient())
            {
                string requestString = tokenRequestForm.ReadAsStringAsync().Result;
                StringContent requestContent = new StringContent(requestString);
                requestContent.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");

                // Set up the HTTP POST request
                HttpRequestMessage tokenRequest = new HttpRequestMessage(HttpMethod.Post, this.Authority + "/oauth2/v2.0/token");
                tokenRequest.Content = requestContent;
                tokenRequest.Headers.UserAgent.Add(new ProductInfoHeaderValue("OneNoteDev", "1.0"));
                tokenRequest.Headers.Add("client-request-id", Guid.NewGuid().ToString());
                tokenRequest.Headers.Add("return-client-request-id", "true");

                // Send the request and read the JSON body of the response
                HttpResponseMessage response = await httpClient.SendAsync(tokenRequest);
                JObject jsonResponse = JObject.Parse(response.Content.ReadAsStringAsync().Result);
                JsonSerializer jsonSerializer = new JsonSerializer();

                if (response.IsSuccessStatusCode)
                {
                    // Parse the token response
                    TokenRequestSuccessResponse s = (TokenRequestSuccessResponse)jsonSerializer.Deserialize(
                      new JTokenReader(jsonResponse), typeof(TokenRequestSuccessResponse));

                    // Save the tokens
                    TokenCache.UpdateTokens(s);
                    return s;
                }
                else
                {
                    // Parse the error response
                    TokenRequestErrorResponse e = (TokenRequestErrorResponse)jsonSerializer.Deserialize(
                      new JTokenReader(jsonResponse), typeof(TokenRequestErrorResponse));

                    // Throw the error description
                    throw new Exception(e.Description);
                }
            }
        }

        public async Task<string> GetUserAccessToken(string redirectUri)
        {
            if (null == TokenCache || null == TokenCache.Tokens)
            {
                HttpContext.Current.Request.GetOwinContext().Authentication.Challenge(
                  new AuthenticationProperties() { RedirectUri = redirectUri },
                  OpenIdConnectAuthenticationDefaults.AuthenticationType);

                return null;
            }

            // If the token is expired, use refresh token to obtain
            // a new one before returning
            if (TokenCache.Tokens.ExpiresOn < DateTime.UtcNow)
            {
                var response = await GetTokensFromAuthority("refresh_token", TokenCache.Tokens.RefreshToken, redirectUri);
                TokenCache.UpdateTokens(response);
                return response.AccessToken;
            }

            return TokenCache.Tokens.AccessToken;
        }

        public static string GetUserId(ClaimsPrincipal userPrincipal)
        {
            Claim objId = userPrincipal
              .FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier");

            if (null != objId)
            {
                return objId.Value;
            }

            Claim nameId = userPrincipal
              .FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");

            return (null != nameId) ? nameId.Value : string.Empty;
        }
    }
}