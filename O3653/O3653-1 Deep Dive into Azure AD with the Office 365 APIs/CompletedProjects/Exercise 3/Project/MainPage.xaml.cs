using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Windows.Data.Json;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Security.Authentication.Web;
using Windows.UI;
using Windows.UI.Popups;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;


namespace Win8ServiceDiscovery
{
    /// <summary>
    /// Discovery Service Page
    /// </summary>
    /// 
    public sealed partial class MainPage : Page
    {
        #region Private Fields and Constants
        private const string AccountTypeUnknown = "0";
        private const string AccountTypeMicrosoft = "1";
        private const string AccountTypeOrganizational = "2";
        
        private const string MyFiles = "MyFiles";
        private const string Read = "Read";
        private const string Scope = MyFiles + "." + Read;

        private readonly Brush SuccessBrush = new SolidColorBrush(Colors.Green);
        private readonly Brush ErrorBrush = new SolidColorBrush(Colors.Red);

        private Dictionary<string, string> m_settings;
        #endregion

        #region Constructors
        public MainPage()
        {
            this.InitializeComponent();
           
        }
        #endregion

        #region First Sign-In
        /// <summary>
        /// Gets the user realm through navigation.
        /// </summary>
        private async void NavigationButton_Click(object sender, RoutedEventArgs e)
        { 
            // Build the /FirstSignIn URL
            var firstSignInUri = new Uri(
                string.Format("{0}/discovery/me/FirstSignIn?redirect_uri={1}&scope={2}", 
                    this.DiscoveryServiceHost.Text,
                    TerminalUriText,
                    Scope));
            var terminalUri = new Uri(TerminalUriText);

            var webAuthResult = await WebAuthenticationBroker.AuthenticateAsync(WebAuthenticationOptions.None, firstSignInUri, terminalUri)
                .AsTask().ConfigureAwait(continueOnCapturedContext: true);

            if (webAuthResult.ResponseStatus == WebAuthenticationStatus.Success)
            {
                ParseNavigationResult(webAuthResult.ResponseData);
                RenderUserRealmData();
                this.Status.Foreground = SuccessBrush;

                
                m_settings["discovery_resource"] = "Microsoft.SharePoint"; // TODO: for Mail, use "https://sdfpilot.outlook.com/";
            }
            else
            {
                // This error wasn't expected
                this.Status.Text = string.Format("Error = {0}\nHTTP code = {1}\n", webAuthResult.ResponseStatus, webAuthResult.ResponseErrorDetail);
                this.Status.Foreground = ErrorBrush;
            }
        }

        private string TerminalUriText
        {
            get
            {
                var host = this.DiscoveryServiceHost.Text;
                var builder = new StringBuilder(host.Length + 100);
                builder.Append(host);
                if (!host.EndsWith("/")) builder.Append("/");
                builder.Append("discovery/me/this-path-is-only-used-for-termination");

                return builder.ToString();
            }
        }

        private void ParseNavigationResult(string queryString)
        {
            // Re-create the dictionary
            m_settings = new Dictionary<string, string>();

            // Parse the query string
            var queryParams = SplitQueryString(queryString);
            foreach (var param in queryParams)
            {
                var parts = param.Split('=');
                var paramName = parts[0].Trim();
                var paramValue = WebUtility.UrlDecode(parts[1]).Trim();

                // Add the parsed name-value pair to the dictionary
                m_settings[paramName] = paramValue;
            }
        }

        private string[] SplitQueryString(string queryString)
        {
            // Do some hygiene on the query string upfront to ease the parsing
            queryString.Trim();
            var queryStringBegin = queryString.IndexOf('?');

            if (queryStringBegin >= 0)
            {
                queryString = queryString.Substring(queryStringBegin + 1);
            }

            // Now split the query string
            return queryString.Split('&');
        }

        private void RenderUserRealmData()
        {
            // Clear the UI box
            this.Status.Text = string.Empty;

            // Dump the dictionary
            if (m_settings != null)
            {
                foreach (var kvp in m_settings)
                {
                    this.Status.Text += string.Format("{0} = '{1}'\n", kvp.Key, kvp.Value);
                }
            }
        }
        #endregion

        #region Get Authorized for Discovery
        /// <summary>
        /// Gets the app authorized to use the desired services on behalf of the current user.
        /// </summary>
        private async void AuthButton_Click(object sender, RoutedEventArgs e)
        { 
       
            this.Status.Text += "------------------------------\n";

            try
            { 
                
                PrepareUserRealmDataForAuthorization();

                // Get authorization code
                if (!await GetAuthorizationCodeAsync()
                                .ConfigureAwait(continueOnCapturedContext: true))
                {
                    return;
                }

                // Get access token for Discovery
                if (!await GetAccessTokenForDiscoveryAsync()
                                .ConfigureAwait(continueOnCapturedContext: true))
                {
                    return;
                }
            }
            catch (Exception ex)
            {
                this.Status.Text += "Exception caught: '" + ex.Message + "'.";
                this.Status.Foreground = ErrorBrush;
            }
        }

        private void PrepareUserRealmDataForAuthorization()
        {
            Config GetId = new Config();
            var accountType = m_settings["account_type"];

            // App registration for Microsoft Account (Live Id)
            if (accountType.Equals(AccountTypeMicrosoft))
            {
                m_settings["client_id"] = GetId.MicrosoftAccountClientId;
                m_settings["client_secret"] = GetId.MicrosoftAccountClientSecret;
                m_settings["authz_redirect_uri"] = GetId.MicrosoftAccountRedirectUri;  
            }

            // App registration for Organizational account (Office 365 account)
            else if (accountType.Equals(AccountTypeOrganizational))
            {
                m_settings["client_id"] = GetId.OrganizationalAccountClientId;
                m_settings["client_secret"] = string.Empty; 
                m_settings["authz_redirect_uri"] = GetId.OrganizationalAccountRedirectUri; 
            }

        }

        private async Task<bool> GetAuthorizationCodeAsync()
        {
            var accountType = m_settings["account_type"];
            var authzService = m_settings["authorization_service"];
            var clientId = m_settings["client_id"];
            var clientSecret = m_settings["client_secret"];
            var scope = m_settings.ContainsKey("scope") ? m_settings["scope"] : string.Empty;
            var userEmail = m_settings["user_email"];
            var redirectUri = m_settings["authz_redirect_uri"];

            var url = string.Format("{0}?response_type=code&client_id={1}{2}{3}&{4}={5}&redirect_uri={6}",
                                    authzService,
                                    clientId,
                                    !string.IsNullOrEmpty(clientSecret) ? "&client_secret=" + WebUtility.UrlEncode(clientSecret) : string.Empty,
                                    !string.IsNullOrEmpty(scope) ? "&scope=" + WebUtility.UrlEncode(scope) : string.Empty,
                                    accountType.Equals(AccountTypeMicrosoft) ? "username" : "login_hint",
                                    WebUtility.UrlEncode(userEmail),
                                    WebUtility.UrlEncode(redirectUri));
            this.Status.Text += url + "\n";

            // Navigate using the WebAuthenticationBroker!
            var webAuthResult = await WebAuthenticationBroker.AuthenticateAsync(WebAuthenticationOptions.None, new Uri(url), new Uri(redirectUri))
                .AsTask().ConfigureAwait(continueOnCapturedContext: true);

            // Process the navigation result
            if (webAuthResult.ResponseStatus == WebAuthenticationStatus.Success)
            {
                string authzCode = null;

                // Parse the output parameters
                var queryParams = SplitQueryString(webAuthResult.ResponseData);
                foreach (var param in queryParams)
                {
                    // Split the current parameter into name and value
                    var parts = param.Split('=');
                    var paramName = parts[0].ToLowerInvariant().Trim();
                    var paramValue = WebUtility.UrlDecode(parts[1]).Trim();

                    // Log the output parameter
                    this.Status.Text += string.Format("{0} = '{1}'\n", paramName, paramValue);

                    // Process the output parameter
                    if (paramName.Equals("code"))
                    {
                        authzCode = paramValue;
                        m_settings["authz_code"] = paramValue;
                    }
                }

                // Return the final result
                return !string.IsNullOrWhiteSpace(authzCode);
            }

            // Consent was not obtained
            this.Status.Text += string.Format("Consent was not obtained. Status: '{0}', Error: '{1}', Data: '{2}'\n",
                                            webAuthResult.ResponseStatus,
                                            webAuthResult.ResponseErrorDetail,
                                            webAuthResult.ResponseData);
            this.Status.Foreground = ErrorBrush;
            return false;
        }

        private Task<bool> GetAccessTokenForDiscoveryAsync()
        {
            var resource = m_settings["discovery_resource"];
            var grantType = "authorization_code";
            var grantName = "code";
            var grant = m_settings["authz_code"];

            return GetAccessTokenAsync(grantType, grantName, grant, resource);
        }

        private Task<bool> GetAccessTokenForServiceAsync()
        {
            var resource = m_settings[DiscoveryXElements.ServiceResourceId.LocalName];
            var grantType = "refresh_token";
            var grantName = "refresh_token";
            var grant = m_settings["refresh_token"];

            return GetAccessTokenAsync(grantType, grantName, grant, resource);
        }

        private async Task<bool> GetAccessTokenAsync(string grantType, string grantName, string grant, string resource)
        {
            var tokenService = m_settings["token_service"];
            var clientId = m_settings["client_id"];
            var clientSecret = m_settings["client_secret"];
            var redirectUri = m_settings["authz_redirect_uri"];

            // Build request body
            var requestBody = string.Format("grant_type={0}&{1}={2}&client_id={3}{4}{5}&redirect_uri={6}",
                                    grantType,
                                    grantName,
                                    grant,
                                    clientId,
                                    !string.IsNullOrEmpty(clientSecret) ? "&client_secret=" + WebUtility.UrlEncode(clientSecret) : string.Empty,
                                    !string.IsNullOrEmpty(resource) ? "&resource=" + WebUtility.UrlEncode(resource) : string.Empty,
                                    WebUtility.UrlEncode(redirectUri));
            var requestBytes = Encoding.UTF8.GetBytes(requestBody);
            this.Status.Text += requestBody + "\n";

            // Build request
            var request = HttpWebRequest.CreateHttp(tokenService);
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            var requestStream = await request.GetRequestStreamAsync()
                                                    .ConfigureAwait(continueOnCapturedContext: true);
            await requestStream.WriteAsync(requestBytes, 0, requestBytes.Length);

            // Get response
            var response = await request.GetResponseAsync()
                                            .ConfigureAwait(continueOnCapturedContext: true) 
                                as HttpWebResponse;
            var responseReader = new StreamReader(response.GetResponseStream());
            var responseBody = await responseReader.ReadToEndAsync()
                                                        .ConfigureAwait(continueOnCapturedContext: true);

            if (response.StatusCode == HttpStatusCode.OK)
            {
                // Parse the JWT
                var jwt = JsonObject.Parse(responseBody);
                var accessToken = jwt["access_token"].GetString();
                var refreshToken = jwt["refresh_token"].GetString();

                m_settings["access_token"] = accessToken;
                m_settings["refresh_token"] = refreshToken;
                
                this.Status.Text += string.Format("access_token = '{0}'\nrefresh_token = '{1}'\n",
                                                        accessToken,
                                                        refreshToken);
                return true;
            }

            // Consent was not obtained
            this.Status.Text += string.Format("Access token was not obtained. Status: '{0}', Body: '{1}'\n",
                                            response.StatusCode,
                                            responseBody);
            this.Status.Foreground = ErrorBrush;
            return false;
        }

        #endregion

        #region Discover
        private async void DiscoverButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Discover the service for the desired capability
                var accessToken = m_settings["access_token"];
                var discoveryService = m_settings["discovery_service"];
                var url = string.Format("{0}/services", discoveryService);

                // Build request
                var request = HttpWebRequest.CreateHttp(url);
                request.Method = "GET";
                request.Headers["Authorization"] = "Bearer " + accessToken;

                // Get response
                var response = await request.GetResponseAsync()
                                                .ConfigureAwait(continueOnCapturedContext: true)
                                    as HttpWebResponse;
                var responseReader = new StreamReader(response.GetResponseStream());
                var responseBody = await responseReader.ReadToEndAsync()
                                                            .ConfigureAwait(continueOnCapturedContext: true);

                // Load the XML of the response body
                using (var xdocReader = new StringReader(responseBody))
                {
                    var xdoc = XDocument.Load(xdocReader);
                    if (xdoc != null)
                    {
                        foreach (var entryElement in xdoc.Root.Elements(DiscoveryXElements.EntryAtom))
                        {
                            var contentElement = entryElement.Element(DiscoveryXElements.ContentAtom);
                            var propertiesElement = contentElement.Element(DiscoveryXElements.PropertiesMetadata);
                            var capabilityElement = propertiesElement.Element(DiscoveryXElements.Capability);
                            var serviceIdElement = propertiesElement.Element(DiscoveryXElements.ServiceId);
                            var serviceUriElement = propertiesElement.Element(DiscoveryXElements.ServiceEndpointUri);
                            var serviceResourceIdElement = propertiesElement.Element(DiscoveryXElements.ServiceResourceId);

                            // Since this is a MyFiles app, we only store the MyFiles service
                            if (capabilityElement.Value.Equals(MyFiles, StringComparison.OrdinalIgnoreCase))
                            {
                                m_settings[DiscoveryXElements.ServiceEndpointUri.LocalName] = serviceUriElement.Value;
                                m_settings[DiscoveryXElements.ServiceResourceId.LocalName] = serviceResourceIdElement.Value;
                            }

                            this.Status.Text += "**********************************\n";
                            this.Status.Text += capabilityElement.Value + "\n";
                            this.Status.Text += serviceIdElement.Value + "\n";
                            this.Status.Text += serviceUriElement.Value + "\n";
                            this.Status.Text += serviceResourceIdElement.Value + "\n";
                        }
                        this.Status.Text += "**********************************\n";
                    }
                }
            }
            catch (Exception ex)
            {
                this.Status.Text += "Exception caught: '" + ex.Message + "'.";
                this.Status.Foreground = ErrorBrush;
            }
        }
        #endregion

        #region Get Token for Target Service
        private async void TokenButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var accountType = m_settings["account_type"];

                if (accountType.Equals(AccountTypeMicrosoft))
                {
                    this.Status.Text += "The original token is good for Live. No new token is needed.\n";
                }
                else
                {
                    // Get access token for the target service
                    if (!await GetAccessTokenForServiceAsync()
                                    .ConfigureAwait(continueOnCapturedContext: true))
                    {
                        return;
                    }
                }
            }
            catch (Exception ex)
            {
                this.Status.Text += "Exception caught: '" + ex.Message + "'.";
                this.Status.Foreground = ErrorBrush;
            }
        }
        #endregion

        #region Get Files
        private async void FilesButton_Click(object sender, RoutedEventArgs e)
        {
            this.Status.Text += "==============================\n";

            try
            {
                var json = await GetFilesAsJsonAsync();
                ParseJson(json);
            }
            catch (Exception ex)
            {
                this.Status.Text += "Exception caught: '" + ex.Message + "'.";
                this.Status.Foreground = ErrorBrush;
            }
        }

        private async Task<JsonObject> GetFilesAsJsonAsync()
        {
            var filesService = m_settings[DiscoveryXElements.ServiceEndpointUri.LocalName];
            var accessToken = m_settings["access_token"];

            // Build request
            var url = filesService + "/files";
            var request = HttpWebRequest.CreateHttp(url);
            request.Method = "GET";
            request.Accept = "application/json;odata=verbose";
            request.Headers["Authorization"] = "Bearer " + accessToken;

            // Get response
            var response = await request.GetResponseAsync()
                                            .ConfigureAwait(continueOnCapturedContext: true)
                                as HttpWebResponse;
            var responseReader = new StreamReader(response.GetResponseStream());
            var responseBody = await responseReader.ReadToEndAsync()
                                                        .ConfigureAwait(continueOnCapturedContext: true);

            if (response.StatusCode == HttpStatusCode.OK)
            {
                // Parse the JSON result
                var jsonResult = JsonObject.Parse(responseBody);
                return jsonResult;
            }

            // Consent was not obtained
            this.Status.Text += string.Format("Request failed. Status: '{0}', Body: '{1}'\n",
                                            response.StatusCode,
                                            responseBody);
            this.Status.Foreground = ErrorBrush;

            return null;
        }

        private void ParseJson(JsonObject json)
        {
            // The JSON responses from SkyDrive and SkyDrive Pro are slightly different
            JsonArray files = null;
            string name = null;
            var accountType = m_settings["account_type"];
            if (accountType.Equals(AccountTypeMicrosoft))
            {
                files = json["data"].GetArray();
                name = "name";
            }
            else if (accountType.Equals(AccountTypeOrganizational))
            {
                files = json["d"].GetObject()["results"].GetArray();
                name = "Name";
            }
            else
            {
                throw new InvalidOperationException(string.Format("Can't get files for account type '{0}'.", accountType));
            }

            // Traverse the files JsonArray and show the item names 
            foreach (var file in files)
            {
                var nameValue = file.GetObject()[name].GetString();
                this.Status.Text += string.Format("'{0}'\n", nameValue);
            }
        }
        #endregion

    }
}
