using Microsoft.Office365.OAuth;
using Microsoft.Office365.SharePoint;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace O365Discovery
{
    static class  MyFilesApiSample
    {
        const string MyFilesCapability = "MyFiles";

        // Do not make static in Web apps; store it in session or in a cookie instead
        static string _lastLoggedInUser;
        static DiscoveryContext _discoveryContext;

        public static async Task<IEnumerable<IFileSystemItem>> GetMyFiles()
        {
            var client = await EnsureClientCreated();

            // Obtain files in folder "Shared with Everyone"
            var filesResults = await client.Files["Shared with Everyone"].ToFolder().Children.ExecuteAsync();
            var files = filesResults.CurrentPage.OrderBy(e => e.Name);

            return files;
        }
    
        public static async Task<SharePointClient> EnsureClientCreated()
        {
            if (_discoveryContext == null)
            {
                _discoveryContext = await DiscoveryContext.CreateAsync();
            }

            var dcr = await _discoveryContext.DiscoverCapabilityAsync(MyFilesCapability);
            
            var ServiceResourceId = dcr.ServiceResourceId;
            var ServiceEndpointUri = dcr.ServiceEndpointUri;

            _lastLoggedInUser = dcr.UserId;

            // Create the MyFiles client proxy:
            return new SharePointClient(ServiceEndpointUri, async () =>
            {
                return (await _discoveryContext.AuthenticationContext.AcquireTokenByRefreshTokenAsync(new SessionCache().Read("RefreshToken"), new Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential(_discoveryContext.AppIdentity.ClientId, _discoveryContext.AppIdentity.ClientSecret), ServiceResourceId)).AccessToken;
            });
        }

        public static Uri SignOut(string postLogoutRedirect)
        {
            if (_discoveryContext == null)
            {
                _discoveryContext = new DiscoveryContext();
            }

            _discoveryContext.ClearCache();

            return _discoveryContext.GetLogoutUri<SessionCache>(postLogoutRedirect);
        }
    }
}
