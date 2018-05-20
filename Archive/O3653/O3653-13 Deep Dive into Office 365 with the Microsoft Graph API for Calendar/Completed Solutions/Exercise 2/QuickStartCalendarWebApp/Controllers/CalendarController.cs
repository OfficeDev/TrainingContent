using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Configuration;
using System.Threading.Tasks;
using Microsoft.Graph;
using QuickStartCalendarWebApp.Auth;
using QuickStartCalendarWebApp.TokenStorage;

namespace QuickStartCalendarWebApp.Controllers
{
    public class CalendarController : Controller
    {
        // GET: Calendar
        [Authorize]
        public async Task<ActionResult> Index(int? pageSize, string nextLink)
        {
            if (!string.IsNullOrEmpty((string)TempData["error"]))
            {
                ViewBag.ErrorMessage = (string)TempData["error"];
            }

            pageSize = pageSize ?? 10;

            var client = GetGraphServiceClient();

            // In order to use a calendar view, you must specify
            // a start and end time for the view. Here we'll specify
            // the next 7 days.
            DateTime start = DateTime.Today;
            DateTime end = start.AddDays(6);

            // These values go into query parameters in the request URL,
            // so add them as QueryOptions to the options passed ot the
            // request builder.
            List<Option> viewOptions = new List<Option>();
            viewOptions.Add(new QueryOption("startDateTime",
              start.ToUniversalTime().ToString("s", System.Globalization.CultureInfo.InvariantCulture)));
            viewOptions.Add(new QueryOption("endDateTime",
              end.ToUniversalTime().ToString("s", System.Globalization.CultureInfo.InvariantCulture)));

            var request = client.Me.CalendarView.Request(viewOptions).Top(pageSize.Value);
            if (!string.IsNullOrEmpty(nextLink))
            {
                request = new UserCalendarViewCollectionRequest(nextLink, client, null);
            }

            try
            {
                var results = await request.GetAsync();

                ViewBag.NextLink = null == results.NextPageRequest ? null :
                  results.NextPageRequest.GetHttpRequestMessage().RequestUri;

                return View(results);
            }
            catch (ServiceException ex)
            {
                TempData["message"] = ex.Error.Message;
                return RedirectToAction("Index", "Error");
            }
        }

        [Authorize]
        public async Task<ActionResult> Detail(string eventId)
        {
            var client = GetGraphServiceClient();

            var request = client.Me.Events[eventId].Request();

            try
            {
                var result = await request.GetAsync();

                TempData[eventId] = result.Body.Content;

                return View(result);
            }
            catch (ServiceException ex)
            {
                TempData["message"] = ex.Error.Message;
                return RedirectToAction("Index", "Error");
            }
        }

        public async Task<ActionResult> GetEventBody(string eventId)
        {
            return Content(TempData[eventId] as string);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> AddEvent(string eventId, string attendees, string subject, string body, string start, string end, string location)
        {
            if (string.IsNullOrEmpty(subject) || string.IsNullOrEmpty(start)
              || string.IsNullOrEmpty(end) || string.IsNullOrEmpty(location))
            {
                TempData["error"] = "Please fill in all fields";
            }

            else
            {
                bool IsPersonalAppointment = true;
                List<Attendee> eventAttendees = new List<Attendee>();
                if (!string.IsNullOrEmpty(attendees))
                {
                    IsPersonalAppointment = false;


                    if (!buildRecipients(attendees, eventAttendees))

                    {
                        TempData["error"] = "Please provide valid email addresses";
                    }
                }

                var client = GetGraphServiceClient();

                var request = client.Me.Events.Request();

                ItemBody CurrentBody = new ItemBody();
                CurrentBody.Content = (string.IsNullOrEmpty(body) ? "" : body);
                Event newEvent = new Event()
                {
                    Subject = subject,
                    Body = CurrentBody,
                    Start = new DateTimeTimeZone() { DateTime = start, TimeZone = "UTC" },
                    End = new DateTimeTimeZone() { DateTime = end, TimeZone = "UTC" },
                    Location = new Location() { DisplayName = location }
                };
                if (!IsPersonalAppointment)
                    newEvent.Attendees = eventAttendees;

                try
                {
                    await request.AddAsync(newEvent);
                }
                catch (ServiceException ex)
                {
                    TempData["error"] = ex.Error.Message;
                }
            }

            return RedirectToAction("Index", new { eventId = eventId });
        }

        const string SEMICOLON = ";";
        const string PERIOD = ".";
        const string AT = "@";
        const string SPACE = " ";

        private bool buildRecipients(string strAttendees, List<Attendee> Attendees)
        {
            int iSemiColonPos = -1;
            string strTemp = strAttendees.Trim();
            string strEmailAddress = null;
            Attendee attendee = new Attendee();

            while (strTemp.Length != 0)
            {
                iSemiColonPos = strTemp.IndexOf(SEMICOLON);
                if (iSemiColonPos != -1)
                {
                    strEmailAddress = strTemp.Substring(0, iSemiColonPos);
                    strTemp = strTemp.Substring(iSemiColonPos + 1).Trim();
                }
                else
                {
                    strEmailAddress = strTemp;
                    strTemp = "";
                }
                int iAt = strEmailAddress.IndexOf(AT);
                int iPeriod = strEmailAddress.LastIndexOf(PERIOD);
                if ((iAt != -1) && (iPeriod != -1) && (strEmailAddress.LastIndexOf(SPACE) == -1) && (iPeriod > iAt))
                {
                    EmailAddress mailAddress = new EmailAddress();
                    mailAddress.Address = strEmailAddress;
                    Attendee eventAttendee = new Attendee();
                    eventAttendee.EmailAddress = mailAddress;
                    Attendees.Add(eventAttendee);
                }
                else
                {
                    return false;
                }
                strEmailAddress = null;

            }
            return true;
        }

        // Accept Calendar event
        [Authorize]
        [HttpPost]
        public async Task<ActionResult> Accept(string eventId)
        {
            var client = GetGraphServiceClient();

            var request = client.Me.Events[eventId].Accept().Request();

            try
            {
                await request.PostAsync();
            }
            catch (ServiceException ex)
            {
                TempData["message"] = ex.Error.Message;
                return RedirectToAction("Index", "Error");
            }

            return RedirectToAction("Detail", new { eventId = eventId });
        }
        [Authorize]
        [HttpPost]
        public async Task<ActionResult> Tentative(string eventId)
        {
            var client = GetGraphServiceClient();

            var request = client.Me.Events[eventId].TentativelyAccept().Request();

            try
            {
                await request.PostAsync();
            }
            catch (ServiceException ex)
            {
                TempData["message"] = ex.Error.Message;
                return RedirectToAction("Index", "Error");
            }

            return RedirectToAction("Detail", new { eventId = eventId });
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> Decline(string eventId)
        {
            var client = GetGraphServiceClient();

            var request = client.Me.Events[eventId].Decline().Request();

            try
            {
                await request.PostAsync();
            }
            catch (ServiceException ex)
            {
                TempData["message"] = ex.Error.Message;
                return RedirectToAction("Index", "Error");
            }

            return RedirectToAction("Index");
        }

        private GraphServiceClient GetGraphServiceClient()
        {
            string userObjId = AuthHelper.GetUserId(System.Security.Claims.ClaimsPrincipal.Current);
            SessionTokenCache tokenCache = new SessionTokenCache(userObjId, HttpContext);

            string authority = string.Format(ConfigurationManager.AppSettings["ida:AADInstance"], "common", "/v2.0");

            AuthHelper authHelper = new AuthHelper(
                authority,
                ConfigurationManager.AppSettings["ida:AppId"],
                ConfigurationManager.AppSettings["ida:AppSecret"],
                tokenCache);

            // Request an accessToken and provide the original redirect URL from sign-in
            GraphServiceClient client = new GraphServiceClient(new DelegateAuthenticationProvider(async (request) =>
            {
                string accessToken = await authHelper.GetUserAccessToken(Url.Action("Index", "Home", null, Request.Url.Scheme));
                request.Headers.TryAddWithoutValidation("Authorization", "Bearer " + accessToken);
            }));

            return client;
        }
    }
}