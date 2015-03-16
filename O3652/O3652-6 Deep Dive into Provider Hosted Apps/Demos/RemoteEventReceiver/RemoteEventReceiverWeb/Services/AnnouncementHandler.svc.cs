using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.EventReceivers;

namespace RemoteEventReceiverWeb.Services
{
    public class AnnouncementHandler : IRemoteEventService
    {
        /// <summary>
        /// Handles events that occur before an action occurs, such as when a user adds or deletes a list item.
        /// </summary>
        /// <param name="properties">Holds information about the remote event.</param>
        /// <returns>Holds information returned from the remote event.</returns>
        public SPRemoteEventResult ProcessEvent(SPRemoteEventProperties properties)
        {
            SPRemoteEventResult result = new SPRemoteEventResult();

            switch (properties.EventType)
            {
                case SPRemoteEventType.ItemAdding:
                    result.ChangedItemProperties.Add("Body",
                        properties.ItemEventProperties.AfterProperties["Body"] += "\n ** For internal use only ** \n");
                    break;

                case SPRemoteEventType.ItemDeleting:
                    result.ErrorMessage = "Items cannot be deleted from this list";
                    result.Status = SPRemoteEventServiceStatus.CancelWithError;
                    break;
            }


            return result;
        }

        /// <summary>
        /// Handles events that occur after an action occurs, such as after a user adds an item to a list or deletes an item from a list.
        /// </summary>
        /// <param name="properties">Holds information about the remote event.</param>
        public void ProcessOneWayEvent(SPRemoteEventProperties properties)
        {
            using (ClientContext ctx = TokenHelper.CreateRemoteEventReceiverClientContext(properties))
            {
                if (ctx != null)
                {
                    List list = ctx.Web.Lists.GetByTitle(properties.ItemEventProperties.ListTitle);
                    ctx.Load(list);
                    ListItem item = list.GetItemById(properties.ItemEventProperties.ListItemId);
                    ctx.Load(item);
                    ctx.ExecuteQuery();
                    item["Body"] += "\n Announcement Tracking ID: " + Guid.NewGuid().ToString() + " \n";
                    item.Update();
                    ctx.ExecuteQuery();
                }
            }
        }
    }
}
