using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Text;
using System.Xml;
using System.Xml.Linq;
using System.Runtime.Serialization.Json;
using System.Net.Http;
using System.Net.Http.Headers;

namespace YammerOGApp
{
    public partial class _Default : Page
    {
        public const string ClientId = "HyJWY8MJpOBV5lGMMQQRQ";
        public const string RedirectUri = "http://localhost:19356/";
        public const string ClientSecret = "5xFzSmZ5lTW0kim5bizpbybOqhxiGJkDkVucGXYf8";

        protected async void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
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
                    string code = Request.QueryString["code"];

                    if (code == null)
                    {
                        Response.Redirect(
                            String.Format("https://www.yammer.com/dialog/oauth?client_id={0}&redirect_uri={1}",
                            ClientId, RedirectUri), false);
                    }
                    else
                    {

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
                }

            }
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

        protected async void createActivity_Click(object sender, EventArgs e)
        {
            string accessToken = GetFromCache("AccessToken").ToString();

            string requestUri = "https://www.yammer.com/api/v1/activity.json";

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            ActivityEnvelope envelope = new ActivityEnvelope();
            envelope.Activity.Actor.Name = actorName.Text;
            envelope.Activity.Actor.Email = actorEmail.Text;
            envelope.Activity.Action = "create";
            envelope.Activity.Message = activityMessage.Text;
            envelope.Activity.OG_Object.Title = objectTitle.Text;
            envelope.Activity.OG_Object.Url = objectUrl.Text;
                
            string json = envelope.GetJSON();

            StringContent requestContent = new StringContent(json);
            request.Content = requestContent;
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.SendAsync(request);
            XElement root = Json2Xml(await response.Content.ReadAsStringAsync());

        }
    }
}