using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IdentityModel.Claims;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Office365Mail.Data;

namespace Office365Mail {
  public class MvcApplication : System.Web.HttpApplication {
    protected void Application_Start() {
      AreaRegistration.RegisterAllAreas();
      FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
      RouteConfig.RegisterRoutes(RouteTable.Routes);
      BundleConfig.RegisterBundles(BundleTable.Bundles);

      Database.SetInitializer(new Office365MailInitializer());

      // configure antiforgery token to use specific claim in the 
      //  case default claim type it uses isn't in the user's claim...
      //  specify it to something you know is present in their claim
      AntiForgeryConfig.UniqueClaimTypeIdentifier = ClaimTypes.NameIdentifier;
    }
  }
}
