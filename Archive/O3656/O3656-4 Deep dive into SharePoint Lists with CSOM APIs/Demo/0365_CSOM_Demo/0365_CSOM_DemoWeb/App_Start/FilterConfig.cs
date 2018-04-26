using System.Web;
using System.Web.Mvc;

namespace _0365_CSOM_DemoWeb {
  public class FilterConfig {
    public static void RegisterGlobalFilters(GlobalFilterCollection filters) {
      filters.Add(new HandleErrorAttribute());
    }
  }
}
