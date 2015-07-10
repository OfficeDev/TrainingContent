using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Web;
using Office365Calendar.Utils;
using Office365Calendar.Models;
using Microsoft.Office365.Discovery;
using Microsoft.Office365.OutlookServices;
using System.IO;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace Office365Calendar.Models {
  public class MyEventsRepository {

    public bool MorePagesAvailable { get; private set; }

    public async Task<List<MyEvent>> GetEvents(int pageIndex, int pageSize) {
      var client = await EnsureClientCreated();

      var eventsResults = await (from ev in client.Me.Events
                                 select ev)
                                 .Skip(pageIndex * pageSize)
                                 .Take(pageSize)
                                 .ExecuteAsync();

      var events = eventsResults.CurrentPage.OrderBy(e => e.Start);

      // indicate if more results available
      MorePagesAvailable = eventsResults.MorePagesAvailable;

      var eventList = new List<MyEvent>();
      foreach (var myEvent in events) {
        var newEvent = new MyEvent {
          Id = myEvent.Id,
          Subject = myEvent.Subject,
          Start = myEvent.Start,
          End = myEvent.End
        };
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

      var newEvent = new MyEvent {
        Id = ev.Id,
        Subject = ev.Subject,
        Start = ev.Start,
        End = ev.End
      };
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

      var myEventLocation = new Location {
        DisplayName = myEvent.Location
      };

      var newEvent = new Event {
        Subject = myEvent.Subject,
        Start = myEvent.Start,
        End = myEvent.End,
        Location = myEventLocation
      };
      await client.Me.Events.AddEventAsync(newEvent);
    }

    public async Task<List<MyEvent>> Search(string searchTerm) {
      var client = await EnsureClientCreated();

      var eventsResults = await (from ev in client.Me.Events
        where ev.Subject.Contains(searchTerm)
        select ev)
        .ExecuteAsync();

      var events = eventsResults.CurrentPage.OrderBy(e => e.Start);

      var eventList = new List<MyEvent>();
      foreach (var myEvent in events) {
        var newEvent = new MyEvent {
          Id = myEvent.Id,
          Subject = myEvent.Subject,
          Start = myEvent.Start,
          End = myEvent.End
        };
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

    private async Task<OutlookServicesClient> EnsureClientCreated() {
      // fetch from stuff user claims
      var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
      var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;

      // discover endpoint
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