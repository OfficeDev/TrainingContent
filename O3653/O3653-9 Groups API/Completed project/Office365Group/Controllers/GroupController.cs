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
            var me = await _repo.GetMe();
            return View(me);
        }

        public async Task<ActionResult> MyOrganizationGroups()
        {
            var groups = await _repo.GetMyOrganizationGroups();
            return View("List", groups);
        }

        public async Task<ActionResult> JoinedGroups()
        {
            var groups = await _repo.GetJoinedGroups();
            return View("List", groups);
        }

        public async Task<ActionResult> GroupConversations(string id)
        {
            var conversations = await _repo.GetGroupConversations(id);
            return View("GroupConversations", conversations);
        }

        public async Task<ActionResult> GroupThreads(string id)
        {
            var threads = await _repo.GetGroupThreads(id);
            ViewData["GroudId"] = id;
            return View("GroupThreads", threads);
        }

        public async Task<ActionResult> GroupThreadPosts(string groupId, string threadId)
        {
            var threads = await _repo.GetGroupThreadPosts(groupId, threadId);
            return View("GroupThreadPosts", threads);
        }

        public async Task<ActionResult> GroupEvents(string id)
        {
            var groupEvents = await _repo.GetGroupEvents(id);
            return View("GroupEvents", groupEvents);
        }
        public async Task<ActionResult> GroupFiles(string id)
        {
            var files = await _repo.GetGroupFiles(id);
            return View("GroupFiles", files);
        }

        public async Task<ActionResult> SearchGroup(string groupName)
        {
            var groups = await _repo.SearchGroupByName(groupName);
            return View("List", groups);
        }
    }
}