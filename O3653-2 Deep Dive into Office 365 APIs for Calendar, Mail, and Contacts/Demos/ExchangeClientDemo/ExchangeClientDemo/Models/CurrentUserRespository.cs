using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;
using System.IO;
using System.Threading.Tasks;

namespace ExchangeClientDemo.Models {
    public class CurrentUserRespository {

        public async Task<IUser> GetCurrentUser() {          
            var client = await EnsureClientCreated();
            var user = await client.Me.ToUser().ExecuteAsync();
            SaveInCache("currentUserEmail", user.Id);
            return user;
        }

        private async Task<ExchangeClient> EnsureClientCreated() {

            DiscoveryContext disco = GetFromCache("DiscoveryContext") as DiscoveryContext;

            if (disco == null) {
                disco = await DiscoveryContext.CreateAsync();
                SaveInCache("DiscoveryContext", disco);
            }

            string ServiceResourceId = "https://outlook.office365.com";
            Uri ServiceEndpointUri = new Uri("https://outlook.office365.com/ews/odata");

            var dcr = await disco.DiscoverResourceAsync(ServiceResourceId);

            SaveInCache("LastLoggedInUser", dcr.UserId);

            return new ExchangeClient(ServiceEndpointUri, async () => {
                return (await disco.AuthenticationContext.AcquireTokenByRefreshTokenAsync(
                    new SessionCache().Read("RefreshToken"),
                    new Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential(
                        disco.AppIdentity.ClientId,
                        disco.AppIdentity.ClientSecret),
                        ServiceResourceId)).AccessToken;
            });

        }

        
        private void SaveInCache(string name, object value) {
            System.Web.HttpContext.Current.Session[name] = value;
        }

        private object GetFromCache(string name) {
            return System.Web.HttpContext.Current.Session[name];
        }

        private void RemoveFromCache(string name) {
            System.Web.HttpContext.Current.Session.Remove(name);
        }

    }
}