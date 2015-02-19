using SPResearchTracker.Controllers;
using SPResearchTracker.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Helpers;
using System.Xml.Linq;

namespace SPResearchTracker.Utils
{
    public static class ExtensionMethods
    {
        public static XNamespace atom = "http://www.w3.org/2005/Atom";
        public static XNamespace d = "http://schemas.microsoft.com/ado/2007/08/dataservices";
        public static XNamespace m = "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata";

         public static Project ToProject(this XElement root)
        {
            string etag = root.Attribute(m + "etag").Value;
            string sptype = root.Elements().Where(e => e.Name.LocalName == "category").First().Attribute("term").Value;
            XElement properties = root.Descendants(m + "properties").First();
            int id = int.Parse(properties.Descendants(d + "ID").First().Value);
            string title = properties.Descendants(d + "Title").First().Value;
            return new Project(id, title, etag);
        }

				 public static Reference ToReference(this XElement root)
				 {
					 string etag = root.Attribute(m + "etag").Value;
					 string sptype = root.Elements().Where(e => e.Name.LocalName == "category").First().Attribute("term").Value;
					 XElement properties = root.Descendants(m + "properties").First();
					 int id = int.Parse(properties.Descendants(d + "ID").First().Value);
					 string notes = properties.Descendants(d + "Comments").First().Value;
					 string project = properties.Descendants(d + "Project").First().Value;
					 XElement URL = properties.Descendants(d + "URL").First();
					 string url = URL.Descendants(d + "Url").First().Value;
					 string title = URL.Descendants(d + "Description").First().Value;
					 return new Reference(id, etag, title, url, notes, project);
				 }

				//public static void ValidateAntiForgery(this HttpRequestMessage request)
				//{
				//		string cookieToken = string.Empty;
				//		string formToken = string.Empty;

				//		IEnumerable<string> tokenHeaders;
				//		if (request.Headers.TryGetValues("RequestVerificationToken", out tokenHeaders))
				//		{
				//				string[] tokens = tokenHeaders.First().Split(':');
				//				if (tokens.Length == 2)
				//				{
				//						cookieToken = tokens[0].Trim();
				//						formToken = tokens[1].Trim();
				//						OAuthController.SaveInCache("cookieToken", cookieToken);
				//						OAuthController.SaveInCache("formToken", formToken);
				//				}
				//		}
				//		else
				//		{
				//				cookieToken = OAuthController.GetFromCache("cookieToken").ToString();
				//				formToken = OAuthController.GetFromCache("formToken").ToString();
				//		}

				//		AntiForgery.Validate(cookieToken, formToken);

				//}
    }
}