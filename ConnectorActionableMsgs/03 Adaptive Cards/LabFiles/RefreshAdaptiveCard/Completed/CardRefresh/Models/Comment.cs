using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CardRefresh.Models
{
	public class Comment
	{
		public string ActionPerformer { get; set; }
		public DateTime CommentDate { get; set; }
		public string CommentText { get; set; }
	}
}