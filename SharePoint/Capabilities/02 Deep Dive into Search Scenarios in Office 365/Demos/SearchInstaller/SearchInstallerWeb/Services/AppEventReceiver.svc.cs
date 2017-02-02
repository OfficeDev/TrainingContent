using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.EventReceivers;
using System.Web.Hosting;
using Microsoft.SharePoint.Client.WebParts;
using System.ServiceModel.Activation;

namespace SearchInstallerWeb.Services
{
    /* In order to debug this solution, you must create an Azure Service Bus
     * New-AzureSBNamespace <namespace> "East US" -CreateACSNamespace $true -NamespaceType Messaging
     * Copy the ConnectionString for the service bus into the SharePoint project properties
     */

    [AspNetCompatibilityRequirements(RequirementsMode=AspNetCompatibilityRequirementsMode.Allowed)]
    public class AppEventReceiver : IRemoteEventService
    {
        const string PUBLISHING_INFRASTRUCTURE_FEATURE_ID = "{F6924D36-2FA8-4f0b-B16D-06B7250180FA}";
        const string SEARCH_CENTER_TITLE = "Installer Search Center";
        const string SEARCH_CENTER_URL = "installersearch";
        const string SEARCH_PAGE_URL = "/installersearch/Pages/results.aspx";
        const string SEARCH_CENTER_TEMPLATE = "SRCHCEN#0";
        const string DISPLAY_TEMPLATE_PATH = "~/DisplayTemplates/Installer_Default.html.txt";
        const string DISPLAY_TEMPLATE_NAME = "Installer_Default.html";
        const string DISPLAY_TEMPLATE_FOLDER_URL = "/_catalogs/masterpage/Display Templates/Search";
        const string MASTER_PAGE_GALLERY_TITLE = "Master Page Gallery";
        const string RESULTS_WEB_PART_TITLE = "Search Results";
        const string NAVIGATION_WEB_PART_TITLE = "Search Navigation";
        const string TITLE_PROPERTY = "Title";
        const string DATA_PROVIDER_PROPERTY = "DataProviderJSON";
        public SPRemoteEventResult ProcessEvent(SPRemoteEventProperties properties)
        {
            SPRemoteEventResult result = new SPRemoteEventResult();

            try
            {
                using (ClientContext clientContext =
                    TokenHelper.CreateAppEventClientContext(properties, useAppWeb: false))
                {
                    if (clientContext != null)
                    {
                        /*INSTALLED*/
                        if (properties.EventType == SPRemoteEventType.AppInstalled)
                        {
                            //Enable Publishing Feature
                            Guid id = new Guid(PUBLISHING_INFRASTRUCTURE_FEATURE_ID);
                            var query1 = from f in clientContext.Site.Features
                                         where f.DefinitionId == id
                                         select f;
                            var features = clientContext.LoadQuery(query1);
                            clientContext.ExecuteQuery();

                            if (features.Count() == 0)
                            {
                                clientContext.Site.Features.Add(id, false, FeatureDefinitionScope.None);
                                clientContext.ExecuteQuery();
                            }

                            //Create Search Center
                            var query2 = from w in clientContext.Site.RootWeb.Webs
                                         where w.Title == SEARCH_CENTER_TITLE
                                         select w;
                            var webs = clientContext.LoadQuery(query2);
                            clientContext.ExecuteQuery();

                            if (webs.Count() == 0)
                            {
                                WebCreationInformation webCreationInfo = new WebCreationInformation();
                                webCreationInfo.Url = SEARCH_CENTER_URL;
                                webCreationInfo.Title = SEARCH_CENTER_TITLE;
                                webCreationInfo.UseSamePermissionsAsParentSite = true;
                                webCreationInfo.WebTemplate = SEARCH_CENTER_TEMPLATE;
                                Web newWeb = clientContext.Web.Webs.Add(webCreationInfo);
                                clientContext.ExecuteQuery();
                            }

                            //Upload Display template
                            List gallery = clientContext.Site.RootWeb.Lists.GetByTitle(MASTER_PAGE_GALLERY_TITLE);
                            Folder folder = clientContext.Site.RootWeb.GetFolderByServerRelativeUrl(DISPLAY_TEMPLATE_FOLDER_URL);
                            clientContext.ExecuteQuery();

                            var query3 = from f in folder.Files
                                         where f.Name == DISPLAY_TEMPLATE_NAME
                                         select f;
                            var files = clientContext.LoadQuery(query3);
                            clientContext.ExecuteQuery();

                            if (files.Count() == 0)
                            {
                                System.IO.FileStream fs = System.IO.File.Open(
                                    HostingEnvironment.MapPath(DISPLAY_TEMPLATE_PATH),
                                    System.IO.FileMode.Open, System.IO.FileAccess.Read);

                                FileCreationInformation fileCreationInfo = new FileCreationInformation();
                                fileCreationInfo.ContentStream = fs;
                                fileCreationInfo.Url = DISPLAY_TEMPLATE_NAME;
                                fileCreationInfo.Overwrite = true;
                                Microsoft.SharePoint.Client.File newFile = folder.Files.Add(fileCreationInfo);
                                clientContext.Load(newFile);
                                clientContext.ExecuteQuery();
                            }

                            //Set web part properties
                            webs = clientContext.LoadQuery(query2);
                            clientContext.ExecuteQuery();

                            File resultsPage = webs.First().GetFileByServerRelativeUrl(SEARCH_PAGE_URL);
                            resultsPage.CheckOut();
                            clientContext.ExecuteQuery();

                            LimitedWebPartManager manager = resultsPage.GetLimitedWebPartManager(PersonalizationScope.Shared);
                            var webPartDefs = manager.WebParts;
                            clientContext.Load(webPartDefs, parts => parts.Include(part => part.WebPart.Properties), parts => parts.Include(part => part.WebPart.Title));
                            clientContext.ExecuteQuery();

                            foreach (var webPartDef in webPartDefs)
                            {
                                if (webPartDef.WebPart.Title == RESULTS_WEB_PART_TITLE)
                                {
                                    webPartDef.WebPart.Properties[DATA_PROVIDER_PROPERTY] = "{\"QueryGroupName\":\"Default\",\"QueryPropertiesTemplateUrl\":\"sitesearch://webroot\",\"IgnoreQueryPropertiesTemplateUrl\":false,\"SourceID\":\"33b36a58-671f-4805-8db1-0078509b88c9\",\"SourceName\":\"InstallerResultSource\",\"SourceLevel\":\"SPSite\",\"CollapseSpecification\":\"\",\"QueryTemplate\":\"{searchboxquery}\",\"FallbackSort\":null,\"FallbackSortJson\":\"null\",\"RankRules\":null,\"RankRulesJson\":\"null\",\"AsynchronousResultRetrieval\":false,\"SendContentBeforeQuery\":true,\"BatchClientQuery\":true,\"FallbackLanguage\":-1,\"FallbackRankingModelID\":\"\",\"EnableStemming\":true,\"EnablePhonetic\":false,\"EnableNicknames\":false,\"EnableInterleaving\":true,\"EnableQueryRules\":true,\"EnableOrderingHitHighlightedProperty\":false,\"HitHighlightedMultivaluePropertyLimit\":-1,\"IgnoreContextualScope\":false,\"ScopeResultsToCurrentSite\":false,\"TrimDuplicates\":true,\"Properties\":{},\"PropertiesJson\":\"{}\",\"ClientType\":\"AllResultsQuery\",\"UpdateAjaxNavigate\":true,\"SummaryLength\":180,\"DesiredSnippetLength\":90,\"PersonalizedQuery\":false,\"FallbackRefinementFilters\":null,\"IgnoreStaleServerQuery\":true,\"RenderTemplateId\":\"\",\"AlternateErrorMessage\":null,\"Title\":\"\"}";
                                    webPartDef.SaveWebPartChanges();
                                    clientContext.ExecuteQuery();
                                }
                                if (webPartDef.WebPart.Title == NAVIGATION_WEB_PART_TITLE)
                                {
                                    webPartDef.DeleteWebPart();
                                    clientContext.ExecuteQuery();
                                }
                            }

                            resultsPage.CheckIn("Modified by Search Installer.", CheckinType.MajorCheckIn);
                            resultsPage.Publish("Modified by Search Installer.");
                            clientContext.ExecuteQuery();


                        }

                        /*UNINSTALLING*/
                        if (properties.EventType == SPRemoteEventType.AppUninstalling)
                        {
                            //Find Search Center
                            var web = clientContext.Site.RootWeb;
                            var query = from w in clientContext.Site.RootWeb.Webs
                                        where w.Url == SEARCH_CENTER_URL
                                        select w;
                            var webs = clientContext.LoadQuery(query);
                            clientContext.ExecuteQuery();


                            //Delete the Search Center
                            if (webs.First() != null)
                            {
                                webs.First().DeleteObject();
                                clientContext.ExecuteQuery();
                            }


                        }
                    }
                }
                result.Status = SPRemoteEventServiceStatus.Continue;
            }
            catch (ServerException x)
            {
#if DEBUG
                if (!System.Diagnostics.EventLog.SourceExists("Installer App Events"))
                    System.Diagnostics.EventLog.CreateEventSource(
                    "Installer App Events",
                    "Application");

                System.Diagnostics.EventLog.WriteEntry(
                  "Installer App Events",
                  x.Message);
#endif
                result.Status = SPRemoteEventServiceStatus.Continue;
            }

            return result;
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
