using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SPResearchTracker.Models
{
	public class ProjectDetailViewModel
	{
		public Project Project { get; set; }
		public List<Reference> References { get; set; }

	}
}