using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Owin;
using Microsoft.Owin;

[assembly: OwinStartup(typeof(OneDriveWeb.Startup))]

namespace OneDriveWeb {
  public partial class Startup {
    public void Configuration(IAppBuilder app)
    {
      ConfigureAuth(app); 
      
    }
  }
}