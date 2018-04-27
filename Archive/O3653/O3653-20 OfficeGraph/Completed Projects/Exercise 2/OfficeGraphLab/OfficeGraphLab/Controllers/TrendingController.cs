using System;
using System.Configuration;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Net.Http;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using OfficeGraphLab.Auth;
using OfficeGraphLab.Models;
using OfficeGraphLab.TokenStorage;

namespace OfficeGraphLab.Controllers
{
    public class TrendingController : Controller
    {
        private static string _msGraphEndpoint = "https://graph.microsoft.com/beta";

        public async Task<ActionResult> Index(string userId)
        {
            var token = await GetToken();
            if (!string.IsNullOrEmpty(token))
            {
                var model = await GetTrendingAroundByUserAsync(token, userId);
                return View(model);
            }
            return RedirectToAction("SignOut", "Account");
        }

        public async Task<ActionResult> Users()
        {
            var token = await GetToken();
            if (!string.IsNullOrEmpty(token))
            {
                var model = await GetUsersAsync(token);
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

        private async Task<IEnumerable<Trending>> GetTrendingAroundByUserAsync(string token, string userId)
        {
            var client = GetHttpClient(token);

            // create query
            var query = string.IsNullOrEmpty(userId) ? _msGraphEndpoint + "/me/insights/trending" : string.Format("{0}/users/{1}/insights/trending", _msGraphEndpoint, userId);

            // create request
            var request = new HttpRequestMessage(HttpMethod.Get, query);

            // issue request & get response
            var response = await client.SendAsync(request);
            string content = await response.Content.ReadAsStringAsync();
            var trendingArounds = JsonConvert.DeserializeObject<Collection<Trending>>(content);
            return trendingArounds.value;
        }

        private async Task<IEnumerable<User>> GetUsersAsync(string token)
        {
            var client = GetHttpClient(token);

            // create query
            var query = string.Format("{0}/users", _msGraphEndpoint);

            // create request
            var request = new HttpRequestMessage(HttpMethod.Get, query);

            // issue request & get response
            var response = await client.SendAsync(request);
            string content = await response.Content.ReadAsStringAsync();
            var users = JsonConvert.DeserializeObject<Collection<User>>(content);
            var domain = ConfigurationManager.AppSettings["ida:Domain"];
            return users.value.Where(user => !string.IsNullOrEmpty(user.Mail) && user.Mail.EndsWith(domain)).Select(user => user);
        }
    }
}