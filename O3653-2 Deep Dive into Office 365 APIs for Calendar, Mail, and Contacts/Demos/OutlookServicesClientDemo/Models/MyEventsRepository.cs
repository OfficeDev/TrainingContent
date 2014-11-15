using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Web;
using OutlookServicesClientDemo.Models;
using Microsoft.Office365.Discovery;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.OutlookServices;
using System.IO;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace OutlookServicesClientDemo.Models {
  public class MyEventsRepository {
    private static string CLIENT_ID = ConfigurationManager.AppSettings["ida:ClientID"];
    private static string CLIENT_SECRET = ConfigurationManager.AppSettings["ida:Password"];
    private static string TENANT_ID = ConfigurationManager.AppSettings["tenantId"];
    const string DISCOVERY_ENDPOINT = "https://api.office.com/discovery/v1.0/me/";
    const string DISCOVERY_RESOURCE = "https://api.office.com/discovery/";

    public async Task<List<MyEvent>> GetEvents() {

      var client = await EnsureClientCreated();

      var eventsResults = await (from ev in client.Me.Events
                                 where ev.End >= DateTimeOffset.UtcNow
                                 select ev).Take(10).ExecuteAsync();

      var events = eventsResults.CurrentPage.OrderBy(e => e.Start);

      var eventList = new List<MyEvent>();

      foreach (var myEvent in events) {
        MyEvent newEvent = new MyEvent();
        newEvent.Id = myEvent.Id;
        newEvent.Subject = myEvent.Subject;
        newEvent.Start = myEvent.Start;
        myEvent.End = myEvent.End;
        if (myEvent.Body != null) {
          newEvent.Body = myEvent.Body.Content;
        }
        if (myEvent.Location != null) {
          newEvent.Location = myEvent.Location.DisplayName;
        }
        if (myEvent.Start != null) {
          newEvent.Start = myEvent.Start;
        }

        eventList.Add(newEvent);
      }

      return eventList;

    }

    public async Task<MyEvent> GetEvent(string id) {
      var client = await EnsureClientCreated();
      var ev = await client.Me.Events.GetById(id).ExecuteAsync();

      MyEvent newEvent = new MyEvent();
      newEvent.Id = ev.Id;
      newEvent.Subject = ev.Subject;
      newEvent.Start = ev.Start;
      newEvent.End = ev.End;
      if (ev.Location != null) {
        newEvent.Location = ev.Location.DisplayName;
      }
      if (ev.Body != null) {
        newEvent.Body = ev.Body.Content;
      }

      return newEvent;
    }

    public async Task DeleteEvent(string id) {
      var client = await EnsureClientCreated();
      var myEvent = await client.Me.Events.GetById(id).ExecuteAsync();
      await myEvent.DeleteAsync();
    }

    public async Task AddEvent(MyEvent myEvent) {
      var client = await EnsureClientCreated();

      Location myEventLocation = new Location();
      myEventLocation.DisplayName = myEvent.Location;

      var newEvent = new Event {
        Subject = myEvent.Subject,
        Start = myEvent.Start,
        End = myEvent.End,
        Location = myEventLocation
      };
      await client.Me.Events.AddEventAsync(newEvent);
    }

    private async Task<OutlookServicesClient> EnsureClientCreated() {
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
      DiscoveryClient discoveryClient = new DiscoveryClient(new Uri(DISCOVERY_ENDPOINT),
        async () => {
          var authResult = await authContext.AcquireTokenSilentAsync(DISCOVERY_RESOURCE, clientCredential, userIdentifier);

          return authResult.AccessToken;
        });

      // query discovery service for endpoint for 'calendar' endpoint
      CapabilityDiscoveryResult dcr = await discoveryClient.DiscoverCapabilityAsync("Calendar");

      // create an OutlookServicesclient
      return new OutlookServicesClient(dcr.ServiceEndpointUri,
        async () => {
          var authResult =
            await
              authContext.AcquireTokenSilentAsync(dcr.ServiceResourceId, clientCredential, userIdentifier);
          return authResult.AccessToken;
        });
    }

  }
}