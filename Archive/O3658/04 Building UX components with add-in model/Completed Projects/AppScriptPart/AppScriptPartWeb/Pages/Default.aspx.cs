using System;
using System.IO;
using System.Web.UI;
using Microsoft.SharePoint.Client;
using File = Microsoft.SharePoint.Client.File;

namespace AppScriptPartWeb
{
    public partial class Default : Page
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
            // define initial script, needed to render the chrome control
            const string script = @"
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

            //register script in page
            Page.ClientScript.RegisterClientScriptBlock(typeof(Default), "BasePageScript", script, true);
        }


        protected void btnScenario_Click(object sender, EventArgs e)
        {
            var spContext = SharePointContextProvider.Current.GetSharePointContext(Context);
            using (var clientContext = spContext.CreateUserClientContextForSPHost())
            {
                //Grab the web part gallery folder for uploading
                var folder = clientContext.Web.Lists.GetByTitle("Web Part Gallery").RootFolder;
                clientContext.Load(folder);
                clientContext.ExecuteQuery();


                //open the "scenario2.webpart" file
                ListItem item;
                using (var fileReadingStream = System.IO.File.OpenRead(
                                Server.MapPath("~/scenario2.webpart")))
                {
                    using (var workingCopy = new MemoryStream())
                    {
                        //read the file into an in memory stream for editing
                        fileReadingStream.CopyTo(workingCopy);
                        LabHelper.SetJsLink(workingCopy, this.Request);
                        //Reset the stream position for use during the upload
                        workingCopy.Position = 0;
                        //Use the FileCreationInformation to upload the new file
                        FileCreationInformation fileInfo = new FileCreationInformation();
                        fileInfo.ContentStream = workingCopy;
                        fileInfo.Overwrite = true;
                        fileInfo.Url = "scenario2.webpart";
                        File file = folder.Files.Add(fileInfo);
                        //Get the list item associated with the newly uploaded file
                        item = file.ListItemAllFields;
                        clientContext.Load(file.ListItemAllFields);
                        clientContext.ExecuteQuery();
                    }
                }

                // Let's update the group for the uploaded web part
                var list = clientContext.Web.Lists.GetByTitle("Web Part Gallery");
                if (item == null)
                {
                    lblStatus.Text = "Oh dear something went wrong while uploading the webpart";
                    return;
                }
                list.GetItemById(item.Id);
                item["Group"] = "App Script Part";
                item.Update();
                clientContext.ExecuteQuery();

                lblStatus.Text = string.Format("App script part has been added to web part gallery. You can find 'User Profile Information' script part under 'App Script Part' group in the <a href='{0}'>host web</a>.", spContext.SPHostUrl);
            }
        }
    }
}