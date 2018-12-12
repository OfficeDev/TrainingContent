using System;
using System.Threading.Tasks;
using System.Web.Mvc;
using WebApplication1.Models;
using WebApplication1.Repository;
using WebApplication1.Utils;

namespace WebApplication1.Controllers
{
    public class ConnectorController : Controller
    {
        /// <summary>
        /// This is the landing page when user tries to setup the connector.
        /// You could implement login here, if required.
        /// </summary>
        public ViewResult Setup()
        {
            return View();
        }

        /// <summary>
        /// This enpoint is called when registration is completed. 
        /// This contains GroupName and Webhook Url which can be used to push change notifications to the channel.
        /// </summary>
        /// <returns></returns>
        public async Task<ActionResult> Register()
        {
            var error = Request["error"];
            var state = Request["state"];
            if (!String.IsNullOrEmpty(error))
            {
                return RedirectToAction("Error"); // You could pass error message to Error Action. 
            }
            else
            {
                var group = Request["group_name"];
                var webhook = Request["webhook_url"];

                Subscription subscription = new Subscription();
                subscription.GroupName = group;
                subscription.WebHookUri = webhook;

                // Save the subscription so that it can be used to push data to the registered channels.
                SubscriptionRepository.Subscriptions.Add(subscription);

                await TaskHelper.PostWelcomeMessage(webhook, group);

                return View();
            }
        }

        // Error page
        public ActionResult Error()
        {
            return View();
        }
    }
}