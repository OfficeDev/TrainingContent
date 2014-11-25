using Microsoft.Office365.ActiveDirectory;
using Microsoft.Office365.OAuth;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExchangeClientDemo
{
    public static class ActiveDirectoryApiSample
    {
        const string ServiceResourceId = "https://graph.windows.net/";
        static readonly Uri ServiceEndpointUri = new Uri("https://graph.windows.net/");

        // Do not make static in Web apps; store it in session or in a cookie instead
        static string _lastLoggedInUser;
        static DiscoveryContext _discoveryContext;

        public static async Task<IEnumerable<IUser>> GetUsers()
        {
            var client = await EnsureClientCreated();


            var userResults = await client.DirectoryObjects.OfType<IUser>().ExecuteAsync();

            var u = await client.Me.ToUser().ExecuteAsync();


            List<IUser> allUsers = new List<IUser>();

            do
            {
                allUsers.AddRange(userResults.CurrentPage);
                userResults = await userResults.GetNextPageAsync();
            } while (userResults != null);

            return allUsers;
        }

        public static async Task<AadGraphClient> EnsureClientCreated()
        {
            if (_discoveryContext == null)
            {
                _discoveryContext = await DiscoveryContext.CreateAsync();
            }

            var dcr = await _discoveryContext.DiscoverResourceAsync(ServiceResourceId);

            _lastLoggedInUser = dcr.UserId;

            return new AadGraphClient(new Uri(ServiceEndpointUri, dcr.TenantId), async () =>
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
