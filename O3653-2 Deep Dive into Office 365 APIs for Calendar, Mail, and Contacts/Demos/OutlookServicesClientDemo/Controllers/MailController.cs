using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Threading.Tasks;
using Microsoft.Office365.OutlookServices;
using Microsoft.Office365.OAuth;
using OutlookServicesClientDemo.Models;

namespace OutlookServicesClientDemo.Controllers {
  public class MailController : Controller {
    [Authorize]
    public async Task<ActionResult> Index() {

      List<MyMessage> messages = null;
      MyMessagesRespository repo = new MyMessagesRespository();
      messages = await repo.GetMessages();
      return View(messages);

    }

    [Authorize]
    public async Task<ActionResult> Details(string id) {

      MyMessage myMessage = null;
      MyMessagesRespository repo = new MyMessagesRespository();
      myMessage = await repo.GetMessage(id);
      return View(myMessage);
    }

    [Authorize]
    public async Task<ActionResult> Delete(string id) {
      MyMessagesRespository repo = new MyMessagesRespository();

      if (id != null) {
        await repo.DeleteMessage(id);
      }

      return Redirect("/Mail");

    }

    [Authorize]
    public async Task<ActionResult> Send(MyMessage myMessage) {

      if (Request.HttpMethod == "POST") {
        MyMessagesRespository repo = new MyMessagesRespository();
        await repo.SendMessage(myMessage);
        return Redirect("/Mail");
      } else {
        return View(myMessage);
      }
    }

  }
}