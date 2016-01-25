using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Claims;
using System.Threading.Tasks;
using Office365Contact.Utils;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Text;

namespace Office365Contact.Models
{
    public class MyContactRepository
    {
        public bool MorePagesAvailable { get; private set; }

        public async Task<List<MyContact>> GetContacts(int pageIndex, int pageSize)
        {
            var contactsResults = new List<MyContact>();
            var accessToken = await GetGraphAccessTokenAsync();
            var restURL = string.Format("{0}me/contacts?$top={1}&$skip={2}", SettingsHelper.GraphResourceUrl, pageSize, pageIndex * pageSize);
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    var accept = "application/json";

                    client.DefaultRequestHeaders.Add("Accept", accept);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    using (var response = await client.GetAsync(restURL))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            var jsonresult = JObject.Parse(await response.Content.ReadAsStringAsync());

                            foreach (var item in jsonresult["value"])
                            {
                                contactsResults.Add(new MyContact
                                {
                                    Id = !string.IsNullOrEmpty(item["id"].ToString()) ? item["id"].ToString() : string.Empty,
                                    GivenName = !string.IsNullOrEmpty(item["givenName"].ToString()) ? item["givenName"].ToString() : string.Empty,
                                    Surname = !string.IsNullOrEmpty(item["surname"].ToString()) ? item["surname"].ToString() : string.Empty,
                                    CompanyName = !string.IsNullOrEmpty(item["companyName"].ToString()) ? item["companyName"].ToString() : string.Empty,
                                    EmailAddress = item["emailAddresses"] != null && item["emailAddresses"].Count() > 0 ? item["emailAddresses"][0]["address"].ToString() : string.Empty,
                                    BusinessPhone = item["businessPhones"] != null && item["businessPhones"].Count() > 0 ? item["businessPhones"][0].ToString() : string.Empty,
                                    HomePhone = item["homePhones"] != null && item["homePhones"].Count() > 0 ? item["homePhones"][0].ToString() : string.Empty
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception el)
            {
                el.ToString();
            }

            // indicate if more results available
            MorePagesAvailable = contactsResults.Count < pageSize ? false : true;

            return contactsResults;
        }

        public async Task<MyContact> GetContact(string id)
        {
            var accessToken = await GetGraphAccessTokenAsync();
            var restURL = string.Format("{0}me/contacts/{1}", SettingsHelper.GraphResourceUrl, id);
            var co = new MyContact();
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    var accept = "application/json";

                    client.DefaultRequestHeaders.Add("Accept", accept);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    using (var response = await client.GetAsync(restURL))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            var item = JObject.Parse(await response.Content.ReadAsStringAsync());

                            if (item != null)
                            {
                                co.Id = !string.IsNullOrEmpty(item["id"].ToString()) ? item["id"].ToString() : string.Empty;
                                co.GivenName = !string.IsNullOrEmpty(item["givenName"].ToString()) ? item["givenName"].ToString() : string.Empty;
                                co.Surname = !string.IsNullOrEmpty(item["surname"].ToString()) ? item["surname"].ToString() : string.Empty;
                                co.CompanyName = !string.IsNullOrEmpty(item["companyName"].ToString()) ? item["companyName"].ToString() : string.Empty;
                                co.EmailAddress = item["emailAddresses"] != null && item["emailAddresses"].Count() > 0 ? item["emailAddresses"][0]["address"].ToString() : string.Empty;
                                co.BusinessPhone = item["businessPhones"] != null && item["businessPhones"].Count() > 0 ? item["businessPhones"][0].ToString() : string.Empty;
                                co.HomePhone = item["homePhones"] != null && item["homePhones"].Count() > 0 ? item["homePhones"][0].ToString() : string.Empty;
                            }
                        }
                    }
                }
            }
            catch (Exception el)
            {
                el.ToString();
            }

            return co;
        }

        public async Task DeleteContact(string id)
        {
            var accessToken = await GetGraphAccessTokenAsync();
            var restURL = string.Format("{0}me/contacts('{1}')", SettingsHelper.GraphResourceUrl, id);
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    var accept = "application/json";

                    client.DefaultRequestHeaders.Add("Accept", accept);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    using (var response = await client.DeleteAsync(restURL))
                    {
                        if (response.IsSuccessStatusCode)
                            return;
                        else
                            throw new Exception("delete contact error: " + response.StatusCode);
                    }
                }
            }
            catch (Exception el)
            {
                el.ToString();
            }
        }

        public async Task AddContact(MyContact myContact)
        {
            var accessToken = await GetGraphAccessTokenAsync();
            var restURL = string.Format("{0}me/contacts", SettingsHelper.GraphResourceUrl);
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    var accept = "application/json";

                    client.DefaultRequestHeaders.Add("Accept", accept);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    List<EmailAddress> varEmailAddresses = null;
                    if (myContact.EmailAddress != null)
                    {
                        varEmailAddresses = new List<EmailAddress>();
                        varEmailAddresses.Add(new EmailAddress { name = myContact.EmailAddress, address = myContact.EmailAddress });
                    }

                    List<string> varBusinessPhones = null;
                    if (myContact.BusinessPhone != null)
                    {
                        varBusinessPhones = new List<string>();
                        varBusinessPhones.Add(myContact.BusinessPhone);
                    }

                    List<string> varHomePhones = null;
                    if (myContact.HomePhone != null)
                    {
                        varHomePhones = new List<string>();
                        varHomePhones.Add(myContact.HomePhone);
                    }

                    var co = new Contact
                    {
                        givenName = myContact.GivenName,
                        surname = myContact.Surname,
                        companyName = myContact.CompanyName,
                        emailAddresses = varEmailAddresses,
                        businessPhones = varBusinessPhones,
                        homePhones = varHomePhones
                    };

                    string postBody = JsonConvert.SerializeObject(co);

                    using (var response = await client.PostAsync(restURL, new StringContent(postBody, Encoding.UTF8, "application/json")))
                    {
                        if (response.IsSuccessStatusCode)
                            return;
                        else
                            throw new Exception("add contact error: " + response.StatusCode);
                    }
                }
            }
            catch (Exception el)
            {
                el.ToString();
            }
        }
        public async Task<string> GetGraphAccessTokenAsync()
        {
            var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
            var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;

            var clientCredential = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
            var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

            // create auth context
            AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureAdAuthority, new ADALTokenCache(signInUserId));
            var result = await authContext.AcquireTokenSilentAsync(SettingsHelper.AzureAdGraphResourceURL, clientCredential, userIdentifier);

            return result.AccessToken;
        }
    }
}