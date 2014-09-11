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
    public class MailController : Controller {
        public async Task<ActionResult> Index() {

            List<ExchangeClientDemo.Models.MyMessage> messages = null;
            try {
                MyMessagesRespository repo = new MyMessagesRespository();
                messages = await repo.GetMessages();
            }
            catch (RedirectRequiredException x) {
                return Redirect(x.RedirectUri.ToString());
            }
            return View(messages);

        }

        public async Task<ActionResult> Details(string id) {

            ExchangeClientDemo.Models.MyMessage myMessage = null;
            try {
                MyMessagesRespository repo = new MyMessagesRespository();
                myMessage = await repo.GetMessage(id);
            }
            catch (RedirectRequiredException x) {
                return Redirect(x.RedirectUri.ToString());
            }
            return View(myMessage);
        }

        public async Task<ActionResult> Delete(string id) {
            MyMessagesRespository repo = new MyMessagesRespository();

            if (id != null) {
                await repo.DeleteMessage(id);
            }

            return Redirect("/Mail");

        }

        public async Task<ActionResult> Send(ExchangeClientDemo.Models.MyMessage myMessage) {

            if (Request.HttpMethod == "POST") {
                MyMessagesRespository repo = new MyMessagesRespository();
                await repo.SendMessage(myMessage);
                return Redirect("/Mail");
            }
            else {
                string currentUserEmail = System.Web.HttpContext.Current.Session["currentUserEmail"].ToString();
                myMessage.From = currentUserEmail;
                myMessage.ToRecipients = new List<string>(){currentUserEmail};
                return View(myMessage);
            }
        }

    }
}