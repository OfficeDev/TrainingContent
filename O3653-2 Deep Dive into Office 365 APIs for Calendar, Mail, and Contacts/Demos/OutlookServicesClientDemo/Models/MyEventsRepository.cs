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
using OutlookServicesClientDemo.Utils;

namespace OutlookServicesClientDemo.Models {
  public class MyEventsRepository {
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
      CapabilityDiscoveryResult dcr = await discovery.DiscoverCapabilityAsync("Calendar");

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