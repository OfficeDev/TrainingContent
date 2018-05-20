using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Owin;
using Microsoft.Owin;

[assembly: OwinStartup(typeof(SPContactsList.Startup))]

namespace SPContactsList {
  public partial class Startup {

    public void Configuration(IAppBuilder app)
    {
      ConfigureAuth(app);
    }

  }
}