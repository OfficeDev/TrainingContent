using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace O365Discovery.Models
{
	public class GetAuthorizedResult
	{
		public string code { get; set; }
		public string session_state { get; set; }
	}
}