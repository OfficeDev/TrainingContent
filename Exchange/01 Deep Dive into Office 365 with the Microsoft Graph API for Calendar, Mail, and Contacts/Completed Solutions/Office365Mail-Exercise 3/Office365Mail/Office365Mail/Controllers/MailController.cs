using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Threading.Tasks;
using Office365Mail.Models;

namespace Office365Mail.Controllers
{
    [Authorize]
    public class MailController : Controller
    {
        MyMessagesRespository _repo = new MyMessagesRespository();

        // GET: Mail
        public async Task<ActionResult> Index(int? pageNumber)
        {
            // setup paging
            const int pageSize = 10;
            if (pageNumber == null)
                pageNumber = 1;

            // get list of entities
            var messages = await _repo.GetMessages((int)pageNumber - 1, pageSize);

            ViewBag.pageNumber = pageNumber;
            ViewBag.morePagesAvailable =_repo.MorePagesAvailable;

            return View(messages);

        }
        public async Task<ActionResult> Details(string id)
        {
            MyMessage myMessage = null;
            myMessage = await _repo.GetMessage(id);
            return View(myMessage);
        }
        public async Task<ActionResult> Delete(string id)
        {
            if (id != null)
            {
                await _repo.DeleteMessage(id);
            }

            return Redirect("/Mail");
        }
        [HttpGet]
        public ActionResult Send()
        {
            return View(new MyMessage());
        }

        [HttpPost]
        public async Task<ActionResult> Send(MyMessage myEvent)
        {
            myEvent.FromName = User.Identity.Name;
            myEvent.FromEmailAddress = User.Identity.Name;

            await _repo.SendMessage(myEvent);
            return Redirect("/Mail");
        }
    }
}