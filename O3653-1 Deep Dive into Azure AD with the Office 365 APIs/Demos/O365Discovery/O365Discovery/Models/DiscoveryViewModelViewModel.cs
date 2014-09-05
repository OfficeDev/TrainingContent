using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace O365Discovery.Models
{
	public class DiscoveryViewModel
	{
		public int CurrentStep { get; set; }
		public string ApiEndpoint { get; set; }
		public string ApiResults { get; set; }

		public FirstSignInResult FirstSignInResult { get; set; }
		public GetAuthorizedResult GetAuthorizedResult { get; set; }

	}
}