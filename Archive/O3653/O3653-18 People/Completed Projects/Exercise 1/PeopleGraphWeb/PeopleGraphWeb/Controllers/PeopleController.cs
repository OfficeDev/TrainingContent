using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Net.Http;
using Newtonsoft.Json;
using PeopleGraphWeb.Auth;
using PeopleGraphWeb.Models;
using PeopleGraphWeb.TokenStorage;

namespace PeopleGraphWeb.Controllers
{
    public class PeopleController : Controller
    {
        private static string _msGraphEndpoint = "https://graph.microsoft.com/beta";

        // GET: People
        public async Task<ActionResult> Index(string userId)
        {
            ViewBag.UserId = userId;
            var token = await GetToken();
            if (!string.IsNullOrEmpty(token))
            {
                var model = await GetPeopleByUserAsync(token, userId);
                return View(model);
            }
            return RedirectToAction("SignOut", "Account");
        }

        private async Task<string> GetToken()
        {
            string userObjId = AuthHelper.GetUserId(System.Security.Claims.ClaimsPrincipal.Current);
            SessionTokenCache tokenCache = new SessionTokenCache(userObjId, HttpContext);

            var authority = ConfigurationManager.AppSettings["ida:AADInstance"] + "common";
            var appId = ConfigurationManager.AppSettings["ida:AppId"];
            var appSecret = ConfigurationManager.AppSettings["ida:AppSecret"];
            AuthHelper authHelper = new AuthHelper(authority, appId, appSecret, tokenCache);
            var redirectUri = ConfigurationManager.AppSettings["ida:PostLogoutRedirectUri"];
            return await authHelper.GetUserAccessToken(redirectUri);
        }

        private HttpClient GetHttpClient(string token)
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Accept", "application/json");

            // set the access token on all requests to the Microsoft Graph API
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
            return client;
        }

        private async Task<IEnumerable<People>> GetPeopleByUserAsync(string token, string userId)
        {
            var client = GetHttpClient(token);

            // create query
            var query = string.IsNullOrEmpty(userId) ? _msGraphEndpoint + "/me/people" : string.Format("{0}/users/{1}/people", _msGraphEndpoint, userId);

            // create request
            var request = new HttpRequestMessage(HttpMethod.Get, query);

            // issue request & get response
            var response = await client.SendAsync(request);
            string content = await response.Content.ReadAsStringAsync();
            var peoples = JsonConvert.DeserializeObject<Collection<People>>(content);
            return peoples.value;
        }
    }
}