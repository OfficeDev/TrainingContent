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
  public class EventsController : Controller {
    [Authorize]
    public async Task<ActionResult> Index() {

      List<MyEvent> events = null;
      MyEventsRepository repo = new MyEventsRepository();
      events = await repo.GetEvents();
      return View(events);

    }

    [Authorize]
    public async Task<ActionResult> Details(string id) {

      MyEvent myEvent = null;
      MyEventsRepository repo = new MyEventsRepository();
      myEvent = await repo.GetEvent(id);
      return View(myEvent);
    }

    [Authorize]
    public async Task<ActionResult> Delete(string id) {
      MyEventsRepository repo = new MyEventsRepository();

      if (id != null) {
        await repo.DeleteEvent(id);
      }

      return Redirect("/Events");

    }

    [Authorize]
    public async Task<ActionResult> Create(MyEvent myEvent) {

      if (Request.HttpMethod == "POST") {
        MyEventsRepository repo = new MyEventsRepository();
        await repo.AddEvent(myEvent);
        return Redirect("/Events");
      } else {
        myEvent.Start = DateTimeOffset.Now;
        myEvent.End = DateTimeOffset.Now.AddDays(1);
        return View(myEvent);
      }
    }
  }
}