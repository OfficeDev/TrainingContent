using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Owin;
using Microsoft.Owin;

[assembly: OwinStartup(typeof(OutlookServicesClientDemo.Startup))]

namespace OutlookServicesClientDemo {
  public partial class Startup {

    public void Configuration(IAppBuilder app) {
      ConfigureAuth(app);
    }

  }
}