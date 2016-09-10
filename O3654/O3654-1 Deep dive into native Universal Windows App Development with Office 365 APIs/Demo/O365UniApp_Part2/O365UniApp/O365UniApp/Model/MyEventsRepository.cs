using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.Graph;

public class MyEventsRepository {

    public static async Task<GraphServiceClient> GetGraphServiceClientAsync()
    {
        var accessToken = await O365UniApp.AuthenticationHelper.GetGraphAccessTokenAsync();
        var authenticationProvider = new DelegateAuthenticationProvider(
            (requestMessage) =>
            {
                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                return Task.FromResult(0);
            });
        return new GraphServiceClient(authenticationProvider);
    }

    public static async Task<ObservableCollection<MyEvent>> GetEvents() {

        ObservableCollection<MyEvent> eventsCollection = new ObservableCollection<MyEvent>();
        try
        {
            var graphClient = await GetGraphServiceClientAsync();
            var eventsPage = await graphClient.Me.Events.Request().Filter(string.Format("End/DateTime ge '{0}'", DateTime.Now.ToString("yyyy/MM/dd HH:mm"))).GetAsync();
            var events = eventsPage.CurrentPage;
            foreach (var item in events)
            {
                eventsCollection.Add(new MyEvent
                {
                    Subject = item.Subject,
                    Start = !string.IsNullOrEmpty(item.Start.DateTime) ? DateTime.Parse(item.Start.DateTime) : new DateTime(),
                    End = !string.IsNullOrEmpty(item.End.DateTime) ? DateTime.Parse(item.End.DateTime) : new DateTime(),
                    Location = item.Location.DisplayName,
                    Body = item.Body.Content
                });
            }
        }

        catch (Exception el)
        {
            el.ToString();
        }

        return eventsCollection;
  }

}
