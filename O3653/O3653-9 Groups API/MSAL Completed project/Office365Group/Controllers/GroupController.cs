using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Threading;
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

        public async Task<ActionResult> GroupMembers(string id)
        {
            ViewBag.GroupId = id;
            var members = await _repo.GetGroupMembers(id);
            return View("GroupMembers", members);
        }

        [HttpPost]
        public async Task<ActionResult> AddMember(string groupId, string newMemberEmail)
        {
            await _repo.AddGroupMember(groupId, newMemberEmail);
            return RedirectToAction("GroupMembers", new RouteValueDictionary(new { id = groupId }));
        }

        public async Task<ActionResult> GroupConversations(string id)
        {
            ViewBag.GroupId = id;
            var conversations = await _repo.GetGroupConversations(id);
            return View("GroupConversations", conversations);
        }

        [HttpPost]
        public async Task<ActionResult> AddConversation(string groupId, string topic, string message)
        {
            await _repo.AddGroupConversation(groupId, topic, message);
            // Sometimes the newly added conversation can't be retrieved immediately, so wait a second to work around this issue
            Thread.Sleep(1000);
            return RedirectToAction("GroupConversations", new RouteValueDictionary(new { id = groupId }));
        }

        public async Task<ActionResult> GroupThreads(string id)
        {
            ViewBag.GroupId = id;
            var threads = await _repo.GetGroupThreads(id);
            return View("GroupThreads", threads);
        }

        [HttpPost]
        public async Task<ActionResult> AddThread(string groupId, string topic, string message)
        {
            await _repo.AddGroupThread(groupId, topic, message);
            // Sometimes the newly added thread can't be retrieved immediately, so wait a second to work around this issue
            Thread.Sleep(1000);
            return RedirectToAction("GroupThreads", new RouteValueDictionary(new { id = groupId }));
        }

        public async Task<ActionResult> GroupThreadPosts(string groupId, string threadId)
        {
            ViewBag.GroupId = groupId;
            ViewBag.ThreadId = threadId;
            var threads = await _repo.GetGroupThreadPosts(groupId, threadId);
            return View("GroupThreadPosts", threads);
        }

        public async Task<ActionResult> GroupEvents(string id)
        {
            ViewBag.GroupId = id;
            var groupEvents = await _repo.GetGroupEvents(id);
            return View("GroupEvents", groupEvents);
        }

        [HttpPost]
        public async Task<ActionResult> AddEvent(string groupId, string subject, string start, string end, string location)
        {
            await _repo.AddGroupEvent(groupId, subject, start, end, location);
            return RedirectToAction("GroupEvents", new RouteValueDictionary(new { id = groupId }));
        }

        public async Task<ActionResult> GroupFiles(string id)
        {
            ViewBag.GroupId = id;
            var files = await _repo.GetGroupFiles(id);
            return View("GroupFiles", files);
        }

        [HttpPost]
        public async Task<ActionResult> AddFile(string groupId, string subject, string start, string end, string location)
        {
            var selectedFile = Request.Files["file"];
            string fileName = Path.GetFileName(selectedFile.FileName);
            await _repo.AddGroupFile(groupId, fileName, selectedFile.InputStream);
            return RedirectToAction("GroupFiles", new RouteValueDictionary(new { id = groupId }));
        }

        public async Task<ActionResult> SearchGroup(string groupName)
        {
            var groups = await _repo.SearchGroupByName(groupName);
            return View("List", groups);
        }

        [Authorize]
        public async Task<ActionResult> Photo(string groupId)
        {
            Stream photo = await _repo.GetGroupPhoto(groupId);
            return new FileStreamResult(photo, "image/jpeg");
        }

        public async Task<ActionResult> CreateGroup(string groupName, string groupAlias)
        {
            await _repo.CreateGroup(groupName, groupAlias);
            return RedirectToAction("Index");
        }
    }
}