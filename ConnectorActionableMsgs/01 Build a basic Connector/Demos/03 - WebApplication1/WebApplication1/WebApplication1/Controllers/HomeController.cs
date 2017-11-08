using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Mvc;

namespace WebApplication1.Controllers
{
	public class HomeController : Controller
	{
		public enum CardTypes { ConnectorReferenceExample, TwitterHeroImage }

		public async Task<ActionResult> Index()
		{
			var cardTypes = GetCardTypes();
			var model = new Models.HomePage
			{
				CardTypes = cardTypes
			};
			return View(model);
		}

		[HttpPost]
		public async Task<ActionResult> Index(Models.HomePage model)
		{
			var cardTypes = GetCardTypes();
			model.CardTypes = cardTypes;

			if (ModelState.IsValid)
			{
				var result = await SubmitCard(model.CardType.Value);
				model.Message = result.Message;
				model.MessageClass = (result.Status == System.Net.HttpStatusCode.OK) ? "text-success" : "text-danger";
			}
			else
			{
				string validationErrors = string.Join(",",
										ModelState.Values.Where(E => E.Errors.Count > 0)
										.SelectMany(E => E.Errors)
										.Select(E => E.ErrorMessage)
										.ToArray());
				model.Message = validationErrors;
				model.MessageClass = "text-danger";
			}

			return View(model);
		}

		private async Task<Models.ConnectorSubmissionResult> SubmitCard(CardTypes cardType)
		{
			// replace this when third-party connector flow is ready
			string webhookUrl = WebConfigurationManager.AppSettings["WebhookUrl"];  

			// Create the Connector Card payload
			var card = Models.CardFactory.GetCard(cardType);
			var requestBody = JsonConvert.SerializeObject(
				card, null, 
				new JsonSerializerSettings
				{
					ContractResolver = new CamelCasePropertyNamesContractResolver(),
					NullValueHandling = NullValueHandling.Ignore
				});

			// Make POST to webhook URL
			return await Utils.HttpHelper.PostJsonMessage(webhookUrl, requestBody);
		}

		private IEnumerable<SelectListItem> GetCardTypes()
		{
			IEnumerable<CardTypes> values = Enum.GetValues(typeof(CardTypes)).Cast<CardTypes>();
			IEnumerable<SelectListItem> items =
				from value in values
				select new SelectListItem
				{
					Text = Regex.Replace(value.ToString(), "((?<=[a-z])(?=[A-Z]))|((?<=[A-Z])(?=[A-Z][a-z]))", " "),
					Value = value.ToString(),
				};
			return items;
		}

		public ActionResult About()
		{
			ViewBag.Message = "Your application description page.";

			return View();
		}

		public ActionResult Contact()
		{
			ViewBag.Message = "Your contact page.";

			return View();
		}
	}
}