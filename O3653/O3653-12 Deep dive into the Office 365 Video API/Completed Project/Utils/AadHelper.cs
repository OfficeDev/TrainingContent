using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace VideoApiWeb.Utils {
  public class AadHelper {
    private static string _accessToken = string.Empty;

    public static async Task<string> GetAccessToken() {
      if (string.IsNullOrEmpty(_accessToken)) {

        // fetch from stuff user claims
        var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;

        // discover contact endpoint
        var clientCredential = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
        var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

        // create auth context
        AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureADAuthority,
          new EfAdalTokenCache(userObjectId));

        // authenticate
        var authResult =
          await
            authContext.AcquireTokenSilentAsync(
              string.Format("https://{0}.sharepoint.com", SettingsHelper.Office365TenantId), clientCredential,
              userIdentifier);

        // obtain access token
        _accessToken = authResult.AccessToken;
      }

      return _accessToken;
    }
  }
}