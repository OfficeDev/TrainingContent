using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;


namespace MyTermsetCreator {
  class Program {
    static void Main(string[] args) {

      Uri siteUri = new Uri("https://[[YOUR_O365_TENANCY]].sharepoint.com");
      string realm = TokenHelper.GetRealmFromTargetUrl(siteUri);

      string accessToken = TokenHelper.GetAppOnlyAccessToken(TokenHelper.SharePointPrincipal,
                                                              siteUri.Authority, realm).AccessToken;

      using (var clientContext = TokenHelper.GetClientContextWithAccessToken(siteUri.ToString(), accessToken)) {

        Site devSiteCollection = clientContext.Site;
        Web devSite = clientContext.Web;

        clientContext.Load(devSiteCollection);
        clientContext.Load(devSite);
        clientContext.ExecuteQuery();

        TermGroup termGroup = GetSiteCollectionTermGroup(clientContext, devSiteCollection);
        TermSet termset = CreateTermset(clientContext, termGroup, "Geography");
        CreateTerms(clientContext, termset);

        Console.WriteLine("Termset has been created");
      }

    }

    static TermGroup GetSiteCollectionTermGroup(ClientContext clientContext, Site siteCollection) {

      TaxonomySession taxonomySession = TaxonomySession.GetTaxonomySession(clientContext);
      taxonomySession.UpdateCache();

      clientContext.Load(taxonomySession, ts => ts.TermStores);
      clientContext.ExecuteQuery();

      TermStore termStore = taxonomySession.TermStores.FirstOrDefault<TermStore>();
      Guid localTermStoreID = termStore.Id;
      TermGroup termGroup = termStore.GetSiteCollectionGroup(siteCollection, true);
      clientContext.Load(termGroup);
      clientContext.Load(termGroup.TermSets);
      clientContext.ExecuteQuery();
      return termGroup;
    }

    static TermSet CreateTermset(ClientContext clientContext, TermGroup termGroup, string termSetName) {

      // delete termset if it already exists
      foreach (TermSet termset in termGroup.TermSets) {
        if (termset.Name.Equals(termSetName)) {
          termset.DeleteObject();
          termGroup.TermStore.CommitAll();
          clientContext.ExecuteQuery();
        }
      }

      Guid termSetId = Guid.NewGuid();
      TermSet newTermSet = termGroup.CreateTermSet(termSetName, termSetId, 1033);
      newTermSet.IsOpenForTermCreation = true;
      termGroup.TermStore.CommitAll();
      clientContext.Load(newTermSet);
      clientContext.ExecuteQuery();

      return newTermSet;
    }

    static void CreateTerms(ClientContext clientContext, TermSet termSet) {

      Term termEurope = termSet.CreateTerm("Europe", 1033, Guid.NewGuid());
      termEurope.CreateTerm("United Kingdon", 1033, Guid.NewGuid());
      termEurope.CreateTerm("France", 1033, Guid.NewGuid());
      termEurope.CreateTerm("Spain", 1033, Guid.NewGuid());
      termEurope.CreateTerm("Germany", 1033, Guid.NewGuid());

      Term termNorthAmerica = termSet.CreateTerm("North America", 1033, Guid.NewGuid());
      termNorthAmerica.CreateTerm("Canada", 1033, Guid.NewGuid());
      termNorthAmerica.CreateTerm("United States", 1033, Guid.NewGuid());
      termNorthAmerica.CreateTerm("Mexico", 1033, Guid.NewGuid());

      clientContext.ExecuteQuery();
      termSet.TermStore.CommitAll();

    }
  }
}
