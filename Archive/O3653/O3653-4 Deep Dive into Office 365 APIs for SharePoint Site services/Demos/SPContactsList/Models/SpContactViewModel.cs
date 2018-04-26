using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SPContactsList.Models {
  public class SpContactViewModel {
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
    public List<SpContact> SpContacts { get; set; }
  }
}