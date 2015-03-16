using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.UserProfiles;

namespace TaxonomyMenuInjectWeb
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
            RegisterChromeControlScript();

            var spContext = SharePointContextProvider.Current.GetSharePointContext(Context);

            using (var clientContext = spContext.CreateUserClientContextForSPHost())
            {
                var user = clientContext.Web.CurrentUser;
                clientContext.Load(user);
                clientContext.ExecuteQuery();

                var peopleManager = new PeopleManager(clientContext);
                var userProperties = peopleManager.GetUserProfilePropertyFor(user.LoginName, "SPS-MUILanguages");
                clientContext.ExecuteQuery();

                currentLanguages.Text = userProperties.Value;
            }
        }

        private void RegisterChromeControlScript()
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

            Page.ClientScript.RegisterClientScriptBlock(typeof(Default), "BasePageScript", script, true);
        }

        protected void AddTaxonomy_Click(object sender, EventArgs e)
        {
            //Fill out this method with code from step 2
        }

        protected void AddScripts_Click(object sender, EventArgs e)
        {
            //Fill out this method with code from step 3
        }

        protected void RemoveScripts_Click(object sender, EventArgs e)
        {
            //Fill out this method with the code from step 5
        }

    }
}