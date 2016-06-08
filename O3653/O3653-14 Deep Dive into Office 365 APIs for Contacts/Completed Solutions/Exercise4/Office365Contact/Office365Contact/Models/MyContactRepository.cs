using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Office365Contact.Utils;
using System.Net.Http.Headers;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Linq;
using Microsoft.Graph;

namespace Office365Contact.Models
{
    public class MyContactRepository
    {
        private async Task<string> GetGraphAccessTokenAsync()
        {
            var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
            var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;

            var clientCredential = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
            var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

            AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureAdAuthority, new ADALTokenCache(signInUserId));
            var result = await authContext.AcquireTokenSilentAsync(SettingsHelper.AzureAdGraphResourceURL, clientCredential, userIdentifier);
            return result.AccessToken;
        }

        private async Task<GraphServiceClient> GetGraphServiceAsync()
        {
            var accessToken = await GetGraphAccessTokenAsync();
            var graphserviceClient = new GraphServiceClient(SettingsHelper.GraphResourceUrl,
                                          new DelegateAuthenticationProvider(
                                                        (requestMessage) =>
                                                        {
                                                            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", accessToken);
                                                            return Task.FromResult(0);
                                                        }));

            return graphserviceClient;
        }

        public async Task<List<MyContact>> GetContacts(int pageIndex, int pageSize)
        {
            try
            {
                var graphServiceClient = await GetGraphServiceAsync();
                var requestContacts = await graphServiceClient.Me.Contacts.Request().Top(pageSize).Skip(pageIndex * pageSize).GetAsync();
                var contactsResults = requestContacts.CurrentPage.Select(x => new MyContact
                {
                    Id = x.Id,
                    GivenName = x.GivenName,
                    Surname = x.Surname,
                    CompanyName = x.CompanyName,
                    EmailAddress = x.EmailAddresses.Count() > 0 ? x.EmailAddresses.First().Address: string.Empty,
                    BusinessPhone = x.BusinessPhones.Count() > 0 ? x.BusinessPhones.First() : string.Empty,
                    HomePhone = x.HomePhones.Count() > 0 ? x.HomePhones.First() : string.Empty
                }).ToList();
                return contactsResults;
            }
            catch (Exception el)
            {
                return null;
            }
        }

        public async Task<MyContact> GetContact(string id)
        {
            try
            {
                var graphServiceClient = await GetGraphServiceAsync();
                var requestContact = await graphServiceClient.Me.Contacts[id].Request().GetAsync();
                var contactResult = new MyContact
                {
                    Id = requestContact.Id,
                    GivenName = requestContact.GivenName,
                    Surname = requestContact.Surname,
                    CompanyName = requestContact.CompanyName,
                    EmailAddress = requestContact.EmailAddresses.Count() > 0 ? requestContact.EmailAddresses.First().Address : string.Empty,
                    BusinessPhone = requestContact.BusinessPhones.Count() > 0 ? requestContact.BusinessPhones.First() : string.Empty,
                    HomePhone = requestContact.HomePhones.Count() > 0 ? requestContact.HomePhones.First() : string.Empty
                };
                return contactResult;
            }
            catch (Exception el)
            {
                return null;
            }
        }

        public async Task DeleteContact(string id)
        {
            try
            {
                var graphServiceClient = await GetGraphServiceAsync();
                await graphServiceClient.Me.Contacts[id].Request().DeleteAsync();
            }
            catch (Exception el)
            {
            }
            return;
        }

        public async Task AddContact(MyContact myContact)
        {
            try
            {
                var graphServiceClient = await GetGraphServiceAsync();
                var requestContact = new Microsoft.Graph.Contact
                {
                    GivenName = myContact.GivenName,
                    Surname = myContact.Surname,
                    CompanyName = myContact.CompanyName,
                };
                var emailList = new List<EmailAddress>();
                emailList.Add(new EmailAddress { Address = myContact.EmailAddress, Name = myContact.EmailAddress });
                requestContact.EmailAddresses = emailList;
                var businessPhonesList = new List<string>();
                businessPhonesList.Add(myContact.BusinessPhone);
                requestContact.BusinessPhones = businessPhonesList;
                var homePhonesList = new List<string>();
                homePhonesList.Add(myContact.HomePhone);
                requestContact.HomePhones = homePhonesList;
                await graphServiceClient.Me.Contacts.Request().AddAsync(requestContact);
            }
            catch (Exception el)
            {
            }
            return;
        }
       
    }
}