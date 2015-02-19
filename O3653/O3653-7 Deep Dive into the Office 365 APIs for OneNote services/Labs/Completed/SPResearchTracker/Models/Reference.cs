using SPResearchTracker.Utils;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace SPResearchTracker.Models
{
	public class Reference
	{
		public string ReferencesListName = ConfigurationManager.AppSettings["ReferencesListName"];

		public Reference() { }

		public Reference(int Id, string eTag, string Title, string Url, string Notes, string Project)
		{
			this.Id = Id;
			this.Title = Title;
			this.Url = Url;
			this.Notes = Notes;
			this.Project = Project;
			__eTag = eTag;
		}

		public int Id { get; set; }
		public string __eTag { get; set; }
		public string Title { get; set; }
		[Required]
		[Url]
		public string Url { get; set; }
		public string Notes { get; set; }
		public string Project { get; set; }

		public XElement ToXElement(string cachedCategory)
		{
			return new XElement(ExtensionMethods.atom + "entry",
							new XAttribute(XNamespace.Xmlns + "d", ExtensionMethods.d),
							new XAttribute(XNamespace.Xmlns + "m", ExtensionMethods.m),
							new XElement(ExtensionMethods.atom + "category", new XAttribute("term", cachedCategory), new XAttribute("scheme", "http://schemas.microsoft.com/ado/2007/08/dataservices/scheme")),
							new XElement(ExtensionMethods.atom + "content", new XAttribute("type", "application/xml"),
									new XElement(ExtensionMethods.m + "properties",
											new XElement(ExtensionMethods.d + "URL", new XAttribute(ExtensionMethods.m + "type", "SP.FieldUrlValue"),
													new XElement(ExtensionMethods.d + "Description", this.Title),
													new XElement(ExtensionMethods.d + "Url", this.Url)),
											new XElement(ExtensionMethods.d + "Comments", this.Notes),
											new XElement(ExtensionMethods.d + "Project", this.Project))));
		}
	}
}