using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(VideoApiWeb.Startup))]

namespace VideoApiWeb {
  public partial class Startup {
    public void Configuration(IAppBuilder app)
    {
      ConfigureAuth(app);
    }
  }
}