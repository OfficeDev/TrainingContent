using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
  public class Comment
  {
    public string ActionPerformer { get; set; }
    public DateTime CommentDate { get; set; }
    public string CommentText { get; set; }
  }

  public class CardResponse
  {
    public string Comment { get; set; }
    public string CachedComents { get; set; }
  }
}