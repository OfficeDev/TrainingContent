using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using ClientCredsAddin.Models;
using ClientCredsAddin.Utils;

namespace ClientCredsAddin.Controllers
{
    public class MailController : Controller
    {
        // GET: Mail
        public ActionResult Index()
        {
            // try to load the app state (set if previously authenticated)
            //  if session value not present, create new app state
            var appState = Session["ClientCredsAddinAppState"] as AppState ?? new AppState();

            // create viewmodel for the view
            var viewModel = new MailViewModel
            {
                AppState = appState
            };

            // if logged in, get data and add to view model
            if (appState.AppIsAuthorized)
            {
                // create select list of all users
                viewModel.UserListSelectors = GetMailboxSelectOptions(appState.MailboxList);
            }

            return View(viewModel);
        }

        [HttpPost]
        [MultipleButton(Name = "action", Argument = "GoAdminConsent")]
        public ActionResult Authorize()
        {
            return Redirect("/Account/AdminConsentApp");
        }

        [HttpPost]
        [MultipleButton(Name = "action", Argument = "viewMailboxMessages")]
        public async Task<ActionResult> ListEmailMessages()
        {
            var appState = Session["ClientCredsAddinAppState"] as AppState;

            // get requested mailbox
            var requestedMailbox = Request.Form["Mailbox"];

            // build view model
            var viewModel = new MailViewModel
            {
                AppState = appState,
                SelectedMailbox = requestedMailbox,
                UserListSelectors = GetMailboxSelectOptions(appState.MailboxList)
            };

            // get messages
            var repo = new MessageRepository(viewModel.AppState.AppOnlyGraphToken);
            var mailBox = appState.MailboxList.Where(pair => pair.Value == requestedMailbox).FirstOrDefault();
            var results = await repo.GetMessages(mailBox.Key);

            viewModel.SelectedMailbox = requestedMailbox;
            viewModel.Messages = results;

            return View("Index", viewModel);
        }

        private List<SelectListItem> GetMailboxSelectOptions(Dictionary<string, string> mailboxList)
        {
            return mailboxList.Select(user => new SelectListItem
            {
                Text = user.Value,
                Value = user.Value
            }).ToList();
        }
    }
}