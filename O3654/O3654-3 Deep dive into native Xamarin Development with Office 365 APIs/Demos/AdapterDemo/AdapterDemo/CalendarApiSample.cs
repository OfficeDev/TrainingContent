using Android.Content;
using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdapterDemo
{
    public static class CalendarAPISample
    {
        const string ExchangeResourceId = "https://outlook.office365.com";
        const string ExchangeServiceRoot = "https://outlook.office365.com/ews/odata";

        public static async Task<IOrderedEnumerable<IEvent>> GetCalendarEvents(Context context)
        {
            var client = await EnsureClientCreated(context);

            // Obtain calendar event data
            var eventsResults = await (from i in client.Me.Events
                                      where i.End >= DateTimeOffset.UtcNow
                                      select i).Take(10).ExecuteAsync();

            var events = eventsResults.CurrentPage.OrderBy(e => e.Start);

            return events;
        }

        public static async Task<ExchangeClient> EnsureClientCreated(Context context)
        {
            Authenticator authenticator = new Authenticator(context);
            var authInfo = await authenticator.AuthenticateAsync(ExchangeResourceId);

            return new ExchangeClient(new Uri(ExchangeServiceRoot), authInfo.GetAccessToken);
        }
    }
}
