using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using SystemIO = System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint.Client;
using System.Collections.Specialized;

namespace AddWingtipProductsList {
  class Program {

    static string siteUrl = ConfigurationManager.AppSettings["targetSiteUrl"];
    static ClientContext clientContext;
    static Web site;
    static NavigationNodeCollection TopNavNodes;

    static void Main() {

      Console.WriteLine("Adding Team Site Content");
      Console.WriteLine();

      clientContext = new ClientContext(siteUrl);

      site = clientContext.Web;
      clientContext.Load(site);      
      clientContext.ExecuteQuery();


      WingtipContentGenerator.CreateProductCategoriesTermset();
      WingtipContentGenerator.CreateProductsLists();

      Console.WriteLine();
      Console.WriteLine("The program has finsihed. Press ENTER to close this window");
      Console.WriteLine();
      Console.ReadLine();






      clientContext.ExecuteQuery();

    }

    static void UpdateWikiHomePage(string PageContent) {
      List SitePages = site.Lists.GetByTitle("Site Pages");
      clientContext.Load(SitePages);
      clientContext.ExecuteQuery();
      File WikiHomePage = SitePages.RootFolder.Files.GetByUrl("Home.aspx");
      WikiHomePage.ListItemAllFields["WikiField"] = PageContent;
      WikiHomePage.ListItemAllFields.Update();
      clientContext.ExecuteQuery();

    }

    static ListItem CreateWikiPage(List WikiPageLibrary, string FileName, string PageTitle, string PageContent) {

      clientContext.Load(WikiPageLibrary.RootFolder, f => f.ServerRelativeUrl);
      clientContext.ExecuteQuery();

      var WikiPageLibraryUrl = WikiPageLibrary.RootFolder.ServerRelativeUrl;
      var newWikiPageUrl = WikiPageLibraryUrl + "/" + FileName;

      var currentPageFile = site.GetFileByServerRelativeUrl(newWikiPageUrl);

      clientContext.Load(currentPageFile, f => f.Exists);
      clientContext.ExecuteQuery();

      if (currentPageFile.Exists) {
        currentPageFile.DeleteObject();
        clientContext.ExecuteQuery();
      }

      File newWikiPageFile = WikiPageLibrary.RootFolder.Files.AddTemplateFile(newWikiPageUrl, TemplateFileType.WikiPage);
      ListItem newWikiPageItem = newWikiPageFile.ListItemAllFields;
      newWikiPageItem["Title"] = PageTitle;
      newWikiPageItem["WikiField"] = PageContent;
      newWikiPageItem.Update();
      clientContext.ExecuteQuery();

      return newWikiPageItem;
    }

    static NavigationNode CreateTopNavNode(string NodeTitle, string NodeUrl, bool ExternalNode) {
      NavigationNodeCreationInformation newNode = new NavigationNodeCreationInformation();
      newNode.IsExternal = ExternalNode;
      newNode.Title = NodeTitle;
      newNode.Url = NodeUrl;
      newNode.AsLastNode = true;
      return TopNavNodes.Add(newNode);
    }

    static NavigationNode CreateTopNavNode(string NodeTitle, string NodeUrl) {
      return CreateTopNavNode(NodeTitle, NodeUrl, false);
    }

    static void DeleteAllTopNavNodes() {
      // delete all existing nodes
      for (int index = (TopNavNodes.Count - 1); index >= 0; index--) {
        ExceptionHandlingScope scope = new ExceptionHandlingScope(clientContext);
        using (scope.StartScope()) {
          using (scope.StartTry()) {
            TopNavNodes[index].DeleteObject();
          }
          using (scope.StartCatch()) {
          }
        }
        clientContext.ExecuteQuery();
      }
      clientContext.Load(TopNavNodes);
      clientContext.ExecuteQuery();
    }
  }
}
