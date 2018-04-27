using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace HostWebEventsWeb
{
    public partial class Default : System.Web.UI.Page
    {
        private const string ReceiverName = "ItemAddedEvent";
        private const string ListName = "Remote Event Receiver Lab";

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
            string script = @"
            function chromeLoaded() {
                $('body').show();
            }

            //function callback to render chrome after SP.UI.Controls.js loads
            function renderSPChrome() {
                //Set the chrome options for launching Help, Account, and Contact pages
                var options = {
                    'appTitle': document.title,
                    'onCssLoaded': 'chromeLoaded()'
                };

                //Load the Chrome Control in the divSPChrome element of the page
                var chromeNavigation = new SP.UI.Controls.Navigation('divSPChrome', options);
                chromeNavigation.setVisible(true);
            }";

            //register script in page which shows the content when chrome is loaded
            Page.ClientScript.RegisterClientScriptBlock(typeof(Default), "BasePageScript", script, true);

        }

        protected void btnDetachEventHandler_Click(object sender, EventArgs e)
        {
            var spContext = SharePointContextProvider.Current.GetSharePointContext(Context);

            using (var ctx = spContext.CreateUserClientContextForSPHost())
            {
                List myList = ctx.Web.Lists.GetByTitle(ListName);
                ctx.Load(myList, p => p.EventReceivers);
                ctx.ExecuteQuery();

                var rer = myList.EventReceivers.Where(x => x.ReceiverName == ReceiverName).FirstOrDefault();

                try
                {
                    System.Diagnostics.Trace.WriteLine("Removing ItemAdded receiver at " + rer.ReceiverUrl);
                    //This will fail when deploying via F5, but works when deployed to production
                    rer.DeleteObject();
                    ctx.ExecuteQuery();
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Trace.WriteLine(ex.Message);
                }
            }
        }
    }
}