using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Exercise2.Utils;
using Microsoft.Ajax.Utilities;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.Discovery;
using Microsoft.Office365.OutlookServices;
using System.Security.Claims;
using System.Threading.Tasks;


namespace Exercise2.Controllers {
  [Authorize]
  public class CalendarController : Controller {
    // GET: Calendar
    public async Task<ActionResult> Index() {
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
  }
}