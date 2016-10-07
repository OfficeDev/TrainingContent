﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CSOMWebFormsWeb
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_PreInit(object sender, EventArgs e)
        {
            Uri redirectUrl;
            switch (SharePointContextProvider.CheckRedirectionStatus(Context, out redirectUrl))
            {
                case RedirectionStatus.Ok:
                    return;
                case RedirectionStatus.ShouldRedirect:
                    Response.Redirect(redirectUrl.AbsoluteUri, endResponse: true);
                    break;
                case RedirectionStatus.CanNotRedirect:
                    Response.Write("An error occurred while processing your request.");
                    Response.End();
                    break;
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            var spContext = SharePointContextProvider.Current.GetSharePointContext(Context);

            //Host Web
            using (var hostContext = spContext.CreateUserClientContextForSPHost())
            {
                hostContext.Load(hostContext.Web, web => web.Title);
                hostContext.ExecuteQuery();
                hostWebTitle.Text = hostContext.Web.Title;
            }

            //App Web
            using (var appContext = spContext.CreateUserClientContextForSPAppWeb())
            {
                appContext.Load(appContext.Web, web => web.Title);
                appContext.ExecuteQuery();
                appWebTitle.Text = appContext.Web.Title;
            }

        }
    }
}