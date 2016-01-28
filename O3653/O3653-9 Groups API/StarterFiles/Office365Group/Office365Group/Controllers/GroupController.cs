using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Threading.Tasks;
using Office365Group.Models;

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

        public async Task<ActionResult> GroupConversations(string id)
        {
            return View();
        }

        public async Task<ActionResult> GroupThreads(string id)
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
        public async Task<ActionResult> GroupFiles(string id)
        {
            return View();
        }

        public async Task<ActionResult> SearchGroup(string groupName)
        {
            return View();
        }
    }
}