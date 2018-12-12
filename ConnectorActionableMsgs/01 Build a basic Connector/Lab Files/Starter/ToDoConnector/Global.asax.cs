using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace ToDoConnector
{
	public class WebApiApplication : System.Web.HttpApplication
	{
		protected void Application_Start()
		{
			GlobalConfiguration.Configure(WebApiConfig.Register);
			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
			RouteConfig.RegisterRoutes(RouteTable.Routes);
		}
	}
}
