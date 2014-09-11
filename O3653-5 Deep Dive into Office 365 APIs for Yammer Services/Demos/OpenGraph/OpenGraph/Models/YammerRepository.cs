using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml;
using System.Xml.Linq;

namespace OpenGraph.Models
{
    public static class YammerRepository
    {
        public static string ClientId = "";
        public static string RedirectUri = "";
        public static string ClientSecret = "";

        public static async Task PostActivity(ActivityEnvelope activityEnvelope)
        {

            //Post New Message
            string accessToken = await GetAccessToken();

            string requestUri = "https://www.yammer.com/api/v1/activity.json";

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            string json = activityEnvelope.GetJSON();

            //string json = "{\"activity\":{\"actor\":{";
            //json += "\"name\":\"Scot Hillier\",\"email\":\"scot@msacademy.onmicrosoft.com\"}";
            //json += ",\"action\":\"create\",\"object\":{\"url\":\"http://c.s-microsoft.com/en-us/CMSImages/mslogo.png?version=856673f8-e6be-0476-6669-d5bf2300391d\",\"title\":\"";
            //json += title.Text;
            //json += "\"},\"message\":\"";
            //json += message.Text;
            //json += "\"}}";

            StringContent requestContent = new StringContent(json);
            request.Content = requestContent;
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.SendAsync(request);
            XElement root = Json2Xml(await response.Content.ReadAsStringAsync());

        }

        private static async Task<string> GetAccessToken()
        {

            string accessToken = null;
            try
            {
                accessToken = GetFromCache("AccessToken").ToString();
            }
            catch
            {
                accessToken = null;
            }
            if (accessToken == null)
            {
                string code = GetFromCache("AuthorizationCode").ToString();

                string requestUri = String.Format(
                    "https://www.yammer.com/oauth2/access_token.json?client_id={0}&client_secret={1}&code={2}",
                    ClientId, ClientSecret, code);


                HttpClient client = new HttpClient();
                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage response = await client.SendAsync(request);
                XElement root = Json2Xml(await response.Content.ReadAsStringAsync());
                accessToken = root.Descendants("token").First().Value;
                SaveInCache("AccessToken", accessToken);
            }
            return accessToken;
        }

        private static XElement Json2Xml(string json)
        {
            using (XmlDictionaryReader reader = JsonReaderWriterFactory.CreateJsonReader(
                Encoding.UTF8.GetBytes(json),
                XmlDictionaryReaderQuotas.Max))
            {
                return XElement.Load(reader);
            }

        }

        public static void SaveInCache(string name, object value)
        {
            System.Web.HttpContext.Current.Session[name] = value;
        }

        public static object GetFromCache(string name)
        {
            return System.Web.HttpContext.Current.Session[name];
        }

        public static void RemoveFromCache(string name)
        {
            System.Web.HttpContext.Current.Session.Remove(name);
        }
    }
}