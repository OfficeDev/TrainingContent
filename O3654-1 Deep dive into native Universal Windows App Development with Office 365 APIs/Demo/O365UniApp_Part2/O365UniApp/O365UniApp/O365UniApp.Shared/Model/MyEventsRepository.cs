using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.Exchange;

public class MyEventsRepository {

  const string ServiceResourceId = "https://outlook.office365.com";
  static readonly Uri ServiceEndpointUri = new Uri("https://outlook.office365.com/ews/odata");

  static string _lastLoggedInUser;
  static DiscoveryContext _discoveryContext;

  public static async Task<ExchangeClient> EnsureClientCreated() {

    if (_discoveryContext == null) {
      _discoveryContext = await DiscoveryContext.CreateAsync();
    }

    ResourceDiscoveryResult dcr = await _discoveryContext.DiscoverResourceAsync(ServiceResourceId);

    _lastLoggedInUser = dcr.UserId;

    ExchangeClient client;
    client = new ExchangeClient(ServiceEndpointUri, async () => {
      AuthenticationContext authContext = _discoveryContext.AuthenticationContext;
      string clientId = _discoveryContext.AppIdentity.ClientId;
      var userIdentifier = new UserIdentifier(dcr.UserId, UserIdentifierType.UniqueId);
      AuthenticationResult authResult = await authContext.AcquireTokenSilentAsync(ServiceResourceId, 
                                                                                  clientId, 
                                                                                  userIdentifier);
      return authResult.AccessToken;
    });

    return client;
  }

  public static async Task<IOrderedEnumerable<IEvent>> GetCalendarEvents() {

    var client = await EnsureClientCreated();

    // create query to send across network
    var eventsQuery = from calendarEvent in client.Me.Events
                      where calendarEvent.End >= DateTimeOffset.UtcNow
                      select calendarEvent;

    // execute query
    var eventsQueryResults = await eventsQuery.Take(10).ExecuteAsync();

    // return IOrderedEnumerable<IEvent> to caller
    return eventsQueryResults.CurrentPage.OrderBy(e => e.Start);

  }

  public static async Task<ObservableCollection<MyEvent>> GetEvents() {

    ObservableCollection<MyEvent> eventsCollection = new ObservableCollection<MyEvent>();

    var calendarEvents = await GetCalendarEvents();

    foreach(var calendarEvent in calendarEvents){

      eventsCollection.Add(new MyEvent {
        Subject = calendarEvent.Subject,
        Start = calendarEvent.Start,
        End = calendarEvent.End,
        Location = calendarEvent.Location.DisplayName
      });

    }
    return eventsCollection;
  }

}
