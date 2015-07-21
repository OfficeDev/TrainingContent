using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;
using Microsoft.SharePoint.Client.Taxonomy;

namespace TasksWeb.Models {
  public class SpTermViewModel
  {
    public Guid ParentTermId;
    public string ParentTermLabel;

    public string NewTermLabel;

    public List<SpTerm> Terms;
  }
}