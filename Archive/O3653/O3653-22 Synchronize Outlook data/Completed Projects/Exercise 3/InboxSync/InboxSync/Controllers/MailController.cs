using System.Threading.Tasks;
using System.Web.Mvc;
using PagedList;
using InboxSync.Models;
using InboxSync.Helpers;

namespace InboxSync.Controllers
{
    public class MailController : Controller
    {
        [Authorize]
        public async Task<ActionResult> Inbox(int? page)
        {
            var user = await UserManager.AddOrUpdateCurrentUser();

            int pageSize = 20;
            int pageNumber = (page ?? 1);
            long totalCount = await UserManager.GetUsersMessageCount(user.Id);

            var messages = await UserManager.GetUsersMessages(user.Id, pageSize, pageNumber);
            return View(new StaticPagedList<Message>(messages, pageNumber, pageSize, (int)totalCount));

        }
        [Authorize]
        [HttpPost]
        public async Task<ActionResult> SyncInbox()
        {
            var user = await UserManager.AddOrUpdateCurrentUser();
            try
            {
                await UserManager.SyncUsersInbox(user);
            }
            catch (Microsoft.Graph.ServiceException se)
            {
                if (se.Error.Message == "Error_AuthChallengeNeeded") return new EmptyResult();
                return RedirectToAction("Index", "Error", new { message = se.Error.Message + Request.RawUrl + ": " + se.Error.Message });
            }

            return RedirectToAction("Inbox");
        }
    }
}