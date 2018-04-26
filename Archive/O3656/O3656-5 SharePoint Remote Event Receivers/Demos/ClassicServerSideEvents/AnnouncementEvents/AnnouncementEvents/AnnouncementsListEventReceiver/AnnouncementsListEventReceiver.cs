using System;
using System.Security.Permissions;
using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using Microsoft.SharePoint.Workflow;

namespace AnnouncementEvents.AnnouncementsListEventReceiver {

  public class AnnouncementsListEventReceiver : SPItemEventReceiver {

    public override void ItemAdding(SPItemEventProperties properties) {

      // examine user input
      string title = properties.AfterProperties["Title"].ToString();

      // validate user input
      if (title.ToLower().Contains("lobster") || title.ToLower().Contains("clam")) {
        // cancel user action if inout is invalid
        properties.Status = SPEventReceiverStatus.CancelWithError;
        properties.ErrorMessage = "Do not use inflamitory terms such as 'lobster' or'clam'.";
      }
    }

    public override void ItemUpdating(SPItemEventProperties properties) {
      string title = properties.AfterProperties["Title"].ToString();
      if (title.ToLower().Contains("lobster") || title.ToLower().Contains("clam")) {
        properties.Status = SPEventReceiverStatus.CancelWithError;
        properties.ErrorMessage = "Do not use inflamitory terms such as 'lobster' or'clam'.";
      }
    }

    public override void ItemAdded(SPItemEventProperties properties) {

      // retrieve user inolut from content database
      string title = properties.ListItem["Title"].ToString();
      
      // convert the title to upper case if required
      if (!title.ToUpper().Equals(title)) {
        this.EventFiringEnabled = true;
        properties.ListItem["Title"] = title.ToUpper();
        properties.ListItem.UpdateOverwriteVersion();
        this.EventFiringEnabled = false;
      }
    }


    public override void ItemUpdated(SPItemEventProperties properties) {
      string title = properties.ListItem["Title"].ToString();
      if (!title.ToUpper().Equals(title)) {
        this.EventFiringEnabled = true;
        properties.ListItem["Title"] = title.ToUpper();
        properties.ListItem.UpdateOverwriteVersion();
        this.EventFiringEnabled = false;
      }
    }

  }
}