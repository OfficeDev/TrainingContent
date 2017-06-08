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
            var webUrl = string.Format("{0}/", Request.Url.GetLeftPart(UriPartial.Authority));
            if (string.IsNullOrEmpty(code))
            {
                var adAuthority = "https://login.microsoftonline.com";
                var scope = "Calendars.Read openid email profile offline_access";

                string authorizationRequest = String.Format(
                    "{0}/common/oauth2/v2.0/authorize?response_type=code&client_id={1}&redirect_uri={2}&scope={3}&state={4}",
                    adAuthority,
                    Uri.EscapeDataString(SettingsHelper.AppId),
                    Uri.EscapeDataString(webUrl),
                    scope,
                    Uri.EscapeDataString(Guid.NewGuid().ToString())
                    );

                return new RedirectResult(authorizationRequest);
            }
            else
            {
                IOrderedEnumerable<Event> events = await CalendarAPISample.GetCalendarEvents(code, webUrl);
                ViewBag.Events = events;
            }
            return View();
        }
    }
}
