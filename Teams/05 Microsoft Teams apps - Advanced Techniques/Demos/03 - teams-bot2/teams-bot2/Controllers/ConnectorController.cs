using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using System.Threading.Tasks;
using System.Net.Http.Headers;

namespace teams_bot2.Controllers
{
	public class ConnectorController : ApiController
	{
		[HttpGet]
		public async Task<HttpResponseMessage> Landing()
		{
			var htmlBody = "<html><title>Set up connector</title><body>";
			htmlBody += "<H2>Adding your Connector Portal-registered connector</H2>";
			htmlBody += "<p>Click the button to initiate the registration and consent flow for the connector in the selected channel.</p>";
			htmlBody += "";

			var response = Request.CreateResponse(HttpStatusCode.OK);
			response.Content = new StringContent(htmlBody);
			response.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
			return response;
		}

		[HttpGet]
		public async Task<HttpResponseMessage> Redirect()
		{
			// Parse register message from connector, find the group name and webhook url
			//var query = req.query;
			var query = Request.GetQueryNameValuePairs();
			string webhook_url = query.LastOrDefault(p => p.Key.Equals("webhook_url")).Value;
			var group_name = query.LastOrDefault(p => p.Key.Equals("group_name")).Value;
			var appType = query.LastOrDefault(p => p.Key.Equals("app_type")).Value;
			var state = query.LastOrDefault(p => p.Key.Equals("state")).Value;

			var htmlBody = "<html><body><H2>Registered Connector added</H2>";
			htmlBody += "<li><b>App Type:</b> " + appType + "</li>";
			htmlBody += "<li><b>Group Name:</b> " + group_name + "</li>";
			htmlBody += "<li><b>State:</b> " + state + "</li>";
			htmlBody += "<li><b>Web Hook URL stored:</b> " + webhook_url + "</li>";
			htmlBody += "</body></html>";

			var response = Request.CreateResponse(HttpStatusCode.OK);
			response.Content = new StringContent(htmlBody);
			response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
			return response;
		}
	}
}
