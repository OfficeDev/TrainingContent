using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using HubApp2.ViewModels;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;
using System.Linq;
using Microsoft.Graph;

namespace HubApp2.O365Helpers
{
    /// <summary>
    /// Contains methods for accessing events in a calendar.
    /// </summary>
    internal class CalendarOperations
    {
        internal async Task<List<EventViewModel>> GetCalendarEvents()
        {
            var eventsResults = new List<EventViewModel>();

            try
            {
                var graphClient = await AuthenticationHelper.GetGraphServiceClientAsync();
                var eventsPage = await graphClient.Me.Calendar.Events.Request().Top(10).Filter(string.Format("End/DateTime ge '{1}'", DateTime.Now.ToString("yyyy/MM/dd HH:mm"))).GetAsync();
                var events = eventsPage.CurrentPage;
                foreach (var item in events)
                {
                    EventViewModel calendarEventModel = new EventViewModel();
                    calendarEventModel.Subject = item.Subject;
                    calendarEventModel.Start = DateTime.Parse(item.Start.DateTime);
                    calendarEventModel.End = DateTime.Parse(item.End.DateTime);
                    calendarEventModel.Id = item.Id;
                    calendarEventModel.LocationName = item.Location.DisplayName;
                    calendarEventModel.StartTime = calendarEventModel.Start.ToLocalTime().TimeOfDay;
                    calendarEventModel.EndTime = calendarEventModel.End.ToLocalTime().TimeOfDay;
                    string bodyType = item.Body.ContentType == BodyType.Html ? "html" : "text";
                    string bodyContent = item.Body.Content;
                    if (item.Body.ContentType == BodyType.Html)
                    {
                        bodyContent = Regex.Replace(bodyContent, "<[^>]*>", "");
                        bodyContent = Regex.Replace(bodyContent, "\n", "");
                        bodyContent = Regex.Replace(bodyContent, "\r", "");
                    }
                    calendarEventModel.BodyContent = bodyContent;

                    calendarEventModel.Attendees = BuildAttendeeList(item.Attendees);

                    calendarEventModel.UpdateDisplayString();
                    eventsResults.Add(calendarEventModel);
                }
            }
            catch (Exception el)
            {
                el.ToString();
            }

            return eventsResults.OrderBy(e => e.Start).ToList();
        }

        /// <summary>
        /// Builds a semi-colon delimted list of attendee email addresses from
        /// the Attendee collection of a calendar event
        /// </summary>
        /// <param name="attendees">IEnumerable<Attendee> attendees</param>
        /// <returns></returns>
        internal string BuildAttendeeList(IEnumerable<Attendee> attendees)
        {
            StringBuilder attendeeListBuilder = new StringBuilder();
            foreach (Attendee attendee in attendees)
            {
                var address = attendeeListBuilder.Length > 0 ? ";" : string.Empty;
                address += attendee.EmailAddress.Address;
                attendeeListBuilder.Append(attendee.EmailAddress.Address);
            }
            return attendeeListBuilder.ToString();
        }
    }
}