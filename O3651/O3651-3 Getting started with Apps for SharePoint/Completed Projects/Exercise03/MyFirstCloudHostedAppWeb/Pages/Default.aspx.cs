using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace MyFirstCloudHostedAppWeb
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            this.Message.Text = "My first SharePoint Provider-hosted Add-in!";

            var hostWeb = Page.Request["SPHostUrl"];
            this.HostWebLink.NavigateUrl = hostWeb;
            this.HostWebLink.Text = "Back to host web";
        }
    }
}