using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace OneNoteDev
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
              "Page",
              "Notebooks/{notebookid}/Section/{sectionid}/{action}",
              new { controller = "Page", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
              "Section",
              "Notebooks/{notebookid}/Section/{action}",
              new { controller = "Section", action = "Index" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
