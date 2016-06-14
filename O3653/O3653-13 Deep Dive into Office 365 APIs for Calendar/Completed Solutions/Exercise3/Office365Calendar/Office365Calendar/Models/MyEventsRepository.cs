using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Office365Calendar.Utils;
using System.Net.Http.Headers;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Linq;
using Microsoft.Graph;

namespace Office365Calendar.Models
{
    public class MyEventsRepository
    {
        private async Task<string> GetGraphAccessTokenAsync()
        {
            var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
            var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;

            var clientCredential = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
            var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

            AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureAdAuthority, new ADALTokenCache(signInUserId));
            var result = await authContext.AcquireTokenSilentAsync(SettingsHelper.AzureAdGraphResourceURL, clientCredential, userIdentifier);
            return result.AccessToken;
        }

        private async Task<GraphServiceClient> GetGraphServiceAsync()
        {
            var accessToken = await GetGraphAccessTokenAsync();
            var graphserviceClient = new GraphServiceClient(SettingsHelper.GraphResourceUrl,
                                          new DelegateAuthenticationProvider(
                                                        (requestMessage) =>
                                                        {
                                                            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", accessToken);
                                                            return Task.FromResult(0);
                                                        }));

            return graphserviceClient;
        }

        public async Task<List<MyEvent>> GetEvents(int pageIndex, int pageSize)
        {
            try
            {
                var graphServiceClient = await GetGraphServiceAsync();
                var requestEvents = await graphServiceClient.Me.Events.Request().Top(pageSize).Skip(pageIndex * pageSize).GetAsync();
                var eventsResults = requestEvents.CurrentPage.Select(x => new MyEvent
                {
                    Id = x.Id,
                    Subject = x.Subject,
                    Body = x.Body.Content,
                    Location = x.Location.DisplayName,
                    Start = DateTime.SpecifyKind(DateTime.Parse(x.Start.DateTime), x.Start.TimeZone == "UTC" ? DateTimeKind.Utc : DateTimeKind.Local),
                    End = DateTime.SpecifyKind(DateTime.Parse(x.End.DateTime), x.End.TimeZone == "UTC" ? DateTimeKind.Utc : DateTimeKind.Local),
                }).ToList();
                return eventsResults;
            }
            catch
            {
                return null;
            }
        }

        public async Task<MyEvent> GetEvent(string id)
        {
            try
            {
                var graphServiceClient = await GetGraphServiceAsync();
                var requestEvent = await graphServiceClient.Me.Events[id].Request().GetAsync();
                var eventResult = new MyEvent
                {
                    Id = requestEvent.Id,
                    Subject = requestEvent.Subject,
                    Body = requestEvent.Body.Content,
                    Location = requestEvent.Location.DisplayName,
                    Start = DateTime.SpecifyKind(DateTime.Parse(requestEvent.Start.DateTime), requestEvent.Start.TimeZone == "UTC" ? DateTimeKind.Utc : DateTimeKind.Local),
                    End = DateTime.SpecifyKind(DateTime.Parse(requestEvent.End.DateTime), requestEvent.End.TimeZone == "UTC" ? DateTimeKind.Utc : DateTimeKind.Local),
                };
                return eventResult;
            }
            catch
            {
                return null;
            }

        }

        public async Task DeleteEvent(string id)
        {
            try
            {
                var graphServiceClient = await GetGraphServiceAsync();
                await graphServiceClient.Me.Events[id].Request().DeleteAsync();
            }
            catch
            {
            }
            return;

        }

        public async Task AddEvent(MyEvent myEvent)
        {
            try
            {
                var graphServiceClient = await GetGraphServiceAsync();
                var requestEvent = new Microsoft.Graph.Event
                {
                    Subject = myEvent.Subject,
                    Start = new DateTimeTimeZone() { DateTime = myEvent.Start.ToString(), TimeZone = DateTimeKind.Local.ToString() },
                    End = new DateTimeTimeZone { DateTime = myEvent.Start.ToString(), TimeZone = DateTimeKind.Local.ToString() },
                    Location = new Microsoft.Graph.Location { DisplayName = myEvent.Location },
                    Body = new ItemBody { Content = myEvent.Body }
                };
                await graphServiceClient.Me.Events.Request().AddAsync(requestEvent);
            }
            catch
            {
            }
            return;
        }

        public async Task<List<MyEvent>> Search(string searchTerm)
        {
            try
            {
                var graphServiceClient = await GetGraphServiceAsync();
                var requestEvents = await graphServiceClient.Me.Events.Request().Filter(string.Format("startswith(subject,+'{0}')", searchTerm)).GetAsync();
                var eventsResults = requestEvents.CurrentPage.Select(x => new MyEvent
                {
                    Id = x.Id,
                    Subject = x.Subject,
                    Body = x.Body.Content,
                    Location = x.Location.DisplayName,
                    Start = DateTime.SpecifyKind(DateTime.Parse(x.Start.DateTime), x.Start.TimeZone == "UTC" ? DateTimeKind.Utc : DateTimeKind.Local),
                    End = DateTime.SpecifyKind(DateTime.Parse(x.End.DateTime), x.End.TimeZone == "UTC" ? DateTimeKind.Utc : DateTimeKind.Local),
                }).OrderBy(x=>x.Start).ToList();
                return eventsResults;
            }
            catch
            {
                return null;
            }
        }
    }
}