using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Threading.Tasks;
using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;

using ExchangeClientDemo.Models;

namespace ExchangeClientDemo.Controllers {
    public class HomeController : Controller {
        public async Task<ActionResult> Index() {

            try {
                CurrentUserRespository repo = new CurrentUserRespository();
                var currentUser = await repo.GetCurrentUser();
                ViewBag.currentUserId = currentUser.Id;
                ViewBag.currentUserDisplayName = currentUser.DisplayName;
                ViewBag.currentUserMailboxGuid = currentUser.MailboxGuid;

            }
            catch (RedirectRequiredException x) {
                return Redirect(x.RedirectUri.ToString());
            }
            return View();
        }

    }
}