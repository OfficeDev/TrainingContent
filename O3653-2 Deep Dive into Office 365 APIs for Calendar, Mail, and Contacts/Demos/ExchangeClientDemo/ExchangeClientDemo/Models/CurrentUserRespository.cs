using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;
using System.IO;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

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

          string clientId = disco.AppIdentity.ClientId;
          string clientSecret = disco.AppIdentity.ClientSecret;
          SaveInCache("LastLoggedInUser", dcr.UserId);

          // create ExchangeClient object with callback function for obtaining access token
          ExchangeClient exClient = new ExchangeClient(ServiceEndpointUri, async () => {
            // prepare for call across network
            AuthenticationContext authContext = disco.AuthenticationContext;
            ClientCredential creds = new ClientCredential(clientId, clientSecret);
            UserIdentifier userId = new UserIdentifier(dcr.UserId, UserIdentifierType.UniqueId);
            // call across network
            AuthenticationResult authResult =
              await authContext.AcquireTokenSilentAsync(ServiceResourceId, creds, userId);
            // return access token as string value
            return authResult.AccessToken;
          });

          return exClient;
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