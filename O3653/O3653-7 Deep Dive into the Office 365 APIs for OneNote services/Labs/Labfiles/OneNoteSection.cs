using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SPResearchTracker.Models
{
	public class OneNoteSection
	{
		public bool isDefault { get; set; }
		public string pagesUrl { get; set; }
		public string self { get; set; }
		public string id { get; set; }
		public string name { get; set; }
		public string createdBy { get; set; }
		public DateTime createdTime { get; set; }
		public string lastModifiedBy { get; set; }
		public DateTime lastModifiedTime { get; set; }
	}

	public class OneNoteSectionCreationInformation
	{
		public string name { get; set; }
	}
}