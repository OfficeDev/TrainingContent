using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace WebApplication1.Models
{
	public class ConnectorSubmissionResult
	{
		public HttpStatusCode Status { get; set; }
		public string Message { get; set; }
	}
}