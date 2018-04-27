using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace _0365_CSOM_DemoWeb.Controllers {

  public class HomeController : Controller {

    [SharePointContextFilter]
    public ActionResult Index() {

      var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);
      using (var clientContext = spContext.CreateUserClientContextForSPHost()) {
        var siteProperties = SharePointSiteManager.GetSiteProperties(clientContext);
        ViewBag.siteProperties = siteProperties;
        return View();
      }

    }

    [SharePointContextFilter]
    public ActionResult GetLists1() {
      var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);
      using (var clientContext = spContext.CreateUserClientContextForSPHost()) {
        var lists = SharePointListManager.GetLists1(clientContext);
        ViewBag.lists = lists;
        return View();
      }

    }

    [SharePointContextFilter]
    public ActionResult GetLists2() {
      var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);
      using (var clientContext = spContext.CreateUserClientContextForSPHost()) {
        var lists = SharePointListManager.GetLists2(clientContext);
        ViewBag.lists = lists;
        return View();
      }
    }

    [SharePointContextFilter]
    public ActionResult CreateLists() {
      return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public ActionResult CreateAnnouncementsList() {

      // create the list in the host web
      var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);
      using (var clientContext = spContext.CreateUserClientContextForSPHost()) {
        SharePointListManager.CreateAnnouncementsList(clientContext);
      }

      // redirect to page which displays list collection and new list
      return RedirectToAction("GetLists2", new {SPHostUrl=Request["SPHostUrl"]} );    
    }
  
  }
}
