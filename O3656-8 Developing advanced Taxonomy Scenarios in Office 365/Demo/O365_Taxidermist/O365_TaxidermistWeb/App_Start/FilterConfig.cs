using System.Web;
using System.Web.Mvc;

namespace O365_TaxidermistWeb {
  public class FilterConfig {
    public static void RegisterGlobalFilters(GlobalFilterCollection filters) {
      filters.Add(new HandleErrorAttribute());
    }
  }
}
