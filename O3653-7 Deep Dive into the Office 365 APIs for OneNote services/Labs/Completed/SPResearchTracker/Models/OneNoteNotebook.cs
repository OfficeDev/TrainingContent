using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SPResearchTracker.Models
{
	public class OneNoteNotebook
	{
		public string name { get; set; }
		public bool isDefault { get; set; }
		public string userRole { get; set; }
		public bool isShared { get; set; }
		public string sectionsUrl { get; set; }
		public string sectionGroupsUrl { get; set; }
		public OneNoteNotebookLink links { get; set; }
		public string self { get; set; }
		public string id { get; set; }
		public string createdBy { get; set; }
		public DateTime createdTime { get; set; }
		public string lastModifiedBy { get; set; }
		public DateTime lastModifiedTime { get; set; }
	}

	public class OneNoteNotebookLink
	{
		public OneNoteNotebookLinkUrl oneNoteClientUrl { get; set; }
		public OneNoteNotebookLinkUrl oneNoteWebUrl { get; set; }
	}

	public class OneNoteNotebookLinkUrl
	{
		public string href { get; set; }
	}

	public class OneNoteNotebookCreationInformation
	{
		public string name { get; set; }
	}
}