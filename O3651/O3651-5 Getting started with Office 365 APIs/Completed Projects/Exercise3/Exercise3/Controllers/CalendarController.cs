using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Exercise.Utils;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Security.Claims;
using System.Threading.Tasks;
using Exercise.Models;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using Microsoft.Graph;

namespace Exercise.Controllers
{
    [Authorize]
    public class CalendarController : Controller
    {
        // GET: Calendar
        public async Task<ActionResult> Index()
        {
            var eventsResults = new List<MyEvent>();
            var accessToken = await GetGraphAccessTokenAsync();

            try
            {
                var graphService = GetGraphServiceClient(accessToken);
                var request = graphService.Me.Events.Request(new Option[] { new QueryOption("top", "20"), new QueryOption("skip", "0") });
                var userEventsCollectionPage = await request.GetAsync();
                foreach (var evnt in userEventsCollectionPage)
                {
                    eventsResults.Add(new MyEvent
                    {
                        Subject = !string.IsNullOrEmpty(evnt.Subject) ? evnt.Subject : string.Empty,
                        Start = !string.IsNullOrEmpty(evnt.Start.DateTime) ? DateTime.Parse(evnt.Start.DateTime) : new DateTime(),
                        End = !string.IsNullOrEmpty(evnt.End.DateTime) ? DateTime.Parse(evnt.End.DateTime) : new DateTime()

                    });
                }
            }
            catch (Exception el)
            {
                el.ToString();
            }

            ViewBag.Events = eventsResults.OrderBy(c => c.Start);
            return View();
        }

        public async Task<string> GetGraphAccessTokenAsync()
        {
            var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
            var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;

            var clientCredential = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
            var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

            // create auth context
            AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureAdAuthority, new ADALTokenCache(signInUserId));
            var result = await authContext.AcquireTokenSilentAsync(SettingsHelper.AzureAdGraphResourceURL, clientCredential, userIdentifier);

            return result.AccessToken;
        }

        public static GraphServiceClient GetGraphServiceClient(string token)
        {
            var authenticationProvider = new DelegateAuthenticationProvider(
                (requestMessage) =>
                {
                    requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    return Task.FromResult(0);
                });

            return new GraphServiceClient(SettingsHelper.GraphResourceUrl, authenticationProvider);
        }
    }
}