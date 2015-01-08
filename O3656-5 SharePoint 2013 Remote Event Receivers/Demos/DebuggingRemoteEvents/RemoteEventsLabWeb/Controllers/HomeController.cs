using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RemoteEventsLabWeb.Controllers {
  public class HomeController : Controller {

    [SharePointContextFilter]
    public ActionResult Index() {

      var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);

      using (var clientContext = spContext.CreateUserClientContextForSPHost()) {
        if (clientContext != null) {
          clientContext.Load(clientContext.Web);
          ListCollection Lists = clientContext.Web.Lists;
          clientContext.Load(Lists, lists => lists.Where(list => (!list.Hidden) && (list.BaseType == 0))
                                                  .Include(list => list.Title,
                                                           list => list.DefaultViewUrl));
          clientContext.ExecuteQuery();

          Dictionary<string, string> userLists = new Dictionary<string, string>();

          string siteUrl = clientContext.Web.Url;
          foreach (var list in Lists) {
            userLists.Add(siteUrl + list.DefaultViewUrl, list.Title);
          }

          ViewBag.UserLists = userLists;
        }
      }
      return View();
    }
    
    public ActionResult About() {
      ViewBag.Message = "Your application description page.";

      return View();
    }

    public ActionResult Contact() {
      ViewBag.Message = "Your contact page.";

      return View();
    }
  }
}
