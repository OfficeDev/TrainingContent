using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Web.Mvc;
using System.Threading;
using System.Threading.Tasks;

using Office365Group.Models;
using System.Web.Routing;

namespace Office365Group.Controllers
{
    [Authorize]
    public class GroupController : Controller
    {

        GroupRespository _repo = new GroupRespository();

        // GET: Group
        public ActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> AboutMe()
        {
            return View();
        }

        public async Task<ActionResult> MyOrganizationGroups()
        {
            return View();
        }

        public async Task<ActionResult> JoinedGroups()
        {
            return View();
        }

        public async Task<ActionResult> GroupMembers(string id)
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> AddMember(string groupId, string newMemberEmail)
        {
            return View();
        }

        public async Task<ActionResult> GroupConversations(string id)
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> AddConversation(string groupId, string topic, string message)
        {
            return View();
        }

        public async Task<ActionResult> GroupThreads(string id)
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> AddThread(string groupId, string topic, string message)
        {
            return View();
        }

        public async Task<ActionResult> GroupThreadPosts(string groupId, string threadId)
        {
            return View();
        }

        public async Task<ActionResult> GroupEvents(string id)
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> AddEvent(string groupId, string subject, string start, string end, string location)
        {
            return View();
        }

        public async Task<ActionResult> GroupFiles(string id)
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> AddFile(string groupId, string subject, string start, string end, string location)
        {
            return View();
        }

        public async Task<ActionResult> SearchGroup(string groupName)
        {
            return View();
        }

        [Authorize]
        public async Task<ActionResult> Photo(string groupId)
        {
            return View();
        }

        public async Task<ActionResult> CreateGroup(string groupName, string groupAlias)
        {
            return View();
        }
    }
}