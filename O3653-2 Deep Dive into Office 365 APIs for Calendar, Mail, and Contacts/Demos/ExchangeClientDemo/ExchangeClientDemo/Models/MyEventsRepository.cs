using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.Office365.OAuth;
using Microsoft.Office365.Exchange;
using System.IO;
using System.Threading.Tasks;

namespace ExchangeClientDemo.Models {
    public class MyEventsRepository {
        public async Task<List<MyEvent>> GetEvents() {

            var client = await EnsureClientCreated();

            var eventsResults = await (from ev in client.Me.Events
                                       where ev.End >= DateTimeOffset.UtcNow
                                       select ev).Take(10).ExecuteAsync();

            var events = eventsResults.CurrentPage.OrderBy(e => e.Start);

            var eventList = new List<MyEvent>();

            foreach (var myEvent in events) {
                MyEvent newEvent  = new MyEvent();
                newEvent.Id = myEvent.Id;
                newEvent.Subject = myEvent.Subject;
                newEvent.Start = myEvent.Start;
                myEvent.End = myEvent.End;
                if(myEvent.Body != null){
                    newEvent.Body = myEvent.Body.Content;
                }
                if(myEvent.Location != null){
                    newEvent.Location = myEvent.Location.DisplayName;
                }
                if (myEvent.Start != null) {
                    newEvent.Location = myEvent.Location.DisplayName;
                }    

                eventList.Add(newEvent);
            }

            return eventList;

        }

        public async Task<MyEvent> GetEvent(string id) {
            var client = await EnsureClientCreated();
            var ev = await client.Me.Events.GetById(id).ExecuteAsync();

            MyEvent newEvent = new MyEvent();
            newEvent.Id = ev.Id;
            newEvent.Subject = ev.Subject;
            newEvent.Start = ev.Start;
            newEvent.End = ev.End;
            if (ev.Location != null) { 
                newEvent.Location = ev.Location.DisplayName;
            }
            if (ev.Body != null) {
                newEvent.Body = ev.Body.Content;
            }

            return newEvent;
        }

        public async Task DeleteEvent(string id) {
            var client = await EnsureClientCreated();
            var myEvent = await client.Me.Events.GetById(id).ExecuteAsync();
            await myEvent.DeleteAsync();
        }

        public async Task AddEvent(ExchangeClientDemo.Models.MyEvent myEvent) {
            var client = await EnsureClientCreated();

            Location myEventLocation = new Location();
            myEventLocation.DisplayName = myEvent.Location;

            var newEvent = new Microsoft.Office365.Exchange.Event {
                Subject = myEvent.Subject,
                Start = myEvent.Start,
                End = myEvent.End,
                Location = myEventLocation
            };
            await client.Me.Events.AddEventAsync(newEvent);
        }


        private async Task<ExchangeClient> EnsureClientCreated() {

            DiscoveryContext disco = GetFromCache("DiscoveryContext") as DiscoveryContext;

            if (disco == null) {
                disco = await DiscoveryContext.CreateAsync();
                SaveInCache("DiscoveryContext", disco);
            }

            string ServiceResourceId = "https://outlook.office365.com";
            Uri ServiceEndpointUri = new Uri("https://outlook.office365.com/ews/odata");

            var dcr = await disco.DiscoverResourceAsync(ServiceResourceId);

            SaveInCache("LastLoggedInUser", dcr.UserId);

            return new ExchangeClient(ServiceEndpointUri, async () => {
                return (await disco.AuthenticationContext.AcquireTokenByRefreshTokenAsync(
                    new SessionCache().Read("RefreshToken"),
                    new Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential(
                        disco.AppIdentity.ClientId,
                        disco.AppIdentity.ClientSecret),
                        ServiceResourceId)).AccessToken;
            });

        }
        private void SaveInCache(string name, object value) {
            System.Web.HttpContext.Current.Session[name] = value;
        }

        private object GetFromCache(string name) {
            return System.Web.HttpContext.Current.Session[name];
        }

        private void RemoveFromCache(string name) {
            System.Web.HttpContext.Current.Session.Remove(name);
        }

    }
}