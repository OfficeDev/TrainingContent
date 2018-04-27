using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication1.Models
{
	public class HomePage
	{
		[Required]
		public Controllers.HomeController.CardTypes? CardType { get; set; }
		public string Message { get; set; }
		public string MessageClass { get; set; }

		public IEnumerable<SelectListItem> CardTypes { get; set; }
	}
}