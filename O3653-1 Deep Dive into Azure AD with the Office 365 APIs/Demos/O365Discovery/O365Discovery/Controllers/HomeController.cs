using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace O365Discovery.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			Models.DiscoveryViewModel viewModel = new Models.DiscoveryViewModel { CurrentStep = 1 };

			return View(viewModel);
		}

		public ActionResult FirstSignIn()
		{

			string redirect = Url.Action("FirstSignInResult", "Home", null, "http", Request.Url.Host);
			string FirstSignInUrl = String.Format("https://api.office.com/discovery/me/FirstSignIn?scope=mail.Read&redirect_uri={0}",
																			redirect);


			return Redirect(FirstSignInUrl);
		}

		public ActionResult FirstSignInResult(Models.FirstSignInResult model)
		{
			// save the response 
			this.HttpContext.Session["FSI"] = model;

			Models.DiscoveryViewModel viewModel = new Models.DiscoveryViewModel
																						{
																							CurrentStep = 1,
																							FirstSignInResult = model
																						};

			return View("FirstSignInResult", viewModel);
		}

		public ActionResult GetAuthorized()
		{
			// get the auth uri from First Sign-In
			Models.FirstSignInResult fsi = (Models.FirstSignInResult)HttpContext.Session["FSI"];

			string redirect = Url.Action("GetAuthorizedResult", "Home", null, "http", Request.Url.Host);

			string getAuthorizedUrl = String.Format("{0}?resource=Microsoft.SharePoint&response_type=code&redirect_uri={1}&client_id={2}",
				fsi.authorization_service,
				redirect,
				WebConfigurationManager.AppSettings["ida:ClientId"]);

			return Redirect(getAuthorizedUrl);
		}

		public ActionResult GetAuthorizedResult(Models.GetAuthorizedResult model)
		{
			// save the auth code
			this.HttpContext.Session["GAZ"] = model;

			Models.DiscoveryViewModel viewModel = new Models.DiscoveryViewModel
			{
				CurrentStep = 2,
				FirstSignInResult = (Models.FirstSignInResult)HttpContext.Session["FSI"],
				GetAuthorizedResult = model
			};

			return View("GetAuthorizedResult", viewModel);
		}

		public async Task<ActionResult> Discovery()
		{
			// we need the endpoints from first sign-in
			Models.FirstSignInResult fsi = (Models.FirstSignInResult)HttpContext.Session["FSI"];

			// we will need the code from auth
			Models.GetAuthorizedResult gaz = (Models.GetAuthorizedResult)HttpContext.Session["GAZ"];

			using (var client = new HttpClient())
			{
				client.BaseAddress = new Uri(fsi.token_service);
				client.DefaultRequestHeaders.Clear();
				//client.DefaultRequestHeaders.Add("Content-Type", "application/x-www-form-urlencoded");

				StringBuilder sb = new StringBuilder();
				sb.AppendFormat("{0}={1}", "grant_type", "authorization_code");
				sb.AppendFormat("&{0}={1}", "code", gaz.code);
				sb.AppendFormat("&{0}={1}", "state", gaz.session_state);
				sb.AppendFormat("&{0}={1}", "resource", "https://outlook.office365.com");
				sb.AppendFormat("&{0}={1}", "client_id", WebConfigurationManager.AppSettings["ida:ClientId"]);
				sb.AppendFormat("&{0}={1}", "client_secret", HttpUtility.UrlEncode(WebConfigurationManager.AppSettings["ida:Password"]));
				sb.AppendFormat("&{0}={1}", "redirect_uri", HttpUtility.UrlEncode(Url.Action("DiscoveryResult", "Home", null, "http", Request.Url.Host)));

				//HttpRequestMessage requestMessage = new HttpRequestMessage(HttpMethod.Post, "/Services");
				//requestMessage.Content = new String
				var response = await client.PostAsync("",
																				new StringContent(sb.ToString(),
																													Encoding.UTF8,
																													"application/x-www-form-urlencoded")
																				);

				response.EnsureSuccessStatusCode();
				string content = await response.Content.ReadAsStringAsync();
			}


			Models.DiscoveryViewModel viewModel = new Models.DiscoveryViewModel
			{
				CurrentStep = 3
			};

			return View("GetAuthorizedResult", viewModel);
		}

		public ActionResult DiscoveryResult()
		{
			return View();
		}

	}
}