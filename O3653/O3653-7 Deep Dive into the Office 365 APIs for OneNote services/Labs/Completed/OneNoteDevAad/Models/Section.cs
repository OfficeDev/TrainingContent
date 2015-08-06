using System;
using System.Collections.Generic;

namespace OneNoteDev.Models
{
  public class Section {
    public Section() {
      Pages = new List<NotePage>();
    }

    public string Id { get; set; }
    public string Name { get; set; }
    public DateTime CreatedDateTime { get; set; }
    public DateTime LastModifiedDateTime { get; set; }
    public string PagesUrl { get; set; }
    public List<NotePage> Pages { get; set; }
  }
}