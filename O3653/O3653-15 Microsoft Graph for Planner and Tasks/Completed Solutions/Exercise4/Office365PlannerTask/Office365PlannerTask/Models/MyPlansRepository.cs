using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Claims;
using System.Threading.Tasks;
using Office365PlannerTask.Utils;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Text;
using System.Collections.Generic;
using System;
using System.Net;

namespace Office365PlannerTask.Models
{
    public class MyPlansRepository
    {
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
        public async Task<List<MyPlan>> GetPlans()
        {
            var plansResult = new List<MyPlan>();
            var accessToken = await GetGraphAccessTokenAsync();
            var restURL = string.Format("{0}me/plans/", SettingsHelper.GraphResourceUrl);
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
                                plansResult.Add(new MyPlan
                                {
                                    id = item["id"].ToString(),
                                    title = item["title"].ToString(),
                                    owner = !string.IsNullOrEmpty(item["owner"].ToString()) ? item["owner"].ToString() : "",
                                    createdBy = !string.IsNullOrEmpty(item["createdBy"].ToString()) ? item["createdBy"].ToString() : "",
                                    Etag = !string.IsNullOrEmpty(item["@odata.etag"].ToString()) ? item["@odata.etag"].ToString() : ""
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

            return plansResult;
        }

        public async Task<MyPlan> GetPlan(string id)
        {
            MyPlan plan = new MyPlan();
            var accessToken = await GetGraphAccessTokenAsync();
            var restURL = string.Format("{0}plans/{1}", SettingsHelper.GraphResourceUrl, id);
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
                                plan.title = !string.IsNullOrEmpty(item["title"].ToString()) ? item["title"].ToString() : string.Empty;
                                plan.Etag = !string.IsNullOrEmpty(item["@odata.etag"].ToString()) ? item["@odata.etag"].ToString() : "";
                            }
                        }
                    }
                }
            }
            catch (Exception el)
            {
                el.ToString();
            }

            return plan;
        }

        public async Task CreatePlan(MyPlan myPlan)
        {
            try
            {
                string groupId = await CreateGroup(myPlan.title);
                await CreatePlan(myPlan, groupId);
            }
            catch (Exception el)
            {
                el.ToString();
            }
        }

        private async Task<string> CreateGroup(string groupTitle)
        {
            var accessToken = await GetGraphAccessTokenAsync();
            string groupId = string.Empty;
            dynamic groupJSON = new JObject();
            groupJSON.displayName = groupTitle;
            groupJSON.mailNickname = groupTitle.Replace(" ", "");
            groupJSON.securityEnabled = false;
            groupJSON.mailEnabled = true;
            groupJSON.groupTypes = new JArray("Unified");
            HttpRequestMessage message = new HttpRequestMessage(HttpMethod.Post, string.Format("{0}groups", SettingsHelper.GraphResourceUrl));
            message.Content = new StringContent(groupJSON.ToString(), System.Text.Encoding.UTF8, "application/json");
            message.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            message.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            using (HttpClient client = new HttpClient())
            {
                var responseMessage = await client.SendAsync(message);

                if (responseMessage.StatusCode != System.Net.HttpStatusCode.Created)
                    throw new Exception(responseMessage.StatusCode.ToString());

                var payload = await responseMessage.Content.ReadAsStringAsync();

                groupId = JObject.Parse(payload)["id"].ToString();

                await AddMemberForGroup(groupId);
            }

            return groupId;
        }

        private async Task AddMemberForGroup(string groupid)
        {
            var accessToken = await GetGraphAccessTokenAsync();
            var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;
            var restURL = string.Format("{0}groups('{1}')/members/$ref", SettingsHelper.GraphResourceUrl, groupid);
            string strAddMememberToGroup = "{\"@odata.id\":\"" + SettingsHelper.GraphResourceUrl + "users('" + userObjectId + "')\"}";

            try
            {
                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    var requestMessage = new HttpRequestMessage(HttpMethod.Post, restURL);
                    requestMessage.Content = new StringContent(strAddMememberToGroup, System.Text.Encoding.UTF8, "application/json");
                    using (var response = await client.SendAsync(requestMessage))
                    {
                        if (response.IsSuccessStatusCode)
                            return;
                        else
                            throw new Exception("add memeber to group error: " + response.StatusCode);
                    }
                }
            }
            catch (Exception el)
            {
                el.ToString();
            }
        }

        private async Task CreatePlan(MyPlan myPlan, string groupId)
        {
            var accessToken = await GetGraphAccessTokenAsync();
            var restURL = string.Format("{0}plans/", SettingsHelper.GraphResourceUrl);
            dynamic postPlanJSON = new JObject();
            postPlanJSON.title = myPlan.title;
            postPlanJSON.owner = groupId;

            try
            {
                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    var requestMessage = new HttpRequestMessage(HttpMethod.Post, restURL);
                    requestMessage.Content = new StringContent(postPlanJSON.ToString(), System.Text.Encoding.UTF8, "application/json");
                    using (var response = await client.SendAsync(requestMessage))
                    {
                        if (response.IsSuccessStatusCode)
                            return;
                        else
                            throw new Exception("add plan error: " + response.StatusCode);
                    }
                }
            }
            catch (Exception el)
            {
                el.ToString();
            }
        }
        public async Task UpdatePlan(MyPlan myPlan)
        {
            var accessToken = await GetGraphAccessTokenAsync();
            var restURL = string.Format("{0}plans/{1}", SettingsHelper.GraphResourceUrl, myPlan.id);
            dynamic postPlanJSON = new JObject();
            postPlanJSON.title = myPlan.title;
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    byte[] btBodys = Encoding.UTF8.GetBytes(postPlanJSON.ToString());
                    HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(restURL);
                    request.Method = "PATCH";
                    request.Accept = "application/json";
                    request.ContentType = "application/json";
                    request.Headers.Add("Authorization", "Bearer " + accessToken);
                    request.Headers.Add("If-Match", myPlan.Etag);
                    request.GetRequestStream().Write(btBodys, 0, btBodys.Length);
                    using (HttpWebResponse response = await request.GetResponseAsync() as HttpWebResponse)
                    {
                        if (response.StatusCode == HttpStatusCode.NoContent)
                        {
                            //update successfully
                        }
                    }
                }
            }
            catch (Exception el)
            {
                el.ToString();
            }
        }
    }
}