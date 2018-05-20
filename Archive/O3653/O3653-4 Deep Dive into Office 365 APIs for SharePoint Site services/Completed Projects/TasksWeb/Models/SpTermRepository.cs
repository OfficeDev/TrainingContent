using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using TasksWeb.Utils;

namespace TasksWeb.Models {
  public class SpTermRepository {

    private async Task<string> GetAccessToken() {
      // fetch from stuff user claims
      var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
      var userObjectId = ClaimsPrincipal.Current.FindFirst(SettingsHelper.ClaimTypeObjectIdentifier).Value;


      var clientCredential = new ClientCredential(SettingsHelper.ClientId, SettingsHelper.ClientSecret);
      var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);

      // create auth context
      AuthenticationContext authContext = new AuthenticationContext(SettingsHelper.AzureADAuthority, new EFADALTokenCache(signInUserId));

      // authenticate
      var authResult = await authContext.AcquireTokenSilentAsync(SettingsHelper.SharePointServiceResourceId, clientCredential, userIdentifier);

      // obtain access token
      return authResult.AccessToken;
    }

    private async Task<ClientContext> GetClientContext() {
      string targetUrl = string.Format("https://{0}.sharepoint.com", SettingsHelper.O365TenantId);
      var context = TokenHelper.GetClientContextWithAccessToken(targetUrl, await GetAccessToken());
      return context;
    }

    public async Task<List<SpTerm>> GetTerms() {
      var context = await GetClientContext();

      // get list of top level term
      var session = TaxonomySession.GetTaxonomySession(context);
      context.Load(session, taxSession => taxSession.TermStores.Include(
                 taxStore => taxStore.Groups.Include(
                 taxGroup => taxGroup.TermSets.Include(tax => tax.Name)
                 )));
      context.ExecuteQuery();

      // get the root of the term set
      var termStore = session.TermStores[0];
      var termGroup = termStore.Groups[0];
      var termSet = termGroup.TermSets[0];

      // get all the child terms for the found term
      var terms = termSet.Terms;
      context.Load(terms);
      context.ExecuteQuery();

      // convert sharepoint terms => biz object
      var results = terms.Select(term => new SpTerm {
        Id = term.Id,
        Label = term.Name
      })
      .ToList();

      return results;
    }

    public async Task<List<SpTerm>> GetTerms(Guid parentTermId) {
      var context = await GetClientContext();

      // get a list of all the child terms based on the term passed in
      var session = TaxonomySession.GetTaxonomySession(context);
      context.Load(session, taxSession => taxSession.TermStores.Include(
                 taxStore => taxStore.Groups.Include(
                 taxGroup => taxGroup.TermSets.Include(tax => tax.Name)
                 )));
      context.ExecuteQuery();

      // get the root of the term set
      var termStore = session.TermStores[0];
      var termGroup = termStore.Groups[0];
      var termSet = termGroup.TermSets[0];

      // find the specified term
      var searchTerm = termSet.GetTerm(parentTermId);
      context.Load(searchTerm);
      context.ExecuteQuery();

      // get all the child terms for the found term
      var terms = searchTerm.Terms;
      context.Load(terms);
      context.ExecuteQuery();

      // convert sharepoint terms => biz object
      var results = terms.Select(term => new SpTerm {
        Id = term.Id,
        Label = term.Name
      })
      .ToList();

      return results;
    }

    public async Task CreateTerm(Guid parentTermId, string newTermLabel) {
      var context = await GetClientContext();

      // get a list of all the child terms based on the term passed in
      var session = TaxonomySession.GetTaxonomySession(context);
      context.Load(session, taxSession => taxSession.TermStores.Include(
                 taxStore => taxStore.Groups.Include(
                 taxGroup => taxGroup.TermSets.Include(tax => tax.Name)
                 )));
      context.ExecuteQuery();

      // get the root of the term set
      var termStore = session.TermStores[0];
      var termGroup = termStore.Groups[0];
      var termSet = termGroup.TermSets[0];

      // find the specified term
      var searchTerm = termSet.GetTerm(parentTermId);
      context.Load(searchTerm);
      context.ExecuteQuery();

      // create the term
      searchTerm.CreateTerm(newTermLabel, 1033, Guid.NewGuid());
      termStore.CommitAll();
      context.ExecuteQuery();

      return;
    }

    public async Task DeleteTerm(Guid termId) {
      var context = await GetClientContext();

      // get a list of all the child terms based on the term passed in
      var session = TaxonomySession.GetTaxonomySession(context);
      context.Load(session, taxSession => taxSession.TermStores.Include(
                 taxStore => taxStore.Groups.Include(
                 taxGroup => taxGroup.TermSets.Include(tax => tax.Name)
                 )));
      context.ExecuteQuery();

      // get the root of the term set
      var termStore = session.TermStores[0];
      var termGroup = termStore.Groups[0];
      var termSet = termGroup.TermSets[0];

      // find the specified term
      var searchTerm = termSet.GetTerm(termId);
      context.Load(searchTerm);
      context.ExecuteQuery();

      // delete the term
      searchTerm.DeleteObject();
      termStore.CommitAll();
      context.ExecuteQuery();

      return;
    }

  }
}