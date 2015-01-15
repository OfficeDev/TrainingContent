using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.EventReceivers;
using System.ServiceModel;
using System.ServiceModel.Channels;

namespace HostWebEventsWeb.Services
{
    public class AppEventReceiver : IRemoteEventService
    {
        private const string ReceiverName = "ItemAddedEvent";
        private const string ListName = "Remote Event Receiver Lab";

        /// <summary>
        /// Handles app events that occur after the app is installed or upgraded, or when app is being uninstalled.
        /// </summary>
        /// <param name="properties">Holds information about the app event.</param>
        /// <returns>Holds information returned from the app event.</returns>
        public SPRemoteEventResult ProcessEvent(SPRemoteEventProperties properties)
        {
            SPRemoteEventResult result = new SPRemoteEventResult();

            switch (properties.EventType)
            {
                case SPRemoteEventType.AppInstalled:
                    HandleAppInstalled(properties);
                    break;
                case SPRemoteEventType.ItemAdded:
                    HandleItemAdded(properties);
                    break;
            }

            return result;
        }

        private void HandleAppInstalled(SPRemoteEventProperties properties)
        {
            using (ClientContext ctx = TokenHelper.CreateAppEventClientContext(properties, false))
            {
                if (ctx != null)
                {
                    //Add a list to the host web
                    List eventReceiverList = LabHelper.AddList(ctx, ctx.Web, Microsoft.SharePoint.Client.ListTemplateType.GenericList, ListName);

                    //Remove existing event handlers
                    ctx.Load(eventReceiverList, x => x.EventReceivers);
                    ctx.ExecuteQuery();
                    foreach (var rer in eventReceiverList.EventReceivers)
                    {
                        if (rer.ReceiverName == ReceiverName)
                        {
                            System.Diagnostics.Trace.WriteLine("Found existing ItemAdded receiver at " + rer.ReceiverUrl);
                            try
                            {
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

                    //Get WCF URL where this message was handled
                    OperationContext op = OperationContext.Current;
                    Message msg = op.RequestContext.RequestMessage;
                    
                    //Create a new event receiver
                    EventReceiverDefinitionCreationInformation receiver = new EventReceiverDefinitionCreationInformation();
                    receiver.EventType = EventReceiverType.ItemAdded;
                    receiver.ReceiverUrl = msg.Headers.To.ToString();
                    receiver.ReceiverName = ReceiverName;
                    receiver.Synchronization = EventReceiverSynchronization.Synchronous;

                    //Add the new event receiver to a list in the host web
                    eventReceiverList.EventReceivers.Add(receiver);
                    ctx.ExecuteQuery();
                }
            }
        }

        private void HandleItemAdded(SPRemoteEventProperties properties)
        {
            using (ClientContext ctx = TokenHelper.CreateRemoteEventReceiverClientContext(properties))
            {
                if (ctx != null)
                {
                    try
                    {
                        List eventReceiverList = ctx.Web.Lists.GetById(properties.ItemEventProperties.ListId);
                        ListItem item = eventReceiverList.GetItemById(properties.ItemEventProperties.ListItemId);
                        ctx.Load(item);
                        ctx.ExecuteQuery();

                        item["Description"] += "\nUpdated by RER " + System.DateTime.Now.ToLongTimeString();
                        item.Update();
                        ctx.ExecuteQuery();
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Trace.WriteLine(ex.Message);
                    }
                }

            }

        }


        /// <summary>
        /// This method is a required placeholder, but is not used by app events.
        /// </summary>
        /// <param name="properties">Unused.</param>
        public void ProcessOneWayEvent(SPRemoteEventProperties properties)
        {
            throw new NotImplementedException();
        }



    }
}
