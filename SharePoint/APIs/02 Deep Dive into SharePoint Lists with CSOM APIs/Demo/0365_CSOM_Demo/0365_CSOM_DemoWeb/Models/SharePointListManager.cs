using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.SharePoint.Client;

public class SharePointListManager {

  static public List<string> GetLists1(ClientContext clientContext) {

    Web site = clientContext.Web;
    clientContext.Load(site);
    clientContext.Load(site.Lists);
    clientContext.ExecuteQuery();

    List<string> lists = new List<string>();

    foreach (var list in site.Lists) {
      if ((list.Hidden != true) && (list.BaseType == 0) ) {
        lists.Add(list.Title);
      }
    }

    return lists;
  }

  static public Dictionary<string, string> GetLists2(ClientContext clientContext) {

    Web site = clientContext.Web;
    clientContext.Load(site, s => s.Url);
    clientContext.Load(site.Lists, allLists => allLists.Where(list => (!list.Hidden) && (list.BaseType == 0) )
                                                       .Include(list => list.Title, list => list.DefaultViewUrl));
    clientContext.ExecuteQuery();

    Dictionary<string, string> lists = new Dictionary<string, string>();
    string sharePointHost = "https://" + (new Uri(site.Url)).Authority;
    foreach (var list in site.Lists) {
      string defaultViewUrl = sharePointHost + list.DefaultViewUrl;
      lists.Add(defaultViewUrl, list.Title);
    }

    return lists;
  }

  static public void CreateAnnouncementsList(ClientContext clientContext) {

    string listTitle = "Announcements";

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
    listInformation.Url = "Lists/Announcements";
    listInformation.QuickLaunchOption = QuickLaunchOptions.On;
    listInformation.TemplateType = (int)ListTemplateType.Announcements;

    // Add ListCreationInformation to lists collection and return list object
    List list = clientContext.Web.Lists.Add(listInformation);

    // modify additional list properties and update
    list.OnQuickLaunch = true;
    list.EnableAttachments = false;
    list.Update();

    // send command to server to create list
    clientContext.ExecuteQuery();

    clientContext.Load(list);
    clientContext.ExecuteQuery();

    string urlEventReceiver = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority) +
                              @"/Services/AnnouncementsEventReceiver.svc";

    EventReceiverDefinitionCreationInformation erci1 = new EventReceiverDefinitionCreationInformation();
    erci1.ReceiverName = "ItemAdding";
    erci1.EventType = EventReceiverType.ItemAdding;
    erci1.ReceiverUrl = urlEventReceiver;
    erci1.SequenceNumber = 1000;
    EventReceiverDefinition er1 = list.EventReceivers.Add(erci1);
    er1.Update();

    EventReceiverDefinitionCreationInformation erci2 = new EventReceiverDefinitionCreationInformation();
    erci2.ReceiverName = "ItemUpdating";
    erci2.EventType = EventReceiverType.ItemUpdating;
    erci2.ReceiverUrl = urlEventReceiver;
    erci2.SequenceNumber = 1000;
    EventReceiverDefinition er2 = list.EventReceivers.Add(erci2);
    er2.Update();

    clientContext.ExecuteQuery();

    ListItemCreationInformation lici = new ListItemCreationInformation();

    var item1 = list.AddItem(lici);
    item1["Title"] = "SharePoint introduces new app model";
    item1["Body"] = "<div>Developers wonder what happened to solutions.</div>";
    item1["Expires"] = DateTime.Today.AddYears(10);
    item1.Update();

    var item2 = list.AddItem(lici);
    item2["Title"] = "All SharePoint developers must now learn JavaScript";
    item2["Body"] = "<div>Some developers are more excited than others.</div>";
    item2["Expires"] = DateTime.Today.AddYears(1);
    item2.Update();

    var item3 = list.AddItem(lici);
    item3["Title"] = "CSOM programming is super fun";
    item3["Body"] = "<div>Just ask my mom.</div>";
    item3["Expires"] = DateTime.Today.AddDays(7);
    item3.Update();

    clientContext.ExecuteQuery();



  }

}

