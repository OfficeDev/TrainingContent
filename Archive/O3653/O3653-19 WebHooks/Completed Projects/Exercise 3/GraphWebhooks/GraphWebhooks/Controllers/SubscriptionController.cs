using System;
using System.Web;
using System.Web.Mvc;
using GraphWebhooks.Models;
using Newtonsoft.Json;
using System.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using GraphWebhooks.Auth;
using System.Security.Claims;
using GraphWebhooks.TokenStorage;

namespace GraphWebhooks.Controllers
{
    public class SubscriptionController : Controller
    {
        // GET: Subscription
        public ActionResult Index()
        {
            return View();
        }

        // Create webhooks subscriptions.
        [Authorize]
        public async Task<ActionResult> CreateSubscription()
        {

            // Build the request.
            HttpClient client = new HttpClient();
            string subscriptionsEndpoint = "https://graph.microsoft.com/v1.0/subscriptions/";
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, subscriptionsEndpoint);

            var subscription = new Subscription
            {
                Resource = "me/mailFolders('Inbox')/messages",
                ChangeType = "created",
                NotificationUrl = ConfigurationManager.AppSettings["ida:NotificationUrl"],
                ClientState = Guid.NewGuid().ToString(),
                ExpirationDateTime = DateTime.UtcNow + new TimeSpan(0, 0, 4230, 0)
            };
            string contentString = JsonConvert.SerializeObject(subscription, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
            request.Content = new StringContent(contentString, System.Text.Encoding.UTF8, "application/json");

            // Get an access token and add it to the client.
            try
            {
                string userObjId = AuthHelper.GetUserId(ClaimsPrincipal.Current);
                AuthHelper authHelper = new AuthHelper(new RuntimeTokenCache(userObjId));
                string accessToken = await authHelper.GetUserAccessToken("/");

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Error", new { message = ex.Message, debug = ex.StackTrace });
            }

            // Send the request and parse the response.
            HttpResponseMessage response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {

                // Parse the JSON response.
                string stringResult = await response.Content.ReadAsStringAsync();
                SubscriptionViewModel viewModel = new SubscriptionViewModel
                {
                    Subscription = JsonConvert.DeserializeObject<Subscription>(stringResult)
                };


                // This app temporarily stores the current subscription ID, client state, and user object ID. 
                // These are required so the NotificationController, which is not authenticated, can retrieve an access token from the cache.
                // Production apps typically use some method of persistent storage.
                HttpRuntime.Cache.Insert("subscriptionId_" + viewModel.Subscription.Id,
                    Tuple.Create(viewModel.Subscription.ClientState, AuthHelper.GetUserId(ClaimsPrincipal.Current)), null, DateTime.MaxValue, new TimeSpan(24, 0, 0), System.Web.Caching.CacheItemPriority.NotRemovable, null);

                // Save the latest subscription ID, so we can delete it later and filter the view on it.
                Session["SubscriptionId"] = viewModel.Subscription.Id;
                return View("Subscription", viewModel);
            }
            else
            {
                string debugString = await response.Content.ReadAsStringAsync();
                return RedirectToAction("Index", "Error", new { message = response.StatusCode, debug = debugString });
            }
        }

        // Delete the current webhooks subscription and sign the user out.
        [Authorize]
        public async Task<ActionResult> DeleteSubscription()
        {
            // Build the request.
            HttpClient client = new HttpClient();
            string serviceRootUrl = "https://graph.microsoft.com/v1.0/subscriptions/";

            string subscriptionId = (string)Session["SubscriptionId"];
            if (!string.IsNullOrEmpty(subscriptionId))
            {

                // Get an access token and add it to the client.
                try
                {
                    string userObjId = AuthHelper.GetUserId(ClaimsPrincipal.Current);
                    AuthHelper authHelper = new AuthHelper(new RuntimeTokenCache(userObjId));
                    string accessToken = await authHelper.GetUserAccessToken("/");

                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                }
                catch (Exception ex)
                {
                    return RedirectToAction("Index", "Error", new { message = ex.Message, debug = ex.StackTrace });
                }

                // Send the 'DELETE /subscriptions/id' request.
                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, serviceRootUrl + subscriptionId);
                HttpResponseMessage response = await client.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    string debugString = await response.Content.ReadAsStringAsync();
                    return RedirectToAction("Index", "Error", new { message = response.StatusCode, debug = debugString });
                }
            }
            return RedirectToAction("SignOut", "Account");
        }
    }
}