using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Microsoft.Ajax.Utilities;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.Discovery;
using Microsoft.Office365.OutlookServices;
using System.Configuration;
using System.Security.Claims;
using System.Threading.Tasks;


namespace Exercise2.Controllers {
  [Authorize]
  public class HomeController : Controller {
    private static string CLIENT_ID = ConfigurationManager.AppSettings["ida:ClientID"];
    private static string CLIENT_SECRET = ConfigurationManager.AppSettings["ida:Password"];
    private static string TENANT_ID = ConfigurationManager.AppSettings["tenantId"];
    const string DISCOVERY_ENDPOINT = "https://api.office.com/discovery/v1.0/me/";
    const string DISCOVERY_RESOURCE = "https://api.office.com/discovery/";

    public async Task<ActionResult> Index() {
      // fetch from stuff user claims
      var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
      var userObjectId =
        ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;

      // create the authority by concatenating the URI added by O365 API tools in web.config 
      //  & user's tenant ID provided in the claims when the logged in
      var tenantAuthority = string.Format("{0}/{1}",
        ConfigurationManager.AppSettings["ida:AuthorizationUri"],
        TENANT_ID);

      // discover contact endpoint
      var clientCredential = new ClientCredential(CLIENT_ID, CLIENT_SECRET);
      var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

      // create auth context
      AuthenticationContext authContext = new AuthenticationContext(tenantAuthority, new Utils.NaiveSessionCache(signInUserId));

      // create O365 discovery client 
      DiscoveryClient discovery = new DiscoveryClient(new Uri(DISCOVERY_ENDPOINT),
        async () => {
          var authResult = await authContext.AcquireTokenSilentAsync(DISCOVERY_RESOURCE, clientCredential, userIdentifier);

          return authResult.AccessToken;
        });

      // query discovery service for endpoint for 'calendar' endpoint
      var dcr = await discovery.DiscoverCapabilityAsync("Calendar");

      // create Outlook client using the calendar api endpoint
      OutlookServicesClient client = new OutlookServicesClient(dcr.ServiceEndpointUri,
        async () => {
          var authResult = await authContext.AcquireTokenSilentAsync(dcr.ServiceResourceId, clientCredential,
          userIdentifier);

          return authResult.AccessToken;
        });

      // get contacts
      var results = await client.Me.Events.Take(20).ExecuteAsync();
      ViewBag.Events = results.CurrentPage.OrderBy(c => c.Start);

      return View();
    }

    public ActionResult About() {
      ViewBag.Message = "Your application description page.";

      return View();
    }

    public ActionResult Contact() {
      ViewBag.Message = "Your contact page.";

      return View();
    }
  }
}