using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SPContactsList.Models {
  public class SpContact {
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string WorkPhone { get; set; }
  }
}