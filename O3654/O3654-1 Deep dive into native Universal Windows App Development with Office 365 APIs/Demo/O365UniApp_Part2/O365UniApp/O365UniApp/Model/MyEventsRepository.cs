using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class MyEventsRepository {

    public static async Task<string> GetJsonAsync(string url)
    {
        var accessToken = await O365UniApp.AuthenticationHelper.GetGraphAccessTokenAsync();
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

    public static async Task<ObservableCollection<MyEvent>> GetEvents() {

        ObservableCollection<MyEvent> eventsCollection = new ObservableCollection<MyEvent>();
        try
        {
            var restURL = string.Format("{0}/me/events?$filter=End/DateTime ge '{1}'", O365UniApp.AuthenticationHelper.ResourceBetaUrl, DateTime.Now.ToString("yyyy/MM/dd HH:mm"));
            string responseString = await GetJsonAsync(restURL);

            if (responseString != null)
            {
                var jsonresult = JObject.Parse(responseString);
                foreach (var item in jsonresult["value"])
                {
                    eventsCollection.Add(new MyEvent
                    {
                        Subject = !string.IsNullOrEmpty(item["subject"].ToString()) ? item["subject"].ToString() : string.Empty,
                        Start = !string.IsNullOrEmpty(item["start"]["dateTime"].ToString()) ? DateTime.Parse(item["start"]["dateTime"].ToString()) : new DateTime(),
                        End = !string.IsNullOrEmpty(item["end"]["dateTime"].ToString()) ? DateTime.Parse(item["end"]["dateTime"].ToString()) : new DateTime(),
                        Location = !string.IsNullOrEmpty(item["location"]["displayName"].ToString()) ? item["location"]["displayName"].ToString() : string.Empty,
                        Body = !string.IsNullOrEmpty(item["body"]["content"].ToString()) ? item["body"]["content"].ToString() : string.Empty
                    });
                }

            }
        }

        catch (Exception el)
        {
            el.ToString();
        }

        return eventsCollection;
  }

}
