using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Configuration;
using System.Web.Routing;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.Graph;
using GraphUsersGroups.TokenStorage;
using GraphUsersGroups.Auth;

namespace GraphUsersGroups.Controllers
{
    public class GroupSearchController : Controller
    {
        public static string appId = ConfigurationManager.AppSettings["ida:AppId"];
        public static string appSecret = ConfigurationManager.AppSettings["ida:AppSecret"];
        public static string aadInstance = ConfigurationManager.AppSettings["ida:AADInstance"];
        // GET: GroupSearch
        public ActionResult Index()
        {
            List<Group> groups = new List<Group>();
            return View(groups);
        }

        [HttpPost]
        public async Task<ActionResult> Index(FormCollection fc, string searchString)
        {
            // Search for users with name or mail that includes searchString.
            var client = GetGraphServiceClient();

            List<Group> groups = new List<Group>();

            // Graph query for groups, filtering by displayName, mail, and mailNickname.
            // Only query for displayName, userPrincipalName, id of matching users through select.
            try
            {
                var result = await client.Groups.Request().Top(10).Filter("startswith(displayName,'" + searchString +
                "') or startswith(mail,'" + searchString +
                "') or startswith(mailNickname,'" + searchString + "')").Select("displayName,description,id").GetAsync();

                // Add users to the list and return to the view.
                foreach (Group _group in result)
                {
                    groups.Add(_group);
                }
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                return View("Error");
            }
            return View(groups);
        }

        [Authorize]
        // GET group members and page through the results (10 at a time)
        public async Task<ActionResult> GroupMembers(string groupId, string nextLink)
        {
            // Show the profile of a user after a user is clicked from the search.
            var client = GetGraphServiceClient();
            List<User> userMembers = new List<User>();
            IGroupMembersCollectionWithReferencesPage members = new GroupMembersCollectionWithReferencesPage();
            IGroupMembersCollectionWithReferencesRequest membersRequest = null;

            try
            {

                if (groupId != null)
                {
                    var group = await client.Groups[groupId].Request().Select("displayName,id").GetAsync();
                    ViewBag.groupId = groupId;
                    ViewBag.groupName = group.DisplayName;
                    membersRequest = client.Groups[groupId].Members.Request().Top(10);
                }
                if (nextLink != null)
                {
                    membersRequest = new GroupMembersCollectionWithReferencesRequest(nextLink, client, null);
                }
                members = await membersRequest.GetAsync();
                if (members.NextPageRequest != null)
                {
                    ViewBag.NextLink = members.NextPageRequest.GetHttpRequestMessage().RequestUri;
                }
                else
                {
                    ViewBag.NextLink = null;
                }

                foreach (DirectoryObject d in members.CurrentPage)
                {
                    User u = d as User;
                    userMembers.Add(u);
                }
            }
            catch (Exception)
            {
                // no users?
            }
            return View(userMembers);
        }




        private GraphServiceClient GetGraphServiceClient()
        {
            string userObjId = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
            string tenantID = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid").Value;
            string authority = "common";
            SessionTokenCache tokenCache = new SessionTokenCache(userObjId, HttpContext);

            // Create an authHelper using the the app Id and secret and the token cache.
            AuthHelper authHelper = new AuthHelper(authority, appId, appSecret, tokenCache);

            // Request an accessToken and provide the original redirect URL from sign-in.
            GraphServiceClient client = new GraphServiceClient(new DelegateAuthenticationProvider(async (request) =>
            {
                string accessToken = await authHelper.GetUserAccessToken(Url.Action("Index", "Home", null, Request.Url.Scheme));
                request.Headers.TryAddWithoutValidation("Authorization", "Bearer " + accessToken);
            }));

            return client;
        }
    }
}