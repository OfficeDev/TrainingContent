using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.EventReceivers;

namespace RemoteEventsDemoWeb.Services {

  public class AnnouncementsEventReceiver : IRemoteEventService {

    // standard entry point for two-way events
    public SPRemoteEventResult ProcessEvent(SPRemoteEventProperties properties) {
      
      // create SPRemoteEventResult object to use as return value
      SPRemoteEventResult result = new SPRemoteEventResult();

      // inspect the event type of the current event
      if ( (properties.EventType == SPRemoteEventType.ItemAdding) ||
           (properties.EventType == SPRemoteEventType.ItemUpdating) ){
       
        // get user input to perform validation
        string title = properties.ItemEventProperties.AfterProperties["Title"].ToString();
        string body = properties.ItemEventProperties.AfterProperties["Body"].ToString();

        // perform simple validation on user input
        if (title.Contains("Google") || title.Contains("Apple") || title.Contains("NetScape")) {          
          // cancel action due to validation error
          result.Status = SPRemoteEventServiceStatus.CancelWithError;
          result.ErrorMessage = "Title cannot contain inflammatory terms such as 'Google', 'Apple' or 'NetScape'";
        }

        // Process user input before it's added to the content database
        if (title != title.ToUpper()) {
          result.ChangedItemProperties.Add("Title", title.ToUpper());          
        }      
      }

      return result; // always return SPRemoteEventResult back to SharePoint host
    }

    
    public void ProcessOneWayEvent(SPRemoteEventProperties properties) {
      // nothing to see here - please move along          
    }

  }
}


