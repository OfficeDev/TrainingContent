using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace WebApplication1.Controllers
{
	public class HomeController : Controller
	{
		public enum CardTypes { Connector, TwitterHeroImage }

		public ActionResult Index()
		{
			var cardTypes = GetCardTypes();
			var model = new Models.HomePage
			{
				CardTypes = cardTypes
			};
			return View(model);
		}

		[HttpPost]
		public ActionResult Index(Models.HomePage model)
		{
			var cardTypes = GetCardTypes();
			model.CardTypes = cardTypes;

			if (ModelState.IsValid)
			{
				var result = SubmitCard(model.CardType.Value);
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

		private Models.ConnectorSubmissionResult SubmitCard(CardTypes cardType)
		{
			return new Models.ConnectorSubmissionResult
			{
				Status = System.Net.HttpStatusCode.OK,
				Message = "Processing message here"
			};
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