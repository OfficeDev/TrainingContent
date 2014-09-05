using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace O365Discovery.Models
{
	public class FirstSignInResult
	{
		public string user_email { get; set; }
		public string token_service { get; set; }
		public string discovery_service { get; set; }
		public string discovery_resource { get; set; }
		public string authorization_service { get; set; }
		public int account_type { get; set; }

	}
}