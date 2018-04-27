using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Threading.Tasks;
using Microsoft.Graph;

namespace OfficeOAuth.Controllers
{
    public class HomeController : Controller
    {
        public async Task<ActionResult> Index(string code)
        {
            if (string.IsNullOrEmpty(code))
            {
                var GraphResourceId = "https://graph.microsoft.com";

                string authorizationRequest = String.Format(
                    "{0}/oauth2/authorize?response_type=code&client_id={1}&resource={2}&redirect_uri={3}&state={4}",
                    SettingsHelper.Authority,
                    Uri.EscapeDataString(SettingsHelper.ClientID),
                    Uri.EscapeDataString(GraphResourceId),
                    Uri.EscapeDataString(string.Format("{0}/", Request.Url.GetLeftPart(UriPartial.Authority))),
                    Uri.EscapeDataString(Guid.NewGuid().ToString())
                    );

                return new RedirectResult(authorizationRequest);
            }
            else
            {
                IOrderedEnumerable<Event> events = await CalendarAPISample.GetCalendarEvents(code);
                ViewBag.Events = events;
            }
            return View();
        }
    }
}
