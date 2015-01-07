using System;
using System.Reflection;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Microsoft.SharePoint.Client;

namespace ServerSideCSOMWeb.Pages {
  public partial class Default : System.Web.UI.Page {

    Uri hostWeb;

    private void WriteContentToPage(string content) {
      PlaceHolderMain.Controls.Add(new LiteralControl(content));
    }

    private void WriteDivToPage(string content) {
      PlaceHolderMain.Controls.Add(new LiteralControl("<div>" + content + "</div>"));
    }
    protected void Page_Load(object sender, EventArgs e) {
      hostWeb = new Uri(Request.QueryString["SPHostUrl"]);
      linkHostWeb.NavigateUrl = hostWeb.ToString();
    }

    protected void cmdHelloCSOM_Click(object sender, EventArgs e) {

      using (var clientContext =
                 TokenHelper.GetS2SClientContextWithWindowsIdentity(hostWeb, Request.LogonUserIdentity)) {

        Web site = clientContext.Web;
        clientContext.Load(site);

        Site sc = clientContext.Site;
        clientContext.Load(sc);
        clientContext.Load(sc.Owner);

        clientContext.ExecuteQuery();

        var table = new HtmlTableWriter();
        table.AddRow("Site ID", site.Id.ToString().ToLower());
        table.AddRow("Site URL", site.Url);
        table.AddRow("Site Language", site.Language.ToString());
        table.AddRow("Master Page URL", site.MasterUrl);
        table.AddRow("Server Relative Url", site.ServerRelativeUrl);
        table.AddRow("Site Collection Owner", sc.Owner.LoginName);

        WriteContentToPage("<h2>Host Web Properties</h2>");
        WriteContentToPage(table.ToString());
      }


    }

    protected void cmdGetLists_Click(object sender, EventArgs e) {

      using (var clientContext = TokenHelper.GetS2SClientContextWithWindowsIdentity(hostWeb, Request.LogonUserIdentity)) {

        Web site = clientContext.Web;
        clientContext.Load(site);
        clientContext.Load(site.Lists);

        clientContext.ExecuteQuery();

        string html = "<h2>List in host web</h2>";

        html += "<ul>";

        foreach (var list in site.Lists) {
          //if (list.Hidden != true) {
          html += "<li>" + list.Title + "</li>";
          //}
        }

        html += "</ul>";

        WriteContentToPage(html);
      }
    }

    protected void cmdGetLists2_Click(object sender, EventArgs e) {


      using (var clientContext = TokenHelper.GetS2SClientContextWithWindowsIdentity(hostWeb, Request.LogonUserIdentity)) {

        Web site = clientContext.Web;
        clientContext.Load(site);

        ListCollection Lists = clientContext.Web.Lists;
        clientContext.Load(Lists, lists => lists.Where(list => !list.Hidden)
                                                .Include(list => list.Title,
                                                         list => list.DefaultViewUrl));

        clientContext.ExecuteQuery();


        var table = new HtmlTableWriter();

        foreach (var list in Lists) {
          string defaultViewUrl = site.Url + list.DefaultViewUrl;
          string link = "<a target='_blank' href='" + defaultViewUrl + "' >" + defaultViewUrl + "</a>";
          table.AddRow(list.Title, link);
        }

        WriteContentToPage("<h2>Lists in Host Web (optimized query)</h2>");
        WriteContentToPage(table.ToString());
      }
    }

    protected void cmdCreateLists_Click(object sender, EventArgs e) {
      using (var clientContext = TokenHelper.GetS2SClientContextWithWindowsIdentity(hostWeb, Request.LogonUserIdentity)) {


        Web site = clientContext.Web;
        clientContext.Load(site);

        string listTitle = "Announcements";

        // delete list if it exists
        ExceptionHandlingScope scope = new ExceptionHandlingScope(clientContext);
        using (scope.StartScope()) {
          using (scope.StartTry()) {
            site.Lists.GetByTitle(listTitle).DeleteObject();
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
        List list = site.Lists.Add(listInformation);
        
        // modify additional list properties and update
        list.OnQuickLaunch = true;
        list.EnableAttachments = false;
        list.Update();
        
        // send command to server to create list
        clientContext.ExecuteQuery();


        WriteDivToPage("List created: " + list.Title);

        clientContext.Load(list);
        clientContext.ExecuteQuery();

        string urlEventReceiver = Request.Url.GetLeftPart(UriPartial.Authority) +
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
        WriteDivToPage("Event receiver added at " + urlEventReceiver);

        ListItemCreationInformation lici = new ListItemCreationInformation();

        var item1 = list.AddItem(lici);
        item1["Title"] = "SharePoint introduces new app model";
        item1["Body"] = "<div>Developers wonder what happened to solutions.</div>";
        item1["Expires"] = DateTime.Today.AddYears(10);
        item1.Update();

        var item2 = list.AddItem(lici);
        item2["Title"] = "All SharePoint developers must now learn JavaScript";
        item2["Body"] = "<div>Some developers are more excited then others.</div>";
        item2["Expires"] = DateTime.Today.AddYears(1);
        item2.Update();

        var item3 = list.AddItem(lici);
        item3["Title"] = "CSOM programming is super fun";
        item3["Body"] = "<div>Just ask my mom.</div>";
        item3["Expires"] = DateTime.Today.AddDays(7);
        item3.Update();

        clientContext.ExecuteQuery();

        WriteDivToPage("List Item created: " + item1["Title"]);


      }
    }


    static void DeleteList(string listTitle) {

    }




  }
}