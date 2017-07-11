using System;
using System.Web;
using System.Web.Mvc;
using GraphWebhooks.Models;
using GraphWebhooks.SignalR;
using Microsoft.Graph;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Collections.Generic;
using GraphWebhooks.Auth;
using GraphWebhooks.TokenStorage;

namespace GraphWebhooks.Controllers
{
    public class NotificationController : Controller
    {
        public ActionResult LoadView()
        {
            return View("Notification");
        }

        // The notificationUrl endpoint that's registered with the webhooks subscription.
        [HttpPost]
        public async Task<ActionResult> Listen()
        {

            // Validate the new subscription by sending the token back to MS Graph.
            // This response is required for each subscription.
            if (Request.QueryString["validationToken"] != null)
            {
                var token = Request.QueryString["validationToken"];
                return Content(token, "plain/text");
            }

            // Parse the received notifications.
            else
            {
                try
                {
                    var notifications = new Dictionary<string, Notification>();
                    using (var inputStream = new System.IO.StreamReader(Request.InputStream))
                    {
                        JObject jsonObject = JObject.Parse(inputStream.ReadToEnd());
                        if (jsonObject != null)
                        {

                            // Notifications are sent in a 'value' array.
                            JArray value = JArray.Parse(jsonObject["value"].ToString());
                            foreach (var notification in value)
                            {
                                Notification current = JsonConvert.DeserializeObject<Notification>(notification.ToString());

                                var subscriptionParams = (Tuple<string, string>)HttpRuntime.Cache.Get("subscriptionId_" + current.SubscriptionId);
                                if (subscriptionParams != null)
                                {
                                    // Verify the message is from Microsoft Graph.
                                    if (current.ClientState == subscriptionParams.Item1)
                                    {
                                        // Just keep the latest notification for each resource.
                                        // No point pulling data more than once.
                                        notifications[current.Resource] = current;
                                    }
                                }
                            }
                            if (notifications.Count > 0)
                            {

                                // Query for the changed messages. 
                                await GetChangedMessagesAsync(notifications.Values);
                            }
                        }
                    }
                    return new HttpStatusCodeResult(202);
                }
                catch (Exception)
                {

                    // TODO: Handle the exception.
                    // Return a 202 so the service doesn't resend the notification.
                    return new HttpStatusCodeResult(202);
                }
            }
        }

        // Get information about the changed messages and send to browser via SignalR
        // A production application would typically queue a background job for reliability.
        public async Task GetChangedMessagesAsync(IEnumerable<Notification> notifications)
        {
            List<Message> messages = new List<Message>();
            foreach (var notification in notifications)
            {
                if (notification.ResourceData.ODataType != "#Microsoft.Graph.Message") continue;

                // Get an access token and add it to the client.
                var subscriptionParams = (Tuple<string, string>)HttpRuntime.Cache.Get("subscriptionId_" + notification.SubscriptionId);
                string userObjId = subscriptionParams.Item2;
                AuthHelper authHelper = new AuthHelper(new RuntimeTokenCache(userObjId));

                string accessToken = await authHelper.GetUserAccessToken("/");
                var graphClient = new GraphServiceClient(new DelegateAuthenticationProvider(requestMessage =>
                {
                    requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", accessToken);
                    return Task.FromResult(0);
                }));

                var request = new MessageRequest(graphClient.BaseUrl + "/" + notification.Resource, graphClient, null);
                try
                {
                    messages.Add(await request.GetAsync());
                }
                catch (Exception)
                {
                    continue;
                }

            }
            if (messages.Count > 0)
            {
                NotificationService notificationService = new NotificationService();
                notificationService.SendNotificationToClient(messages);
            }
        }
    }
}