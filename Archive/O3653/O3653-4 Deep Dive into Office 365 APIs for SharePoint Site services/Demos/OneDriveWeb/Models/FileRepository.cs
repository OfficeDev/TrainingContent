using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.Discovery;
using Microsoft.Office365.SharePoint;
using Microsoft.Office365.SharePoint.CoreServices;
using Microsoft.Office365.SharePoint.FileServices;
using OneDriveWeb.Utils;
using System.Configuration;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OneDriveWeb.Models {
  public class FileRepository {
    public async Task<IEnumerable<IItem>> GetMyFiles(int pageIndex, int pageSize) {
      var client = await EnsureClientCreated();

      var filesResults = await client.Files.ExecuteAsync();
      return filesResults.CurrentPage.OrderBy(e => e.Name).Skip(pageIndex * pageSize).Take(pageSize);
    }

    public async Task<File> UploadFile(System.IO.Stream filestream, string filename) {
      var client = await EnsureClientCreated();

      File newFile = new File {
        Name = filename        
      };

      // create the entry for the file
      await client.Files.AddItemAsync(newFile);
      await client.Files.GetById(newFile.Id).ToFile().UploadAsync(filestream);

      return newFile;
    }

    public async Task DeleteFile(string id) {
      var client = await EnsureClientCreated();

      IFile file = await client.Files.GetById(id).ToFile().ExecuteAsync();
      await file.DeleteAsync();
    }

    private async Task<SharePointClient> EnsureClientCreated() {
      // fetch from stuff user claims
      var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
      var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;

      // discover contact endpoint
      var clientCredential = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
      var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

      // create auth context
      AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureADAuthority, new EFADALTokenCache(signInUserId));

      // create O365 discovery client 
      DiscoveryClient discovery = new DiscoveryClient(new Uri(SettingsHelper.O365DiscoveryServiceEndpoint),
        async () => {
          var authResult = await authContext.AcquireTokenSilentAsync(SettingsHelper.O365DiscoveryResourceId, clientCredential, userIdentifier);

          return authResult.AccessToken;
        });

      // query discovery service for endpoint for 'calendar' endpoint
      CapabilityDiscoveryResult dcr = await discovery.DiscoverCapabilityAsync("MyFiles");

      // create an OutlookServicesclient
      return new SharePointClient(dcr.ServiceEndpointUri,
        async () => {
          var authResult =
            await
              authContext.AcquireTokenSilentAsync(dcr.ServiceResourceId, clientCredential, userIdentifier);
          return authResult.AccessToken;
        });
    }
  }
}