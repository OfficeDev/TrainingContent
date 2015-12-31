using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using WinOffice365Calendar.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace WinOffice365Calendar
{
    class UserOperations
    {
        public static async Task<string> GetJsonAsync(string url)
        {
            var accessToken = await AuthenticationHelper.GetGraphAccessTokenAsync();
            using (HttpClient client = new HttpClient())
            {
                var accept = "application/json";

                client.DefaultRequestHeaders.Add("Accept", accept);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                using (var response = await client.GetAsync(url))
                {
                    if (response.IsSuccessStatusCode)
                        return await response.Content.ReadAsStringAsync();
                    return null;
                }
            }
        }

        public async Task<List<EventModel>> GetMyEvents()
        {
            List<EventModel> retEvents = null;
            try
            {
                var restURL = string.Format("{0}/me/events?$filter=Start/DateTime ge '{1}'&$top=1000 ", 
                    AuthenticationHelper.ResourceBetaUrl, 
                    DateTime.Now.AddMonths(-1).ToString("yyyy/MM/dd HH:mm"));
                string responseString = await GetJsonAsync(restURL);

                if (responseString != null)
                {
                    var jsonresult = JObject.Parse(responseString);
                    retEvents = new List<EventModel>();
                    foreach (var item in jsonresult["value"])
                    {
                        var subject = item["subject"].ToString();
                        DateTime start = DateTime.Parse(item["start"]["dateTime"].ToString());
                        DateTime end = DateTime.Parse(item["end"]["dateTime"].ToString());
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
    }
}
