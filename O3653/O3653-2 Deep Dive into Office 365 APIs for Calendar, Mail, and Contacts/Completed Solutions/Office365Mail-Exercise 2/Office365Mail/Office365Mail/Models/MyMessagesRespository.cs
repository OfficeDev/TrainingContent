using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Text;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Diagnostics;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
using System.Configuration;
using System.Security.Claims;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Office365Mail.Util;

namespace Office365Mail.Models
{
    public class MyMessagesRespository
    {
        private string GraphResourceUrl = "https://graph.microsoft.com/V1.0/";
        public bool MorePagesAvailable = false;
        public static async Task<string> GetGraphAccessTokenAsync()
        {
            var AzureAdGraphResourceURL = "https://graph.microsoft.com/";
            var Authority = ConfigurationManager.AppSettings["ida:AADInstance"] + ConfigurationManager.AppSettings["ida:TenantId"];

            var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
            var userObjectId = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
            var clientCredential = new ClientCredential(ConfigurationManager.AppSettings["ida:ClientId"], ConfigurationManager.AppSettings["ida:ClientSecret"]);
            var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

            // create auth context
            AuthenticationContext authContext = new AuthenticationContext(Authority, new ADALTokenCache(signInUserId));
            var result = await authContext.AcquireTokenSilentAsync(AzureAdGraphResourceURL, clientCredential, userIdentifier);

            return result.AccessToken;
        }
        public static async Task<string> GetJsonAsync(string url)
        {
            string accessToken = await GetGraphAccessTokenAsync();
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                using (var response = await client.GetAsync(url))
                {
                    if (response.IsSuccessStatusCode)
                        return await response.Content.ReadAsStringAsync();
                    return null;
                }
            }
        }
        public async Task<List<MyMessage>> GetMessages(int pageIndex, int pageSize)
        {

            List<MyMessage> messageList = new List<MyMessage>();
            try
            {
                string restURL = string.Format("{0}/me/messages?$orderby=SentDateTime desc&$skip={1}&$top={2}", GraphResourceUrl, pageIndex * pageSize, pageSize);
                string responseString = await GetJsonAsync(restURL);
                if (responseString != null)
                {
                    MorePagesAvailable = !JObject.Parse(responseString)["@odata.nextLink"].IsNullOrEmpty();
                    var jsonresult = JObject.Parse(responseString)["value"];
                    foreach (var item in jsonresult)
                    {
                        var msg = new MyMessage();
                        msg.Id = item["id"].IsNullOrEmpty() ? string.Empty : item["id"].ToString();
                        msg.Subject = item["subject"].IsNullOrEmpty() ? string.Empty : item["subject"].ToString();
                        msg.DateTimeReceived = item["receivedDateTime"].IsNullOrEmpty() ? new DateTime() : DateTime.Parse(item["receivedDateTime"].ToString());
                        if (!item["from"].IsNullOrEmpty() && !item["from"]["emailAddress"].IsNullOrEmpty())
                        {
                            msg.FromName = item["from"]["emailAddress"]["name"].IsNullOrEmpty() ? string.Empty : item["from"]["emailAddress"]["name"].ToString();
                            msg.FromEmailAddress = item["from"]["emailAddress"]["address"].IsNullOrEmpty() ? string.Empty : item["from"]["emailAddress"]["address"].ToString();
                        }
                        if (!item["toRecipients"].IsNullOrEmpty())
                        {
                            var to = item["toRecipients"].ToArray();
                            if (!to[0]["emailAddress"].IsNullOrEmpty())
                            {
                                msg.ToName = to[0]["emailAddress"]["name"].IsNullOrEmpty() ? string.Empty : to[0]["emailAddress"]["name"].ToString();
                                msg.ToEmailAddress = to[0]["emailAddress"]["address"].IsNullOrEmpty() ? string.Empty : to[0]["emailAddress"]["address"].ToString();
                            }
                        }

                        messageList.Add(msg);
                    }
                }
            }

            catch (Exception el)
            {
                Debug.WriteLine("GetMessages error: " + el.ToString());
            }
            return messageList;
        }
        public async Task<MyMessage> GetMessage(string id)
        {
            try
            {
                var restURL = string.Format("{0}/me/messages/{1}", GraphResourceUrl, id);
                string responseString = await GetJsonAsync(restURL);

                if (responseString != null)
                {
                    var jsonresult = JObject.Parse(responseString);
                    var msg = new MyMessage();
                    msg.Id = jsonresult["id"].IsNullOrEmpty() ? string.Empty : jsonresult["id"].ToString();
                    msg.Subject = jsonresult["subject"].IsNullOrEmpty() ? string.Empty : jsonresult["subject"].ToString();
                    msg.DateTimeReceived = jsonresult["receivedDateTime"].IsNullOrEmpty() ? new DateTime() : DateTime.Parse(jsonresult["receivedDateTime"].ToString());
                    msg.DateTimeSent = jsonresult["sentDateTime"].IsNullOrEmpty() ? new DateTime() : DateTime.Parse(jsonresult["sentDateTime"].ToString());

                    if (!jsonresult["from"].IsNullOrEmpty() && !jsonresult["from"]["emailAddress"].IsNullOrEmpty())
                    {
                        msg.FromName = jsonresult["from"]["emailAddress"]["name"].IsNullOrEmpty() ? string.Empty : jsonresult["from"]["emailAddress"]["name"].ToString();
                        msg.FromEmailAddress = jsonresult["from"]["emailAddress"]["address"].IsNullOrEmpty() ? string.Empty : jsonresult["from"]["emailAddress"]["address"].ToString();
                    }
                    if (!jsonresult["toRecipients"].IsNullOrEmpty())
                    {
                        var to = jsonresult["toRecipients"].ToArray();
                        if (!to[0]["emailAddress"].IsNullOrEmpty())
                        {
                            msg.ToName = to[0]["emailAddress"]["name"].IsNullOrEmpty() ? string.Empty : to[0]["emailAddress"]["name"].ToString();
                            msg.ToEmailAddress = to[0]["emailAddress"]["address"].IsNullOrEmpty() ? string.Empty : to[0]["emailAddress"]["address"].ToString();
                        }
                    }
                    if (!jsonresult["body"].IsNullOrEmpty())
                    {
                        msg.Body = jsonresult["body"]["content"].IsNullOrEmpty() ? string.Empty : jsonresult["body"]["content"].ToString();
                    }
                    return msg;
                }
            }

            catch (Exception el)
            {
                Debug.WriteLine("GetMessage error: " + el.ToString());
            }
            return null;
        }
        public async Task<bool> DeleteMessage(string id)
        {
            var restURL = string.Format("{0}/me/messages/{1}", GraphResourceUrl, id);

            string accessToken = await GetGraphAccessTokenAsync();
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                using (var response = await client.DeleteAsync(restURL))
                {
                    if (response.IsSuccessStatusCode)
                        return true;
                    else
                        Debug.WriteLine("DeleteMessage error: " + response.StatusCode);
                }
            }

            return false;
        }
        public async Task SendMessage(MyMessage myMessage)
        {
            var restURL = string.Format("{0}/me/Microsoft.Graph.sendMail", GraphResourceUrl);
            string accessToken = await GetGraphAccessTokenAsync();
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var to = new { EmailAddress = new { Name = myMessage.ToName, Address = myMessage.ToEmailAddress } };
                var msg = new
                {
                    Message = new
                    {
                        Subject = myMessage.Subject,
                        Body = new
                        {
                            ContentType = "TEXT",
                            Content = myMessage.Body
                        },
                        ToRecipients = new[] { to }
                    },
                    SaveToSentItems = true
                };
                string postBody = JsonConvert.SerializeObject(msg);
                using (var response = await client.PostAsync(restURL, new StringContent(postBody, Encoding.UTF8, "application/json")))
                {
                    if (response.IsSuccessStatusCode)
                        return;
                    else
                        Debug.WriteLine("SendMessage error: " + response.StatusCode);
                }
            }
        }
    }
}