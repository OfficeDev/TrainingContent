using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using WinOffice365Calendar.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.Graph;

namespace WinOffice365Calendar
{
    class UserOperations
    {
        public async Task<List<EventModel>> GetMyEvents()
        {
            List<EventModel> retEvents = null;
            try
            {
                var graphClient = GetGraphServiceClient();
                var filter = string.Format("Start/DateTime ge '{0}'", DateTime.Now.AddMonths(-1).ToString("yyyy/MM/dd HH:mm"));
                var options = new Option[] { new QueryOption("$filter", filter), new QueryOption("top", "1000") };
                var events = await graphClient.Me.Events.Request(options).GetAsync();
                if (events != null)
                {
                    retEvents = new List<EventModel>();
                    foreach (var item in events)
                    {
                        var subject = item.Subject;
                        DateTime start = DateTime.Parse(item.Start.DateTime);
                        DateTime end = DateTime.Parse(item.End.DateTime);
                        retEvents.Add(new EventModel
                        {
                            start = start.ToString("yyyy/MM/dd HH:mm"),
                            end = end.ToString("yyyy/MM/dd HH:mm"),
                            subject = subject
                        });
                    }

                }
            }
            catch (Exception el)
            {
                el.ToString();
            }
            return retEvents;
        }

        private GraphServiceClient GetGraphServiceClient()
        {
            var authenticationProvider = new DelegateAuthenticationProvider(
                (requestMessage) =>
                {
                    requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AuthenticationHelper.LastAccessToken);
                    return Task.FromResult(0);
                });

            return new GraphServiceClient(authenticationProvider);
        }
    }
}
