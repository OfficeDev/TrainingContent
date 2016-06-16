using Newtonsoft.Json.Linq;
using OAuthControllerWeb.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using WebApp.Controllers;

namespace OAuthControllerWeb.Controllers
{
    public class HomeController : Controller
    {
        public async Task<ActionResult> Index()
        {
            //OAuth Controller
            string resourceId = ConfigurationManager.AppSettings["ida:ResourceId"];
            string accessToken = null;
            string redirectUri = null;
            string authorizationUrl = null;
            string tenantId = (string)OAuthController.GetFromCache("TenantId");

            if (tenantId != null)
            {
                accessToken = OAuthController.GetAccessTokenFromCacheOrRefreshToken(tenantId, resourceId );
            }

            if (accessToken == null)
            {
                redirectUri = this.Request.Url.GetLeftPart(UriPartial.Authority).ToString() + "/Home";
                authorizationUrl = OAuthController.GetAuthorizationUrl(resourceId, Request);
                OAuthController.SaveInCache("RedirectTo", new Uri(redirectUri));
                return new RedirectResult(authorizationUrl);
            }

            //Search Query Uri
            StringBuilder requestUri = new StringBuilder(resourceId)
                .Append("/O3652-7/_api/web/lists/getbytitle('Contacts')/items");

            //Execute Query
            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            HttpResponseMessage response = await client.SendAsync(request);
            string json = await response.Content.ReadAsStringAsync();

            //Parse JSON
            JObject jsonObject = JObject.Parse(json);

            List<Person> people = new List<Person>();

            foreach (var p in jsonObject["value"])
            {

                string lastName = p["Title"].Value<string>();
                string firstName = p["FirstName"].Value<string>();
                string jobTitle = p["JobTitle"].Value<string>();
                string workEmail = p["EMail"].Value<string>();
                string workPhone = p["WorkPhone"].Value<string>();
                if (lastName != null)
                {
                    people.Add(new Person()
                    {
                        LastName = lastName,
                        FirstName = firstName,
                        JobTitle = jobTitle,
                        WorkEmail = workEmail,
                        WorkPhone = workPhone
                    });
                }
            }

            ViewBag.People = people;
            return View();
        }


    }
}