using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;

using O365_TaxidermistWeb;

public class TermModel {
  public Guid TermId { get; set; }
  public string TermName { get; set; }
  public List<TermModel> ChildTerms { get; set; }
}

public class TermsetModel {
  public Guid TermsetId { get; set; }
  public string DisplayName { get; set; }
  public List<TermModel> TopLevelTerms { get; set; }
}

public class SiteCollectionModel {
  public string Url { get; set; }
  public bool hasPrivateGroup { get; set; }
  public string GroupName { get; set; }
  public Guid GroupId { get; set; }
  public Dictionary<Guid, TermsetModel> Termsets { get; set; }
}

public class TaxonomyManager {

  public static SiteCollectionModel GetSiteCollectionModel(string url) {
    
    SiteCollectionModel model = new SiteCollectionModel();

    var aspnetHttpContext = System.Web.HttpContext.Current;
    var spContext = SharePointContextProvider.Current.GetSharePointContext(aspnetHttpContext);

    using (var clientContext = spContext.CreateUserClientContextForSPHost()) {
      if (clientContext != null) {

        Site siteCollection = clientContext.Site;
        clientContext.Load(siteCollection, sc => sc.Url);
        clientContext.ExecuteQuery();
        model.Url = siteCollection.Url;

        TaxonomySession taxonomySession = TaxonomySession.GetTaxonomySession(clientContext);
        taxonomySession.UpdateCache();
        clientContext.Load(taxonomySession, ts => ts.TermStores);
        clientContext.ExecuteQuery();
        TermStore termStore = taxonomySession.TermStores.FirstOrDefault<TermStore>();
        Guid localTermStoreID = termStore.Id;
        TermGroup group = termStore.GetSiteCollectionGroup(siteCollection, false);
        clientContext.ExecuteQuery();
        bool siteCollectionHasPrivateGroup = CSOMObjectExists(group);
        model.hasPrivateGroup = siteCollectionHasPrivateGroup;
        model.Termsets = new Dictionary<Guid, TermsetModel>();
        if (siteCollectionHasPrivateGroup) {
          clientContext.Load(group, g => g.Id, g => g.Name, g => g.TermSets);
          clientContext.ExecuteQuery();
          model.GroupId = group.Id;
          model.GroupName = group.Name;
          foreach (var ts in group.TermSets) {
            TermsetModel termset = new TermsetModel { TermsetId = ts.Id, DisplayName = ts.Name };
            clientContext.Load(ts.Terms);
            clientContext.ExecuteQuery();
            List<TermModel> terms = new List<TermModel>();
            foreach (Term term in ts.Terms) {
              TermModel newTerm = new TermModel { TermName = term.Name, TermId = term.Id };
              LoadChildTerms(term, newTerm, clientContext);
              terms.Add(newTerm);
            }
            termset.TopLevelTerms = terms;
            model.Termsets.Add(ts.Id, termset);
          }
        }
        
      }
      return model;
    }

  }

  private static void LoadChildTerms(Term term, TermModel newTerm, ClientContext clientContext) {
    clientContext.Load(term.Terms);
    clientContext.ExecuteQuery();
    newTerm.ChildTerms = new List<TermModel>();
    foreach (Term childTerm in term.Terms) {
      TermModel newChildTerm = new TermModel { TermName = childTerm.Name, TermId = childTerm.Id };
      LoadChildTerms(childTerm, newChildTerm, clientContext);
      newTerm.ChildTerms.Add(newChildTerm);
    }

  }

  private static bool CSOMObjectExists(ClientObject clientObject) {
    //check object
    if (clientObject == null) {
      //client object is null, so yes, we're null (we can't even check the server object null property)
      return false;
    }
    else if (!clientObject.ServerObjectIsNull.HasValue) {
      //server object null property is itself null, so no, we're not null
      return true;
    }
    else {
      //server object null check has a value, so that determines if we're null
      return !clientObject.ServerObjectIsNull.Value;
    }
  }

  public static void CreatePrivateGroup() {

    var aspnetHttpContext = System.Web.HttpContext.Current;
    var spContext = SharePointContextProvider.Current.GetSharePointContext(aspnetHttpContext);

    using (var clientContext = spContext.CreateUserClientContextForSPHost()) {
      if (clientContext != null) {
        Site siteCollection = clientContext.Site;
        TaxonomySession taxonomySession = TaxonomySession.GetTaxonomySession(clientContext);
        taxonomySession.UpdateCache();
        clientContext.Load(taxonomySession, ts => ts.TermStores);
        clientContext.ExecuteQuery();
        TermStore termStore = taxonomySession.TermStores.FirstOrDefault<TermStore>();
        TermGroup group = termStore.GetSiteCollectionGroup(siteCollection, true);
        clientContext.ExecuteQuery();
      }
    }

  }

  public static void CreateSimpleTermset() {
    string termSetName = "My Termset";
    var aspnetHttpContext = System.Web.HttpContext.Current;
    var spContext = SharePointContextProvider.Current.GetSharePointContext(aspnetHttpContext);

    using (var clientContext = spContext.CreateUserClientContextForSPHost()) {
      if (clientContext != null) {

        Site siteCollection = clientContext.Site;
        clientContext.Load(siteCollection, sc => sc.Url);
        clientContext.ExecuteQuery();

        TaxonomySession taxonomySession = TaxonomySession.GetTaxonomySession(clientContext);
        taxonomySession.UpdateCache();
        clientContext.Load(taxonomySession, ts => ts.TermStores);
        clientContext.ExecuteQuery();
        TermStore termStore = taxonomySession.TermStores.FirstOrDefault<TermStore>();
        Guid localTermStoreID = termStore.Id;

        TermGroup group = termStore.GetSiteCollectionGroup(siteCollection, true);
        clientContext.Load(group);
        clientContext.Load(group.TermSets);
        clientContext.ExecuteQuery();


        // make sure it's deleted if exists

        foreach (TermSet termset in group.TermSets) {
          if (termset.Name.Equals(termSetName)) {
            termset.DeleteObject();
            termStore.CommitAll();
            clientContext.ExecuteQuery();
          }
        }


        Guid termSetId = Guid.NewGuid();
        TermSet tset = group.CreateTermSet(termSetName, termSetId, 1033);

        Term term1 = tset.CreateTerm("Term 1",1033 , Guid.NewGuid());
        term1.CreateTerm("Child A", 1033, Guid.NewGuid());
        term1.CreateTerm("Child B", 1033, Guid.NewGuid());
        term1.CreateTerm("Child C", 1033, Guid.NewGuid());
        
        Term term2 = tset.CreateTerm("Term 2", 1033, Guid.NewGuid());
        term2.CreateTerm("Child D", 1033, Guid.NewGuid());
        term2.CreateTerm("Child E", 1033, Guid.NewGuid());
        term2.CreateTerm("Child F", 1033, Guid.NewGuid());

        Term term3 = tset.CreateTerm("Term 3", 1033, Guid.NewGuid());
        term3.CreateTerm("Child G", 1033, Guid.NewGuid());
        term3.CreateTerm("Child H", 1033, Guid.NewGuid());
        term3.CreateTerm("Child I", 1033, Guid.NewGuid());


        termStore.CommitAll();
        clientContext.ExecuteQuery();

        clientContext.ExecuteQuery();
        termStore.CommitAll();
      }
    }
  }

  public static void CreateCustomerGeographyTermset() {
    string termSetName = "Customer Geography";
    var aspnetHttpContext = System.Web.HttpContext.Current;
    var spContext = SharePointContextProvider.Current.GetSharePointContext(aspnetHttpContext);

    using (var clientContext = spContext.CreateUserClientContextForSPHost()) {
      if (clientContext != null) {

        Site siteCollection = clientContext.Site;
        clientContext.Load(siteCollection, sc => sc.Url);
        clientContext.ExecuteQuery();

        TaxonomySession taxonomySession = TaxonomySession.GetTaxonomySession(clientContext);
        taxonomySession.UpdateCache();
        clientContext.Load(taxonomySession, ts => ts.TermStores);
        clientContext.ExecuteQuery();
        TermStore termStore = taxonomySession.TermStores.FirstOrDefault<TermStore>();
        Guid localTermStoreID = termStore.Id;

        TermGroup group = termStore.GetSiteCollectionGroup(siteCollection, true);
        clientContext.Load(group);
        clientContext.Load(group.TermSets);
        clientContext.ExecuteQuery();


        // make sure it's deleted if exists

        foreach (TermSet termset in group.TermSets) {
          if (termset.Name.Equals(termSetName)) {
            termset.DeleteObject();
            termStore.CommitAll();
            clientContext.ExecuteQuery();
          }
        }


        Guid termSetId = Guid.NewGuid();
        TermSet tset = group.CreateTermSet(termSetName, termSetId, 1033);

        Term term1 = tset.CreateTerm("Northern Sales Territory", 1033, Guid.NewGuid());
        term1.CreateTerm("New York", 1033, Guid.NewGuid());
        term1.CreateTerm("New Jersey", 1033, Guid.NewGuid());
        term1.CreateTerm("Connecticut", 1033, Guid.NewGuid());

        Term term2 = tset.CreateTerm("Southern Sales Territory", 1033, Guid.NewGuid());
        term2.CreateTerm("Georgia", 1033, Guid.NewGuid());
        term2.CreateTerm("Alalabama", 1033, Guid.NewGuid());
        Term florida = term2.CreateTerm("Florida", 1033, Guid.NewGuid());
        florida.CreateTerm("Jacksonville", 1033, Guid.NewGuid());
        florida.CreateTerm("Tampa", 1033, Guid.NewGuid());
        florida.CreateTerm("Miami", 1033, Guid.NewGuid());
        florida.CreateTerm("Key West", 1033, Guid.NewGuid());


        termStore.CommitAll();
        clientContext.ExecuteQuery();

        clientContext.ExecuteQuery();
        termStore.CommitAll();
      }
    }
  }

  public static void CreateProductCategoriesTermset() {
    string termSetName = "Product Categories";
    var aspnetHttpContext = System.Web.HttpContext.Current;
    var spContext = SharePointContextProvider.Current.GetSharePointContext(aspnetHttpContext);

    using (var clientContext = spContext.CreateUserClientContextForSPHost()) {
      if (clientContext != null) {

        Site siteCollection = clientContext.Site;
        clientContext.Load(siteCollection, sc => sc.Url);
        clientContext.ExecuteQuery();

        TaxonomySession taxonomySession = TaxonomySession.GetTaxonomySession(clientContext);
        taxonomySession.UpdateCache();
        clientContext.Load(taxonomySession, ts => ts.TermStores);
        clientContext.ExecuteQuery();
        TermStore termStore = taxonomySession.TermStores.FirstOrDefault<TermStore>();
        Guid localTermStoreID = termStore.Id;

        TermGroup group = termStore.GetSiteCollectionGroup(siteCollection, true);
        clientContext.Load(group);
        clientContext.Load(group.TermSets);
        clientContext.ExecuteQuery();


        // make sure it's deleted if exists

        foreach (TermSet termset in group.TermSets) {
          if (termset.Name.Equals(termSetName)) {
            termset.DeleteObject();
            termStore.CommitAll();
            clientContext.ExecuteQuery();
          }
        }

        Guid termSetId = Guid.NewGuid();
        TermSet tset = group.CreateTermSet(termSetName, termSetId, 1033);
        termStore.CommitAll();
        clientContext.ExecuteQuery();

        foreach (var term in terms) {
          CreateTopLevelTerm(tset, term);
        }

        termStore.CommitAll();
        clientContext.ExecuteQuery();

        clientContext.ExecuteQuery();
        termStore.CommitAll();
      }
    }
  }


  #region "Helper types and contants for managed metadata termsets"

  public class TermInit {
    public string TermName { get; set; }
    public Guid TermID { get; set; }
    public TermInit[] ChildTerms { get; set; }
    public TermInit(string termName, Guid termID) : this(termName, termID, null) { }
    public TermInit(string termName, Guid termID, TermInit[] childTerms) {
      TermName = termName;
      TermID = termID;
      ChildTerms = childTerms;
    }
  }

  static Guid localTermStoreID; // this will be different in each farm

  static string termSetName = "Product Categories";
  static Guid termSetId = Guid.NewGuid();

  static string termName_ActionFigures = "Action Figures";
  static Guid termID_ActionFigures = Guid.NewGuid();

  static string termName_ActionFigures_MoviesAndTV = "Movies and TV";
  static Guid termID_ActionFigures_MoviesAndTV = Guid.NewGuid();

  static string termName_ActionFigures_MoviesAndTV_ToughGuys = "Tough Guys";
  static Guid termID_ActionFigures_MoviesAndTV_ToughGuys = Guid.NewGuid();

  static string termName_ActionFigures_MoviesAndTV_CuteAndHuggable = "Cute and Huggable";
  static Guid termID_ActionFigures_MoviesAndTV_CuteAndHuggable = Guid.NewGuid();

  static string termName_ActionFigures_RobotsAndRobotics = "Robots and Robotics";
  static Guid termID_ActionFigures_RobotsAndRobotics = Guid.NewGuid();

  static string termName_ActionFigures_RobotsAndRobotics_Simple = "Simple";
  static Guid termID_ActionFigures_RobotsAndRobotics_Simple = Guid.NewGuid();

  static string termName_ActionFigures_RobotsAndRobotics_Advanced = "Advanced";
  static Guid termID_ActionFigures_RobotsAndRobotics_Advanced = Guid.NewGuid();

  static string termName_ActionFigures_Sports = "Sports";
  static Guid termID_ActionFigures_Sports = Guid.NewGuid();

  static string termName_ActionFigures_Sports_Football = "Football";
  static Guid termID_ActionFigures_Sports_Football = Guid.NewGuid();

  static string termName_ActionFigures_Sports_Baseball = "Baseball";
  static Guid termID_ActionFigures_Sports_Baseball = Guid.NewGuid();

  static string termName_ArtsAndCrafts = "Arts and Crafts";
  static Guid termID_ArtsAndCrafts = Guid.NewGuid();

  static string termName_ArtsAndCrafts_DrawingAndColoring = "Drawing and Coloring";
  static Guid termID_ArtsAndCrafts_DrawingAndColoring = Guid.NewGuid();

  static string termName_ArtsAndCrafts_DrawingAndColoring_Coloring = "Coloring";
  static Guid termID_ArtsAndCrafts_DrawingAndColoring_Coloring = Guid.NewGuid();

  static string termName_ArtsAndCrafts_DrawingAndColoring_Painting = "Painting";
  static Guid termID_ArtsAndCrafts_DrawingAndColoring_Painting = Guid.NewGuid();

  static string termName_ArtsAndCrafts_BeadsAndJewelry = "Beads and Jewelry";
  static Guid termID_ArtsAndCrafts_BeadsAndJewelry = Guid.NewGuid();

  static string termName_ArtsAndCrafts_BeadsAndJewelry_JewelryKits = "Jewelry Kits";
  static Guid termID_ArtsAndCrafts_BeadsAndJewelry_JewelryKits = Guid.NewGuid();

  static string termName_ArtsAndCrafts_BeadsAndJewelry_Accessories = "Parts and Accessories";
  static Guid termID_ArtsAndCrafts_BeadsAndJewelry_Accessories = Guid.NewGuid();

  static string termName_ArtsAndCrafts_Scrapbooking = "Scrapbooking";
  static Guid termID_ArtsAndCrafts_Scrapbooking = Guid.NewGuid();

  static string termName_ArtsAndCrafts_Scrapbooking_Scrapbooks = "Scrapbooks";
  static Guid termID_ArtsAndCrafts_Scrapbooking__Scrapbooks = Guid.NewGuid();

  static string termName_ArtsAndCrafts_Scrapbooking_FillerPages = "Filler Pages";
  static Guid termID_ArtsAndCrafts_Scrapbooking_FillerPages = Guid.NewGuid();

  static string termName_VehiclesAndRC = "Vehicles and RC";
  static Guid termID_VehiclesAndRC = Guid.NewGuid();

  static string termName_VehiclesAndRC_HobbyistVehicles = "Hobbyist Vehicles";
  static Guid termID_VehiclesAndRC_HobbyistVehicles = Guid.NewGuid();

  static string termName_VehiclesAndRC_HobbyistVehicles_Trains = "Trains";
  static Guid termID_VehiclesAndRC_HobbyistVehicles_Trains = Guid.NewGuid();

  static string termName_VehiclesAndRC_HobbyistVehicles_Planes = "Planes";
  static Guid termID_VehiclesAndRC_HobbyistVehicles_Planes = Guid.NewGuid();

  static string termName_VehiclesAndRC_RCToys = "Remote Control Toys";
  static Guid termID_VehiclesAndRC_RCToys = Guid.NewGuid();

  static string termName_VehiclesAndRC_RCToys_Cars = "Cars";
  static Guid termID_VehiclesAndRC_RCToys_Cars = Guid.NewGuid();

  static string termName_VehiclesAndRC_RCToys_Trucks = "Trucks";
  static Guid termID_VehiclesAndRC_RCToys_Trucks = Guid.NewGuid();

  static string termName_VehiclesAndRC_RCToys_Boats = "Boats";
  static Guid termID_VehiclesAndRC_RCToys_Boats = Guid.NewGuid();

  static string termName_VehiclesAndRC_RCToys_Planes = "Planes";
  static Guid termID_VehiclesAndRC_RCToys_Planes = Guid.NewGuid();

  static string termName_VehiclesAndRC_RCToys_Hellicopters = "Hellicopters";
  static Guid termID_VehiclesAndRC_RCToys_Hellicopters = Guid.NewGuid();

  #endregion

  #region "Managed metadata initialization data"

  static TermInit[] terms = {
      new TermInit(termName_ActionFigures, termID_ActionFigures, new TermInit[]{

        new TermInit(termName_ActionFigures_MoviesAndTV, termID_ActionFigures_MoviesAndTV, new TermInit[]{
          new TermInit(termName_ActionFigures_MoviesAndTV_ToughGuys, termID_ActionFigures_MoviesAndTV_ToughGuys),
          new TermInit(termName_ActionFigures_MoviesAndTV_CuteAndHuggable, termID_ActionFigures_MoviesAndTV_CuteAndHuggable)}),
        new TermInit(termName_ActionFigures_RobotsAndRobotics, termID_ActionFigures_RobotsAndRobotics, new TermInit[]{
          new TermInit(termName_ActionFigures_RobotsAndRobotics_Simple, termID_ActionFigures_RobotsAndRobotics_Simple),
          new TermInit(termName_ActionFigures_RobotsAndRobotics_Advanced, termID_ActionFigures_RobotsAndRobotics_Advanced)}),
        new TermInit(termName_ActionFigures_Sports, termID_ActionFigures_Sports, new TermInit[]{
          new TermInit(termName_ActionFigures_Sports_Baseball, termID_ActionFigures_Sports_Baseball),
          new TermInit(termName_ActionFigures_Sports_Football, termID_ActionFigures_Sports_Football)}) }),
    
        new TermInit(termName_ArtsAndCrafts, termID_ArtsAndCrafts, new TermInit[]{
          new TermInit(termName_ArtsAndCrafts_DrawingAndColoring, termID_ArtsAndCrafts_DrawingAndColoring, new TermInit[]{
            new TermInit(termName_ArtsAndCrafts_DrawingAndColoring_Coloring, termID_ArtsAndCrafts_DrawingAndColoring_Coloring),
            new TermInit(termName_ArtsAndCrafts_DrawingAndColoring_Painting, termID_ArtsAndCrafts_DrawingAndColoring_Painting) }),
          new TermInit(termName_ArtsAndCrafts_BeadsAndJewelry, termID_ArtsAndCrafts_BeadsAndJewelry, new TermInit[]{
            new TermInit(termName_ArtsAndCrafts_BeadsAndJewelry_JewelryKits, termID_ArtsAndCrafts_BeadsAndJewelry_JewelryKits),
            new TermInit(termName_ArtsAndCrafts_BeadsAndJewelry_Accessories, termID_ArtsAndCrafts_BeadsAndJewelry_Accessories)}),
          new TermInit(termName_ArtsAndCrafts_Scrapbooking, termID_ArtsAndCrafts_Scrapbooking, new TermInit[]{
            new TermInit(termName_ArtsAndCrafts_Scrapbooking_Scrapbooks, termID_ArtsAndCrafts_Scrapbooking__Scrapbooks),
            new TermInit(termName_ArtsAndCrafts_Scrapbooking_FillerPages, termID_ArtsAndCrafts_Scrapbooking_FillerPages)})}),

        new TermInit(termName_VehiclesAndRC, termID_VehiclesAndRC, new TermInit[]{
          new TermInit(termName_VehiclesAndRC_HobbyistVehicles, termID_VehiclesAndRC_HobbyistVehicles, new TermInit[]{
            new TermInit(termName_VehiclesAndRC_HobbyistVehicles_Trains, termID_VehiclesAndRC_HobbyistVehicles_Trains),
            new TermInit(termName_VehiclesAndRC_HobbyistVehicles_Planes, termID_VehiclesAndRC_HobbyistVehicles_Planes)}),
          new TermInit(termName_VehiclesAndRC_RCToys, termID_VehiclesAndRC_RCToys, new TermInit[]{
            new TermInit(termName_VehiclesAndRC_RCToys_Cars, termID_VehiclesAndRC_RCToys_Cars),
            new TermInit(termName_VehiclesAndRC_RCToys_Trucks, termID_VehiclesAndRC_RCToys_Trucks),
            new TermInit(termName_VehiclesAndRC_RCToys_Boats, termID_VehiclesAndRC_RCToys_Boats),
            new TermInit(termName_VehiclesAndRC_RCToys_Planes, termID_VehiclesAndRC_RCToys_Planes),
            new TermInit(termName_VehiclesAndRC_RCToys_Hellicopters, termID_VehiclesAndRC_RCToys_Hellicopters)})})

    };

  #endregion

  #region "Managed Metadata Helper functions"


  private static void CreateTopLevelTerm(TermSet tset, TermInit term) {
    Term newTerm = tset.CreateTerm(term.TermName, 1033, term.TermID);
    if (term.ChildTerms != null) {
      foreach (TermInit childterm in term.ChildTerms) {
        CreateChildTerm(newTerm, childterm);
      }
    }
  }

  private static void CreateChildTerm(Term parent, TermInit child) {
    Term newTerm = parent.CreateTerm(child.TermName, 1033, child.TermID);
    if (child.ChildTerms != null) {
      foreach (TermInit childterm in child.ChildTerms) {
        CreateChildTerm(newTerm, childterm);
      }
    }
  }

  #endregion

}