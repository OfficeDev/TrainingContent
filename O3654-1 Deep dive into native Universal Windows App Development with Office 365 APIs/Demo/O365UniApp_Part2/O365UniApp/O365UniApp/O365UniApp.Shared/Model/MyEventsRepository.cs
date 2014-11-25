using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using Windows.Security.Authentication.Web;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Office365.Discovery;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.OutlookServices;
using O365UniApp;

public class MyEventsRepository {
  private static readonly string ClientID = App.Current.Resources["ida:ClientID"].ToString();
  private static Uri ReturnUri = WebAuthenticationBroker.GetCurrentApplicationCallbackUri();
  private static readonly string CommonAuthority = App.Current.Resources["ida:AuthorizationUri"].ToString() + @"/Common";
  private static readonly Uri DiscoveryServiceEndpointUri = new Uri("https://api.office.com/discovery/v1.0/me/");
  private const string DiscoveryResourceId = "https://api.office.com/discovery/";

  static string _lastLoggedInUser;
  static DiscoveryContext _discoveryContext;

  public static AuthenticationContext AuthenticationContext { get; set; }

  /// <summary>
  /// Checks that an OutlookServicesClient object is available. 
  /// </summary>
  /// <returns>The OutlookServicesClient object. </returns>
  public static async Task<OutlookServicesClient> EnsureClientCreated() {
    AuthenticationContext = new AuthenticationContext(CommonAuthority);

    if (AuthenticationContext.TokenCache.ReadItems().Count() > 0) {
      // Bind the AuthenticationContext to the authority that sourced the token in the cache 
      // this is needed for the cache to work when asking for a token from that authority 
      // (the common endpoint never triggers cache hits) 
      string cachedAuthority = AuthenticationContext.TokenCache.ReadItems().First().Authority;
      AuthenticationContext = new AuthenticationContext(cachedAuthority);

    }

    // Create a DiscoveryClient using the discovery endpoint Uri.  
    DiscoveryClient discovery = new DiscoveryClient(DiscoveryServiceEndpointUri,
        async () => await AcquireTokenAsync(AuthenticationContext, DiscoveryResourceId));

    // Now get the capability that you are interested in.
    var result = await discovery.DiscoverCapabilityAsync("Mail");

    var client = new OutlookServicesClient(
        result.ServiceEndpointUri,
        async () => await AcquireTokenAsync(AuthenticationContext, result.ServiceResourceId));

    return client;
  }

  // Get an access token for the given context and resourceId. An attempt is first made to 
  // acquire the token silently. If that fails, then we try to acquire the token by prompting the user.
  private static async Task<string> AcquireTokenAsync(AuthenticationContext context, string resourceId) {
    string accessToken = null;

    try {
      // First, we are going to try to get the access token silently using the resourceId that was passed in
      // and the clientId of the application...
      accessToken = (await context.AcquireTokenSilentAsync(resourceId, ClientID)).AccessToken;
    } catch (Exception) {
      // We were unable to acquire the AccessToken silently. So, we'll try again with full
      // prompting. 
      accessToken = null;

    }

    if (accessToken == "" || accessToken == null)
      accessToken = (await context.AcquireTokenAsync(resourceId, ClientID, ReturnUri)).AccessToken;

    return accessToken;
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

    foreach (var calendarEvent in calendarEvents) {

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
