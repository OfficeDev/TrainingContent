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
	public class Project
	{
		public string ProjectsListName = ConfigurationManager.AppSettings["ProjectsListName"];

		public Project()
		{ }

		public Project(int Id, string Title):this(Id, Title, String.Empty)
		{	}

		public Project(int Id, string Title, string eTag)
		{
			this.Id = Id;
			this.Title = Title;
			__eTag = eTag;
		}


		public int Id { get; set; }

		public string __eTag { get; set; }

		[Required]
		public string Title { get; set; }

		public XElement ToXElement(string cachedCategory)
		{
			return new XElement(ExtensionMethods.atom + "entry",
							new XAttribute(XNamespace.Xmlns + "d", ExtensionMethods.d),
							new XAttribute(XNamespace.Xmlns + "m", ExtensionMethods.m),
							new XElement(ExtensionMethods.atom + "category", new XAttribute("term", cachedCategory), new XAttribute("scheme", "http://schemas.microsoft.com/ado/2007/08/dataservices/scheme")),
							new XElement(ExtensionMethods.atom + "content", new XAttribute("type", "application/xml"),
									new XElement(ExtensionMethods.m + "properties",
											new XElement(ExtensionMethods.d + "Title", this.Title))));
		}
	}
}