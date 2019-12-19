using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Identity.Client;
using Microsoft.Graph;

namespace Helpers
{
  public class MsalAuthenticationProvider : IAuthenticationProvider
  {
    private static MsalAuthenticationProvider _singleton;
    private IConfidentialClientApplication _application;
    private string[] _scopes;

    private MsalAuthenticationProvider(IConfidentialClientApplication application, string[] scopes)
    {
      _application = application;
      _scopes = scopes;
    }

    public static MsalAuthenticationProvider GetInstance(IConfidentialClientApplication application, string[] scopes)
    {
      if (_singleton == null)
      {
        _singleton = new MsalAuthenticationProvider(application, scopes);
      }

      return _singleton;
    }

    public async Task AuthenticateRequestAsync(HttpRequestMessage request)
    {
      request.Headers.Authorization = new AuthenticationHeaderValue("bearer", await GetTokenAsync());
    }

    public async Task<string> GetTokenAsync()
    {
      AuthenticationResult result = null;

      try {
        result = await _application.AcquireTokenForClient(_scopes).ExecuteAsync();
      } catch (MsalServiceException) { }

      return result.AccessToken;
    }
  }
}