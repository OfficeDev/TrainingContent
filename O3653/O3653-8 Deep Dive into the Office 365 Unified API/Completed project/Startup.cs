using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(UnifiedApiApp.Startup))]

namespace UnifiedApiApp {
  public partial class Startup {
    public void Configuration(IAppBuilder app)
    {
      ConfigureAuth(app);
    }
  }
}