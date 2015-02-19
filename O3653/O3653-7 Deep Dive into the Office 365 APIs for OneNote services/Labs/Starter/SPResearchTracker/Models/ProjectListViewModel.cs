using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SPResearchTracker.Models
{
	public class ProjectListViewModel
	{
		public int PageIndex { get; set; }
		public int PageSize { get; set; }
		public List<Project> Projects { get; set; }
	}
}