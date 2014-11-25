// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.

using Microsoft.Office365.OutlookServices;
using Office365StarterProject.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Office365StarterProject.Helpers
{
    /// <summary>
    /// Contains methods for accessing events in a calendar.
    /// </summary>
    internal class CalendarOperations
    {
        /// <summary>
        /// Gets the details of an event.
        /// </summary>
        /// <param name="eventId">string. The unique identifier of an event selected in the UI.</param>
        /// <returns>A calendar event.</returns>
        internal async Task<IEvent> GetEventDetailsAsync(string eventId)
        {
            // Make sure we have a reference to the calendar client
            var exchangeClient = await AuthenticationHelper.EnsureOutlookClientCreatedAsync();

            // This results in a call to the service.
            return await exchangeClient.Me.Calendar.Events.GetById(eventId).ExecuteAsync();
        }

        /// <summary>
        /// Gets a collection of calendar events.
        /// </summary>
        /// <returns>A collection of all calendar events.</returns>
        internal async Task<List<EventViewModel>> GetCalendarEventsAsync()
        {
            // Make sure we have a reference to the Exchange client
            var exchangeClient = await AuthenticationHelper.EnsureOutlookClientCreatedAsync();

            List<EventViewModel> returnResults = new List<EventViewModel>();

            var eventsResults = await exchangeClient.Me.Calendar.Events.OrderBy(e => e.Start).ExecuteAsync();
            foreach (IEvent calendarEvent in eventsResults.CurrentPage)
            {
                IEvent thisEvent = await GetEventDetailsAsync( calendarEvent.Id);
                EventViewModel calendarEventModel = new EventViewModel(thisEvent);
                returnResults.Add(calendarEventModel);
            }
            return returnResults;
        }

        /// <summary>
        /// Adds a new event to user's default calendar
        /// </summary>
        /// <param name="LocationName">string. The name of the event location</param>
        /// <param name="BodyContent">string. The body of the event.</param>
        /// <param name="Attendees">string. semi-colon delimited list of invitee email addresses</param>
        /// <param name="EventName">string. The subject of the event</param>
        /// <param name="start">DateTimeOffset. The start date of the event</param>
        /// <param name="end">DateTimeOffset. The end date of the event</param>
        /// <param name="startTime">TimeSpan. The start hour:Min:Sec of the event</param>
        /// <param name="endTime">TimeSpan. The end hour:Min:Sec of the event</param>
        /// <returns></returns>
        internal async Task<string> AddCalendarEventAsync(
            string LocationName,
            string BodyContent,
            string Attendees,
            string EventName,
            DateTimeOffset start,
            DateTimeOffset end,
            TimeSpan startTime,
            TimeSpan endTime)
        {
            string newEventId = string.Empty;
            Location location = new Location();
            location.DisplayName = LocationName;
            ItemBody body = new ItemBody();
            body.Content = BodyContent;
            body.ContentType = BodyType.Text;
            string[] splitter = { ";" };
            var splitAttendeeString = Attendees.Split(splitter, StringSplitOptions.RemoveEmptyEntries);
            Attendee[] attendees = new Attendee[splitAttendeeString.Length];
            for (int i = 0; i < splitAttendeeString.Length; i++)
            {
                attendees[i] = new Attendee();
                attendees[i].Type = AttendeeType.Required;
                attendees[i].EmailAddress = new EmailAddress() { Address = splitAttendeeString[i], Name = splitAttendeeString[i] };
            }

            Event newEvent = new Event
            {
                Subject = EventName,
                Location = location,
                Attendees = attendees,
                Start = start,
                End = end,
                Body = body,
            };
            //Add new times to start and end dates.
            newEvent.Start = (DateTimeOffset?)CalcNewTime(newEvent.Start, start, startTime);
            newEvent.End = (DateTimeOffset?)CalcNewTime(newEvent.End, end, endTime);

            try
            {
                // Make sure we have a reference to the calendar client
                var exchangeClient = await AuthenticationHelper.EnsureOutlookClientCreatedAsync();

                // This results in a call to the service.
                await exchangeClient.Me.Events.AddEventAsync(newEvent);
                newEventId = newEvent.Id;
            }
            catch (Exception e)
            {
                throw new Exception("We could not create your calendar event: " + e.Message);
            }
            return newEventId;
        }

        /// <summary>
        /// Updates an existing event in the user's default calendar
        /// </summary>
        /// <param name="selectedEventId">string. The unique Id of the event to update</param>
        /// <param name="LocationName">string. The name of the event location</param>
        /// <param name="BodyContent">string. The body of the event.</param>
        /// <param name="Attendees">string. semi-colon delimited list of invitee email addresses</param>
        /// <param name="EventName">string. The subject of the event</param>
        /// <param name="start">DateTimeOffset. The start date of the event</param>
        /// <param name="end">DateTimeOffset. The end date of the event</param>
        /// <param name="startTime">TimeSpan. The start hour:Min:Sec of the event</param>
        /// <param name="endTime">TimeSpan. The end hour:Min:Sec of the event</param>
        /// <returns>IEvent. The updated event</returns>
        internal async Task<IEvent> UpdateCalendarEventAsync(string selectedEventId,
            string LocationName,
            string BodyContent,
            string Attendees,
            string EventName,
            DateTimeOffset start,
            DateTimeOffset end,
            TimeSpan startTime,
            TimeSpan endTime)
        {
            // Make sure we have a reference to the Exchange client
            var exchangeClient = await AuthenticationHelper.EnsureOutlookClientCreatedAsync();

            var eventToUpdate = await exchangeClient.Me.Calendar.Events.GetById(selectedEventId).ExecuteAsync();
            eventToUpdate.Attendees.Clear();
            string[] splitter = { ";" };
            var splitAttendeeString = Attendees.Split(splitter, StringSplitOptions.RemoveEmptyEntries);
            Attendee[] attendees = new Attendee[splitAttendeeString.Length];
            for (int i = 0; i < splitAttendeeString.Length; i++)
            {
                Attendee newAttendee = new Attendee();
                newAttendee.EmailAddress = new EmailAddress() { Name = splitAttendeeString[i], Address = splitAttendeeString[i] };
                newAttendee.Type = AttendeeType.Required;
                eventToUpdate.Attendees.Add(newAttendee);
            }
            
            eventToUpdate.Subject = EventName;
            Location location = new Location();
            location.DisplayName = LocationName;
            eventToUpdate.Location = location;
            eventToUpdate.Start = (DateTimeOffset?)CalcNewTime(eventToUpdate.Start, start, startTime);
            eventToUpdate.End = (DateTimeOffset?)CalcNewTime(eventToUpdate.End, end, endTime);
            ItemBody body  = new ItemBody();
            body.ContentType = BodyType.Text;
            body.Content = BodyContent;
            eventToUpdate.Body = body;   
            try
            {

                // Update the calendar event in Exchange
                await eventToUpdate.UpdateAsync();

                // A note about Batch Updating
                // You can save multiple updates on the client and save them all at once (batch) by 
                // implementing the following pattern:
                // 1. Call UpdateAsync(true) for each event you want to update. Setting the parameter dontSave to true 
                //    means that the updates are registered locally on the client, but won't be posted to the server.
                // 2. Call exchangeClient.Context.SaveChangesAsync() to post all event updates you have saved locally  
                //    using the preceding UpdateAsync(true) call to the server, i.e., the user's Office 365 calendar.
            }
            catch (Exception)
            {
                throw new Exception("Your calendar event was not updated on the Exchange service");
            }
            return eventToUpdate;
        }

        /// <summary>
        /// Removes an event from the user's default calendar.
        /// </summary>
        /// <param name="selectedEventId">string. The unique Id of the event to delete.</param>
        /// <returns></returns>
        internal async  Task<bool> DeleteCalendarEventAsync(string selectedEventId)
        {
            LoggingViewModel.Instance.Information = "Deleting event ...";
            try
            {
                // Make sure we have a reference to the Exchange client
                var exchangeClient = await AuthenticationHelper.EnsureOutlookClientCreatedAsync();

                // Get the event to be removed from the Exchange service. This results in a call to the service.
                var eventToDelete = await exchangeClient.Me.Calendar.Events.GetById(selectedEventId).ExecuteAsync();

                // Delete the event. This results in a call to the service.
                await eventToDelete.DeleteAsync(false);

                LoggingViewModel.Instance.Information = "Event deleted";

                return true;
            }
            catch (Exception)
            {
                LoggingViewModel.Instance.Information = "Could not delete event";
            }
            return false;
        }


        /// <summary>
        /// Builds a semi-colon delimted list of attendee email addresses from
        /// the Attendee collection of a calendar event
        /// </summary>
        /// <param name="attendeeList">IList[Attendee] attendeeList</param>
        /// <returns></returns>
        internal  string BuildAttendeeList(IList<Attendee> attendeeList)
        {
            StringBuilder attendeeListBuilder = new StringBuilder();
            foreach (Attendee attendee in attendeeList)
            {
                if (attendeeListBuilder.Length == 0)
                {
                    attendeeListBuilder.Append(attendee.EmailAddress.Address);
                }
                else
                {
                    attendeeListBuilder.Append(";" + attendee.EmailAddress.Address);
                }
            }

            return attendeeListBuilder.ToString();
        }

        /// <summary>
        /// Sets new time component of the datetimeoffset from the TimeSpan property of the UI
        /// </summary>
        /// <param name="OldDate">DateTimeOffset. The original date</param>
        /// <param name="NewDate">DateTimeOffset. The new date</param>
        /// <param name="newTime">TimeSpan. The new time</param>
        /// <returns>DateTimeOffset. The new start date/time</returns>
        internal  DateTimeOffset CalcNewTime(DateTimeOffset? OldDate, DateTimeOffset NewDate, TimeSpan newTime)
        {
            //Default return value to New start date
            DateTimeOffset returnValue = NewDate;

            //Get original time components
            int hour = OldDate.Value.ToLocalTime().TimeOfDay.Hours;
            int min = OldDate.Value.ToLocalTime().TimeOfDay.Minutes;
            int second = OldDate.Value.ToLocalTime().TimeOfDay.Seconds;

            //Get new time components from TimeSpan updated by UI
            int newHour = newTime.Hours;
            int newMin = newTime.Minutes;
            int newSec = newTime.Seconds;

            //Update the new datetime by the difference between old and new time components
            returnValue = returnValue.AddHours(newHour - hour);
            returnValue = returnValue.AddMinutes(newMin - min);
            returnValue = returnValue.AddSeconds(newSec - second);

            return returnValue;
        }
    }
}
//********************************************************* 
// 
//O365-APIs-Start-Windows, https://github.com/OfficeDev/O365-APIs-Start-Windows
//
//Copyright (c) Microsoft Corporation
//All rights reserved. 
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// ""Software""), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// 
//********************************************************* 
