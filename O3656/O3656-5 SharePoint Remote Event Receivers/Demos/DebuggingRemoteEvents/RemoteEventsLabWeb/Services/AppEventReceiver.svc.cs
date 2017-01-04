using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.EventReceivers;

namespace RemoteEventsLabWeb.Services {
  public class AppEventReceiver : IRemoteEventService {

    public SPRemoteEventResult ProcessEvent(SPRemoteEventProperties properties) {
     
      SPRemoteEventResult result = new SPRemoteEventResult();
      using (ClientContext clientContext = TokenHelper.CreateAppEventClientContext(properties, useAppWeb: false)) {
        if (clientContext != null) {
          clientContext.Load(clientContext.Web);
          string listTitle = "Customers";

          // delete list if it exists
          ExceptionHandlingScope scope = new ExceptionHandlingScope(clientContext);
          using (scope.StartScope()) {
            using (scope.StartTry()) {
              clientContext.Web.Lists.GetByTitle(listTitle).DeleteObject();
            }
            using (scope.StartCatch()) { }
          }

          // create and initialize ListCreationInformation object
          ListCreationInformation listInformation = new ListCreationInformation();
          listInformation.Title = listTitle;
          listInformation.Url = "Lists/Customers";
          listInformation.QuickLaunchOption = QuickLaunchOptions.On;
          listInformation.TemplateType = (int)ListTemplateType.Contacts;

          // Add ListCreationInformation to lists collection and return list object
          List list = clientContext.Web.Lists.Add(listInformation);

          // modify additional list properties and update
          list.OnQuickLaunch = true;
          list.EnableAttachments = false;
          list.Update();

          // send command to server to create list
          clientContext.ExecuteQuery();

          // create a sample item in the list
          var customer1 = list.AddItem(new ListItemCreationInformation());
          customer1["FirstName"] = "Mike";
          customer1["Title"] = "Fitzmaurice";
          customer1["Company"] = "Wingtip Toys";
          customer1["WorkPhone"] = "(111)111-1111";
          customer1["HomePhone"] = "(222)222-2222";
          customer1["Email"] = "mikefitz@wingtiptoys.com";
          customer1.Update();

          // send command to server to create item
          clientContext.ExecuteQuery();
        }
      }
      return result;
    }
    public void ProcessOneWayEvent(SPRemoteEventProperties properties) {
      throw new NotImplementedException();
    }

  }
}
