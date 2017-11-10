using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication1.Controllers
{
	public class ConnectorController : Controller
	{
		// GET: Connector
		public ActionResult Index()
		{
			Response.AppendHeader("Content-Security-Policy", "frame-ancestors office365.microsoft.com *.office365.microsoft.com");
			return View();
		}
	}
}