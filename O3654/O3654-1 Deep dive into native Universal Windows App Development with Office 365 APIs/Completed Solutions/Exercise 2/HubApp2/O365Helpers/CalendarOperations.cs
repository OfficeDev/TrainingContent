using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using HubApp2.ViewModels;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;
using System.Linq;

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
                var restURL = string.Format("{0}/me/calendar/events?$top=10&$filter=End/DateTime ge '{1}'", AuthenticationHelper.ResourceBetaUrl, DateTime.Now.ToString("yyyy/MM/dd HH:mm"));
                string responseString = await AuthenticationHelper.GetJsonAsync(restURL);
                if (responseString != null)
                {
                    var jsonresult = JObject.Parse(responseString);

                    foreach (var item in jsonresult["value"])
                    {
                        EventViewModel calendarEventModel = new EventViewModel();
                        calendarEventModel.Subject = !string.IsNullOrEmpty(item["subject"].ToString()) ? item["subject"].ToString() : string.Empty;
                        calendarEventModel.Start = !string.IsNullOrEmpty(item["start"]["dateTime"].ToString()) ? DateTime.Parse(item["start"]["dateTime"].ToString()) : new DateTime();
                        calendarEventModel.End = !string.IsNullOrEmpty(item["end"]["dateTime"].ToString()) ? DateTime.Parse(item["end"]["dateTime"].ToString()) : new DateTime();
                        calendarEventModel.Id = !string.IsNullOrEmpty(item["id"].ToString()) ? item["id"].ToString() : string.Empty;
                        calendarEventModel.LocationName = !string.IsNullOrEmpty(item["location"]["displayName"].ToString()) ? item["location"]["displayName"].ToString() : string.Empty;
                        calendarEventModel.StartTime = calendarEventModel.Start.ToLocalTime().TimeOfDay;
                        calendarEventModel.EndTime = calendarEventModel.End.ToLocalTime().TimeOfDay;
                        string bodyType = !string.IsNullOrEmpty(item["body"]["contentType"].ToString()) ? item["body"]["contentType"].ToString() : string.Empty;
                        string bodyContent = !string.IsNullOrEmpty(item["body"]["content"].ToString()) ? item["body"]["content"].ToString() : string.Empty;
                        if (bodyType == "html")
                        {
                            bodyContent = Regex.Replace(bodyContent, "<[^>]*>", "");
                            bodyContent = Regex.Replace(bodyContent, "\n", "");
                            bodyContent = Regex.Replace(bodyContent, "\r", "");
                        }
                        calendarEventModel.BodyContent = bodyContent;

                        calendarEventModel.Attendees = !string.IsNullOrEmpty(item["attendees"].ToString()) ? BuildAttendeeList(item["attendees"].ToString()) : string.Empty;

                        calendarEventModel.UpdateDisplayString();
                        eventsResults.Add(calendarEventModel);

                    }
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
        /// <param name="attendeeList">string attendeeList</param>
        /// <returns></returns>
        internal string BuildAttendeeList(string attendeeList)
        {
            if (attendeeList == "[]")
            {
                return string.Empty;
            }
            StringBuilder attendeeListBuilder = new StringBuilder();
            attendeeList = Regex.Replace(attendeeList, "\r", "");
            attendeeList = Regex.Replace(attendeeList, "\n", "");
            JArray jsonArray = JArray.Parse(attendeeList);
            foreach (JObject attendeeObject in jsonArray)
            {
                if (attendeeListBuilder.Length == 0)
                {
                    attendeeListBuilder.Append(attendeeObject["emailAddress"]["address"].ToString());
                }
                else {
                    attendeeListBuilder.Append(";" + attendeeObject["emailAddress"]["address"].ToString());
                }
            }

            return attendeeListBuilder.ToString();
        }        
    }
}

