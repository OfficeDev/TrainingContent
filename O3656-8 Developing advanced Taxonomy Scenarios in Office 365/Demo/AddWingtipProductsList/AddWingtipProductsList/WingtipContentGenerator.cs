using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using SystemIO = System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint.Client;
using System.Collections.Specialized;
using Microsoft.SharePoint.Client.Taxonomy;

namespace AddWingtipProductsList{

  public class WingtipContentGenerator {

    #region "Variables to track ClientContext, Site and Web"

    static string siteUrl = ConfigurationManager.AppSettings["targetSiteUrl"];
    static ClientContext clientContext = new ClientContext(siteUrl);
    static Site siteCollection = clientContext.Site;
    static Web site = clientContext.Web;

    #endregion

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

    #region "Variables and helper methods for site columns, content types and lists"

    static Field fieldProductCode;
    static FieldMultiLineText fieldProductDescription;
    static FieldCurrency fieldProductListPrice;
    static FieldMultiChoice fieldProductColor;
    static FieldNumber fieldMinimumAge;
    static FieldNumber fieldMaximumAge;
    static FieldUrl fieldProductImageUrl;
    static TaxonomyField fieldProductCategory;

    static ContentType ctypeProduct;

    static List listProducts;
    static List listProductImages;
    static string listProductImagesUrl;

    static Field CreateSiteColumn(string fieldName, string fieldDisplayName, string fieldType) {

      Console.WriteLine("Creating " + fieldName + " site column...");

      // delete existing field if it exists
      try {
        Field fld = site.Fields.GetByInternalNameOrTitle(fieldName);
        fld.DeleteObject();
        clientContext.ExecuteQuery();
      }
      catch { }

      string fieldXML = @"<Field Name='" + fieldName + "' " +
                                "DisplayName='" + fieldDisplayName + "' " +
                                "Type='" + fieldType + "' " +
                                "Group='Wingtip' > " +
                         "</Field>";

      Field field = site.Fields.AddFieldAsXml(fieldXML, true, AddFieldOptions.DefaultValue);
      clientContext.Load(field);
      clientContext.ExecuteQuery();
      return field;
    }

    static void DeleteContentType(string contentTypeName) {
      try {
        foreach (var ct in site.ContentTypes) {
          if (ct.Name.Equals(contentTypeName)) {
            ct.DeleteObject();
            Console.WriteLine("Deleting existing " + ct.Name + " content type...");
            clientContext.ExecuteQuery();
            break;
          }
        }
      }
      catch { }

    }

    static ContentType CreateContentType(string contentTypeName, string baseContentType) {

      DeleteContentType(contentTypeName);

      ContentTypeCreationInformation contentTypeCreateInfo = new ContentTypeCreationInformation();
      contentTypeCreateInfo.Name = contentTypeName;
      contentTypeCreateInfo.ParentContentType = site.ContentTypes.GetById(baseContentType); ;
      contentTypeCreateInfo.Group = "Wingtip";
      ContentType ctype = site.ContentTypes.Add(contentTypeCreateInfo);
      clientContext.ExecuteQuery();
      return ctype;

    }

    static void DeleteList(string listTitle) {
      try {
        List list = site.Lists.GetByTitle(listTitle);
        list.DeleteObject();
        Console.WriteLine("Deleting existing " + listTitle + " list...");
        clientContext.ExecuteQuery();
      }
      catch { }
    }

    #endregion

    static public void DeleteExistingContent() {
    }

    static public void CreateProductCategoriesTermset() {

      Console.WriteLine("Creating Product Category Termset");
      Site siteCollection = clientContext.Site;
      clientContext.Load(siteCollection);
  
      TaxonomySession taxonomySession = TaxonomySession.GetTaxonomySession(clientContext);
      taxonomySession.UpdateCache();

      clientContext.Load(taxonomySession, ts => ts.TermStores);
      clientContext.ExecuteQuery();

      var termStore = taxonomySession.TermStores.FirstOrDefault<TermStore>();
      localTermStoreID = termStore.Id;
      var group = termStore.GetSiteCollectionGroup(siteCollection, true);
      clientContext.Load(group);
      clientContext.Load(group.TermSets);
      clientContext.ExecuteQuery();

      // make sure it's deleted if exists
      foreach(TermSet termset in group.TermSets){
        if(termset.Name.Equals(termSetName)){
          termset.DeleteObject();
          termStore.CommitAll();
          clientContext.ExecuteQuery();
        }
      }

      TermSet tset = group.CreateTermSet(termSetName, termSetId, 1033);
      termStore.CommitAll();
      clientContext.ExecuteQuery();

      foreach (var term in terms) {
        CreateTopLevelTerm(tset, term);
      }

      clientContext.ExecuteQuery();
      termStore.CommitAll();
    }

    static public void CreateProductsLists() {

      try {
        clientContext.Load(siteCollection);
        clientContext.Load(site);
        clientContext.Load(site.Fields);
        clientContext.Load(site.ContentTypes);
        clientContext.ExecuteQuery();

        DeleteAllWingtipTypes();
        CreateProductImagesLibrary();
        UploadProductImages();
        CreateWingtipSiteColumns();
        CreateProductContentType();
        CreateProductsList();
        PopulateProductsList();        

        Console.WriteLine("The Products list and its dependant types have been created.");
        Console.WriteLine();
      }
      catch (Exception ex) {
        Console.WriteLine();
        Console.WriteLine("----------------------------------------------------------------");
        Console.WriteLine("----  Error occured when attempting to create Products list ----");
        Console.WriteLine("----------------------------------------------------------------");
        Console.WriteLine();
        Console.WriteLine("Error type:");
        Console.WriteLine(ex.GetType().ToString());
        Console.WriteLine();
        Console.WriteLine("Error message:");
        Console.WriteLine(ex.Message);
        Console.WriteLine();
        Console.WriteLine("You must find and correct the problem ou are experiencing in order to successfully use this utility.");
      }
    }


    static void DeleteAllWingtipTypes() {
      DeleteList("Product Images");
      DeleteList("Products");
      DeleteContentType("Product");
    }

    static void CreateWingtipSiteColumns() {

      Console.WriteLine();

      fieldProductCode = CreateSiteColumn("ProductCode", "Product Code", "Text");
      fieldProductCode.EnforceUniqueValues = true;
      fieldProductCode.Indexed = true;
      fieldProductCode.Required = true;
      fieldProductCode.Update();
      clientContext.ExecuteQuery();
      clientContext.Load(fieldProductCode);
      clientContext.ExecuteQuery();

      fieldProductDescription = clientContext.CastTo<FieldMultiLineText>(CreateSiteColumn("ProductDescription", "Product Description", "Note"));
      fieldProductDescription.NumberOfLines = 4;
      fieldProductDescription.RichText = false;
      fieldProductDescription.Update();
      clientContext.ExecuteQuery();

      fieldProductListPrice = clientContext.CastTo<FieldCurrency>(CreateSiteColumn("ProductListPrice", "List Price", "Currency"));
      fieldProductListPrice.MinimumValue = 0;
      fieldProductListPrice.Update();
      clientContext.ExecuteQuery();

      fieldProductCategory = clientContext.CastTo<TaxonomyField>(CreateSiteColumn("ProductCategory", "Product Category", "TaxonomyFieldType"));
      fieldProductCategory.SspId = localTermStoreID;
      fieldProductCategory.TermSetId = termSetId;
      fieldProductCategory.AllowMultipleValues = false;
      fieldProductCategory.Update();
      clientContext.ExecuteQuery();

      fieldProductColor = clientContext.CastTo<FieldMultiChoice>(CreateSiteColumn("ProductColor", "Product Color", "MultiChoice"));
      string[] choicesProductColor = { "White", "Black", "Grey", "Blue", "Red", "Green", "Yellow" };
      fieldProductColor.Choices = choicesProductColor;
      fieldProductColor.Update();
      clientContext.ExecuteQuery();

      fieldMinimumAge = clientContext.CastTo<FieldNumber>(CreateSiteColumn("MinimumAge", "Minimum Age", "Number"));
      fieldMinimumAge.MinimumValue = 1;
      fieldMinimumAge.MaximumValue = 100;
      fieldMinimumAge.Update();
      clientContext.ExecuteQuery();

      fieldMaximumAge = clientContext.CastTo<FieldNumber>(CreateSiteColumn("MaximumAge", "Maximum Age", "Number"));
      fieldMaximumAge.MinimumValue = 1;
      fieldMaximumAge.MaximumValue = 100;
      fieldMaximumAge.Update();
      clientContext.ExecuteQuery();

      fieldProductImageUrl = clientContext.CastTo<FieldUrl>(CreateSiteColumn("ProductImageUrl", "Product Image Url", "URL"));
      fieldProductImageUrl.DisplayFormat = UrlFieldFormatType.Image;
      fieldProductImageUrl.Update();
      clientContext.ExecuteQuery();


    }

    static void CreateProductImagesLibrary() {
      Console.WriteLine();
      Console.WriteLine("Creating Product Images library...");


      ListCreationInformation listInformationProductImages = new ListCreationInformation();
      listInformationProductImages.Title = "Product Images";
      listInformationProductImages.Url = "ProductImages";
      listInformationProductImages.QuickLaunchOption = QuickLaunchOptions.On;
      listInformationProductImages.TemplateType = (int)ListTemplateType.PictureLibrary;
      listProductImages = site.Lists.Add(listInformationProductImages);
      listProductImages.OnQuickLaunch = true;
      listProductImages.Update();

      clientContext.ExecuteQuery();

      listProductImagesUrl = site.Url + "/ProductImages/";

    }

    static void UploadProductImage(byte[] imageContent, string imageFileName) {

      Console.WriteLine("  uploading " + imageFileName);


      FileCreationInformation fileInfo = new FileCreationInformation();
      fileInfo.Content = imageContent;
      fileInfo.Overwrite = true;
      fileInfo.Url = listProductImagesUrl + imageFileName;
      File newFile = listProductImages.RootFolder.Files.Add(fileInfo);
      clientContext.ExecuteQuery();

    }

    static void UploadProductImages() {

      Console.WriteLine();
      Console.WriteLine("Uploading Product Images...");

      UploadProductImage(Properties.Resources.WP0001, "WP0001.jpg");
      UploadProductImage(Properties.Resources.WP0002, "WP0002.jpg");
      UploadProductImage(Properties.Resources.WP0003, "WP0003.jpg");
      UploadProductImage(Properties.Resources.WP0004, "WP0004.jpg");
      UploadProductImage(Properties.Resources.WP0005, "WP0005.jpg");
      UploadProductImage(Properties.Resources.WP0006, "WP0006.jpg");
      UploadProductImage(Properties.Resources.WP0007, "WP0007.jpg");
      UploadProductImage(Properties.Resources.WP0008, "WP0008.jpg");
      UploadProductImage(Properties.Resources.WP0009, "WP0009.jpg");
      UploadProductImage(Properties.Resources.WP0010, "WP0010.jpg");
      UploadProductImage(Properties.Resources.WP0011, "WP0011.jpg");
      UploadProductImage(Properties.Resources.WP0012, "WP0012.jpg");
      UploadProductImage(Properties.Resources.WP0013, "WP0013.jpg");
      UploadProductImage(Properties.Resources.WP0014, "WP0014.jpg");
      UploadProductImage(Properties.Resources.WP0015, "WP0015.jpg");
      UploadProductImage(Properties.Resources.WP0016, "WP0016.jpg");
      UploadProductImage(Properties.Resources.WP0017, "WP0017.jpg");
      UploadProductImage(Properties.Resources.WP0018, "WP0018.jpg");
      UploadProductImage(Properties.Resources.WP0019, "WP0019.jpg");
      UploadProductImage(Properties.Resources.WP0020, "WP0020.jpg");
      UploadProductImage(Properties.Resources.WP0021, "WP0021.jpg");
      UploadProductImage(Properties.Resources.WP0022, "WP0022.jpg");
      UploadProductImage(Properties.Resources.WP0023, "WP0023.jpg");
      UploadProductImage(Properties.Resources.WP0024, "WP0024.jpg");
      UploadProductImage(Properties.Resources.WP0025, "WP0025.jpg");
      UploadProductImage(Properties.Resources.WP0026, "WP0026.jpg");
      UploadProductImage(Properties.Resources.WP0027, "WP0027.jpg");
      UploadProductImage(Properties.Resources.WP0028, "WP0028.jpg");
      UploadProductImage(Properties.Resources.WP0029, "WP0029.jpg");
      UploadProductImage(Properties.Resources.WP0030, "WP0030.jpg");
      UploadProductImage(Properties.Resources.WP0031, "WP0031.jpg");
      UploadProductImage(Properties.Resources.WP0032, "WP0032.jpg");

    }

    static void CreateProductContentType() {

      Console.WriteLine("Creating Product content type...");
      ctypeProduct = CreateContentType("Product", "0x01");

      // add site columns
      FieldLinkCreationInformation fieldLinkProductCode = new FieldLinkCreationInformation();
      fieldLinkProductCode.Field = fieldProductCode;
      ctypeProduct.FieldLinks.Add(fieldLinkProductCode);
      ctypeProduct.Update(true);

      FieldLinkCreationInformation fieldLinkProductDescription = new FieldLinkCreationInformation();
      fieldLinkProductDescription.Field = fieldProductDescription;
      ctypeProduct.FieldLinks.Add(fieldLinkProductDescription);
      ctypeProduct.Update(true);

      FieldLinkCreationInformation fieldLinkProductListPrice = new FieldLinkCreationInformation();
      fieldLinkProductListPrice.Field = fieldProductListPrice;
      ctypeProduct.FieldLinks.Add(fieldLinkProductListPrice);
      ctypeProduct.Update(true);


      FieldLinkCreationInformation fieldLinkProductCategory = new FieldLinkCreationInformation();
      fieldLinkProductCategory.Field = fieldProductCategory;
      ctypeProduct.FieldLinks.Add(fieldLinkProductCategory);
      ctypeProduct.Update(true);

      FieldLinkCreationInformation fieldLinkProductColor = new FieldLinkCreationInformation();
      fieldLinkProductColor.Field = fieldProductColor;
      ctypeProduct.FieldLinks.Add(fieldLinkProductColor);
      ctypeProduct.Update(true);

      FieldLinkCreationInformation fieldLinkMinimumAge = new FieldLinkCreationInformation();
      fieldLinkMinimumAge.Field = fieldMinimumAge;
      ctypeProduct.FieldLinks.Add(fieldLinkMinimumAge);
      ctypeProduct.Update(true);

      FieldLinkCreationInformation fieldLinkMaximumAge = new FieldLinkCreationInformation();
      fieldLinkMaximumAge.Field = fieldMaximumAge;
      ctypeProduct.FieldLinks.Add(fieldLinkMaximumAge);
      ctypeProduct.Update(true);


      FieldLinkCreationInformation fieldLinkProductImageUrl = new FieldLinkCreationInformation();
      fieldLinkProductImageUrl.Field = fieldProductImageUrl;
      ctypeProduct.FieldLinks.Add(fieldLinkProductImageUrl);
      ctypeProduct.Update(true);

      clientContext.ExecuteQuery();

    }

    static void CreateProductsList() {

      Console.WriteLine("Creating Products list...");

      ListCreationInformation listInformationProducts = new ListCreationInformation();
      listInformationProducts.Title = "Products";
      listInformationProducts.Url = "Lists/Products";
      listInformationProducts.QuickLaunchOption = QuickLaunchOptions.On;
      listInformationProducts.TemplateType = (int)ListTemplateType.GenericList;
      listProducts = site.Lists.Add(listInformationProducts);
      listProducts.OnQuickLaunch = true;
      listProducts.Update();

      clientContext.Load(listProducts);
      clientContext.Load(listProducts.ContentTypes);
      clientContext.ExecuteQuery();

      listProducts.ContentTypesEnabled = true;
      listProducts.ContentTypes.AddExistingContentType(ctypeProduct);
      ContentType existing = listProducts.ContentTypes[0]; ;
      existing.DeleteObject();
      listProducts.Update();
      clientContext.ExecuteQuery();


      View viewProducts = listProducts.DefaultView;
      viewProducts.ViewFields.Add("ProductCode");
      viewProducts.ViewFields.Add("ProductListPrice");
      viewProducts.ViewFields.Add("ProductCategory");
      viewProducts.ViewFields.Add("ProductColor");
      viewProducts.Update();

      clientContext.ExecuteQuery();


      string fieldXML = @"<Field 
                            Type=""Calculated""
                            Name=""AgeRange""
                            DisplayName=""Age Range"" 
                            EnforceUniqueValues=""FALSE"" 
                            Indexed=""FALSE"" 
                            ResultType=""Text"" > 
                            <Formula>=IF(AND(ISBLANK([Minimum Age]),ISBLANK([Maximum Age])),&quot;All ages&quot;,IF(ISBLANK([Maximum Age]),&quot;Ages &quot;&amp;[Minimum Age]&amp;&quot; and older&quot;,IF(ISBLANK([Minimum Age]),&quot;Ages &quot;&amp;[Maximum Age]&amp;&quot; and younger&quot;,&quot;Ages &quot;&amp;[Minimum Age]&amp;&quot; to &quot;&amp;[Maximum Age])))</Formula>
                            <FieldRefs>
                              <FieldRef Name=""MinimumAge""/>
                              <FieldRef Name=""MaximumAge""/>
                            </FieldRefs>
                          </Field>";

      listProducts.Fields.AddFieldAsXml(fieldXML, true, AddFieldOptions.DefaultValue);
      clientContext.ExecuteQuery();

      viewProducts.Update();

      clientContext.ExecuteQuery();

      viewProducts.ViewFields.Add("ProductDescription");
      viewProducts.ViewFields.Add("ProductImageUrl");
      viewProducts.Update();

      clientContext.ExecuteQuery();

    }

    static void PopulateProductsList() {

      Console.WriteLine();
      Console.WriteLine("Adding sample items to Products list");
      Console.WriteLine("------------------------------------");
      Console.WriteLine();


      // add a few sample products
      ListItem product1 = listProducts.AddItem(new ListItemCreationInformation());
      product1["Title"] = "Batman Action Figure";
      product1["ProductCode"] = "WP0001";
      product1["ProductListPrice"] = 14.95;
      product1["ProductDescription"] = "A super hero who sometimes plays the role of a dark knight.";
      product1["ProductColor"] = new string[] { "Black" };
      product1["Minimum Age"] = 7;
      product1["MaximumAge"] = 12;
      product1["ProductImageUrl"] = GetFieldUrlValue("WP0001", "Batman Action Figure");
      SetProductCategory(product1, termID_ActionFigures_MoviesAndTV_ToughGuys);
      product1.Update();
      Console.WriteLine("  Adding Batman Action Figure");
      clientContext.ExecuteQuery();


      ListItem product2 = listProducts.AddItem(new ListItemCreationInformation());
      product2["Title"] = "Captain America Action Figure";
      product2["ProductCode"] = "WP0002";
      product2["ProductListPrice"] = 12.95;
      product2["ProductDescription"] = "A super action figure that protects freedom and the American way of life.";
      product2["ProductColor"] = new string[] { "Red", "White", "Blue" };
      product2["MinimumAge"] = 7;
      product2["MaximumAge"] = 12;
      product2["ProductImageUrl"] = GetFieldUrlValue("WP0002", "Captain America Action Figure");
      SetProductCategory(product2, termID_ActionFigures_MoviesAndTV_ToughGuys);      
      product2.Update();
      Console.WriteLine("  Adding Captain America Action Figure");
      clientContext.ExecuteQuery();

      ListItem product3 = listProducts.AddItem(new ListItemCreationInformation());
      product3["Title"] = "GI Joe Action Figure";
      product3["ProductCode"] = "WP0003";
      product3["ProductListPrice"] = 14.95;
      product3["ProductDescription"] = "A classic action figure from the 1970s.";
      product3["ProductColor"] = new string[] { "Green" };
      product3["MinimumAge"] = null;
      product3["MaximumAge"] = null;
      product3["ProductImageUrl"] = GetFieldUrlValue("WP0003", "GI Joe Action Figure");
      SetProductCategory(product3, termID_ActionFigures_MoviesAndTV_ToughGuys);
      product3.Update();
      Console.WriteLine("  Adding GI Joe Action Figure");
      clientContext.ExecuteQuery();

      ListItem product4 = listProducts.AddItem(new ListItemCreationInformation());
      product4["Title"] = "Green Hulk Action Figure";
      product4["ProductCode"] = "WP0004";
      product4["ProductListPrice"] = 9.99;
      product4["ProductDescription"] = "An overly muscular action figure that strips naked when angry.";
      product4["ProductColor"] = "Green";
      product4["MinimumAge"] = 7;
      product4["MaximumAge"] = 12;
      product4["ProductImageUrl"] = GetFieldUrlValue("WP0004", "Green Hulk Action Figure");
      SetProductCategory(product4, termID_ActionFigures_MoviesAndTV_ToughGuys);
      product4.Update();
      Console.WriteLine("  Adding Green Hulk Action Figure");
      clientContext.ExecuteQuery();

      ListItem product5 = listProducts.AddItem(new ListItemCreationInformation());
      product5["Title"] = "Red Hulk Alter Ego Action Figure";
      product5["ProductCode"] = "WP0005";
      product5["ProductListPrice"] = 9.99;
      product5["ProductDescription"] = "A case of anabolic steroids with a most unfortunate outcome.";
      product5["ProductColor"] = "Red";
      product5["MinimumAge"] = 7;
      product5["MaximumAge"] = 12;
      product5["ProductImageUrl"] = GetFieldUrlValue("WP0005", "Red Hulk Alter Ego Action Figure");
      SetProductCategory(product5, termID_ActionFigures_MoviesAndTV_ToughGuys);
      product5.Update();
      Console.WriteLine("  Adding Red Hulk Alter Ego Action Figure");
      clientContext.ExecuteQuery();

      ListItem product6 = listProducts.AddItem(new ListItemCreationInformation());
      product6["Title"] = "Godzilla Action Figure";
      product6["ProductCode"] = "WP0006";
      product6["ProductListPrice"] = 19.95;
      product6["ProductDescription"] = "The classic and adorable action figure from those old Japanese movies.";
      product6["ProductColor"] = "Green";
      product6["MinimumAge"] = 10;
      product6["MaximumAge"] = null;
      product6["ProductImageUrl"] = GetFieldUrlValue("WP0006", "Godzilla Action Figure");
      SetProductCategory(product6, termID_ActionFigures_MoviesAndTV_ToughGuys);
      product6.Update();
      Console.WriteLine("  Adding Godzilla Action Figure");
      clientContext.ExecuteQuery();

      ListItem product7 = listProducts.AddItem(new ListItemCreationInformation());
      product7["Title"] = "Perry the Platypus Action Figure";
      product7["ProductCode"] = "WP0007";
      product7["ProductListPrice"] = 21.95;
      product7["ProductDescription"] = "A platypus who plays an overly intelligent detective sleuth on TV.";
      product7["ProductColor"] = new string[] { "Green", "Yellow" };
      product7["MinimumAge"] = null;
      product7["MaximumAge"] = null;
      product7["ProductImageUrl"] = GetFieldUrlValue("WP0007", "Perry the Platypus Action Figure");
      SetProductCategory(product7, termID_ActionFigures_MoviesAndTV_CuteAndHuggable);
      product7.Update();
      Console.WriteLine("  Adding Perry the Platypus Action Figure");
      clientContext.ExecuteQuery();

      ListItem product8 = listProducts.AddItem(new ListItemCreationInformation());
      product8["Title"] = "Green Angry Bird Action Figure";
      product8["ProductCode"] = "WP0008";
      product8["ProductListPrice"] = 4.95;
      product8["ProductDescription"] = "A funny looking green bird that really hates pigs.";
      product8["ProductColor"] = "Green";
      product8["MinimumAge"] = 5;
      product8["MaximumAge"] = 10;
      product8["ProductImageUrl"] = GetFieldUrlValue("WP0008", "Green Angry Bird Action Figure");
      SetProductCategory(product8, termID_ActionFigures_MoviesAndTV_CuteAndHuggable);
      product8.Update();
      Console.WriteLine("  Adding Green Angry Bird Action Figure");
      clientContext.ExecuteQuery();

      ListItem product9 = listProducts.AddItem(new ListItemCreationInformation());
      product9["Title"] = "Red Angry Bird Action Figure";
      product9["ProductCode"] = "WP0009";
      product9["ProductListPrice"] = 14.95;
      product9["ProductDescription"] = "A funny looking red bird that also hates pigs.";
      product9["ProductColor"] = "Red";
      product9["MinimumAge"] = 5;
      product9["MaximumAge"] = 10;
      product9["ProductImageUrl"] = GetFieldUrlValue("WP0009", "Red Angry Bird Action Figure");
      SetProductCategory(product9, termID_ActionFigures_MoviesAndTV_CuteAndHuggable);
      product9.Update();
      Console.WriteLine("  Adding Red Angry Bird Action Figure");
      clientContext.ExecuteQuery();

      ListItem product10 = listProducts.AddItem(new ListItemCreationInformation());
      product10["Title"] = "Phineas and Ferb Action Figure Set";
      product10["ProductCode"] = "WP0010";
      product10["ProductListPrice"] = 19.95;
      product10["ProductDescription"] = "The dynamic duo of the younger generation.";
      product10["ProductColor"] = new string[] { "Green", "Red" };
      product10["MinimumAge"] = 5;
      product10["MaximumAge"] = 51;
      product10["ProductImageUrl"] = GetFieldUrlValue("WP0010", "Phineas and Ferb Action Figure Set");
      SetProductCategory(product10, termID_ActionFigures_MoviesAndTV_CuteAndHuggable);
      product10.Update();
      Console.WriteLine("  Adding Phineas and Ferb Action Figure Set.");
      clientContext.ExecuteQuery();

      ListItem product11 = listProducts.AddItem(new ListItemCreationInformation());
      product11["Title"] = "Black Power Ranger Action Figure";
      product11["ProductCode"] = "WP0011";
      product11["ProductListPrice"] = 7.50;
      product11["ProductDescription"] = "A particularly violent action figure for violent children.";
      product11["ProductColor"] = new string[] { "Black", "White" };
      product11["MinimumAge"] = 8;
      product11["MaximumAge"] = 12;
      product11["ProductImageUrl"] = GetFieldUrlValue("WP0011", "Black Power Ranger Action Figure");
      SetProductCategory(product11, termID_ActionFigures_MoviesAndTV_ToughGuys);
      product11.Update();
      Console.WriteLine("  Adding Black Power Ranger Action Figure");
      clientContext.ExecuteQuery();

      ListItem product12 = listProducts.AddItem(new ListItemCreationInformation());
      product12["Title"] = "Woody Action Figure";
      product12["ProductCode"] = "WP0012";
      product12["ProductListPrice"] = 9.95;
      product12["ProductDescription"] = "The lovable, soft-spoken cowboy from Toy Story.";
      product12["ProductColor"] = new string[] { "Blue", "Yellow" };
      product12["MinimumAge"] = null;
      product12["MaximumAge"] = 12;
      product12["ProductImageUrl"] = GetFieldUrlValue("WP0012", "Woody Action Figure");
      SetProductCategory(product12, termID_ActionFigures_MoviesAndTV_CuteAndHuggable);
      product12.Update();
      Console.WriteLine("  Adding Woody Action Figure");
      clientContext.ExecuteQuery();

      ListItem product13 = listProducts.AddItem(new ListItemCreationInformation());
      product13["Title"] = "Spiderman Action Figure";
      product13["ProductCode"] = "WP0013";
      product13["ProductListPrice"] = 12.95;
      product13["ProductDescription"] = "The classic superhero who is quite the swinger.";
      product13["ProductColor"] = new string[] { "Red", "Blue" };
      product13["MinimumAge"] = 8;
      product13["MaximumAge"] = 12;
      product13["ProductImageUrl"] = GetFieldUrlValue("WP0013", "Spiderman Action Figure");
      SetProductCategory(product13, termID_ActionFigures_MoviesAndTV_ToughGuys);
      product13.Update();
      Console.WriteLine("  Adding Spiderman Action Figure");
      clientContext.ExecuteQuery();

      ListItem product14 = listProducts.AddItem(new ListItemCreationInformation());
      product14["Title"] = "Twitter Follower Action Figure";
      product14["ProductCode"] = "WP0014";
      product14["ProductListPrice"] = 1.00;
      product14["ProductDescription"] = "An inexpensive action figure you can never have too many of.";
      product14["ProductColor"] = new string[] { "Yellow", "Blue" };
      product14["MinimumAge"] = 12;
      product14["MaximumAge"] = null;
      product14["ProductImageUrl"] = GetFieldUrlValue("WP0014", "Twitter Follower Action Figure");
      SetProductCategory(product14, termID_ActionFigures_MoviesAndTV_CuteAndHuggable);
      product14.Update();
      Console.WriteLine("  Adding Twitter Follower Action Figure");
      clientContext.ExecuteQuery();

      ListItem product15 = listProducts.AddItem(new ListItemCreationInformation());
      product15["Title"] = "Crayloa Crayon Set";
      product15["ProductCode"] = "WP0015";
      product15["ProductListPrice"] = 2.49;
      product15["ProductDescription"] = "A very fun set of crayons in every color.";
      product15["ProductColor"] = new string[] { "Blue", "Red", "Green", "Yellow" };
      product15["MinimumAge"] = 10;
      product15["MaximumAge"] = null;
      product15["ProductImageUrl"] = GetFieldUrlValue("WP0015", "Crayloa Crayon Set");
      SetProductCategory(product15, termID_ArtsAndCrafts_DrawingAndColoring_Coloring);
      product15.Update();
      Console.WriteLine("  Adding Crayloa Crayon Set");
      clientContext.ExecuteQuery();

      ListItem product16 = listProducts.AddItem(new ListItemCreationInformation());
      product16["Title"] = "Sponge Bob Coloring Book";
      product16["ProductCode"] = "WP0016";
      product16["ProductListPrice"] = 2.95;
      product16["ProductDescription"] = "An action figure of America's most recognizable celebrity.";
      product16["ProductColor"] = "Yellow";
      product16["MinimumAge"] = 7;
      product16["MaximumAge"] = 12;
      product16["ProductImageUrl"] = GetFieldUrlValue("WP0016", "Sponge Bob Coloring Book");
      SetProductCategory(product16, termID_ArtsAndCrafts_DrawingAndColoring_Coloring);
      product16.Update();
      Console.WriteLine("  Adding Sponge Bob Coloring Book");
      clientContext.ExecuteQuery();

      ListItem product17 = listProducts.AddItem(new ListItemCreationInformation());
      product17["Title"] = "Easel with Supply Trays";
      product17["ProductCode"] = "WP0017";
      product17["ProductListPrice"] = 49.95;
      product17["ProductDescription"] = "A serious easel for serious young artists.";
      product17["ProductColor"] = "White";
      product17["MinimumAge"] = 12;
      product17["MaximumAge"] = null;
      product17["ProductImageUrl"] = GetFieldUrlValue("WP0017", "Easel with Supply Trays");
      SetProductCategory(product17, termID_ArtsAndCrafts_DrawingAndColoring_Painting);
      product17.Update();
      Console.WriteLine("  Adding Easel with Supply Trays");
      clientContext.ExecuteQuery();

      ListItem product18 = listProducts.AddItem(new ListItemCreationInformation());
      product18["Title"] = "Crate o' Crayons";
      product18["ProductCode"] = "WP0018";
      product18["ProductListPrice"] = 14.95;
      product18["ProductDescription"] = "More crayons that you can shake a stick at.";
      product18["ProductColor"] = new string[] { "Blue", "Red", "Green", "Yellow" };
      product18["MinimumAge"] = 7;
      product18["MaximumAge"] = 12;
      product18["ProductImageUrl"] = GetFieldUrlValue("WP0018", "Crate o' Crayons");
      SetProductCategory(product18, termID_ArtsAndCrafts_DrawingAndColoring_Coloring);
      product18.Update();
      Console.WriteLine("  Adding Crate o' Crayons");
      clientContext.ExecuteQuery();

      ListItem product19 = listProducts.AddItem(new ListItemCreationInformation());
      product19["Title"] = "Etch A Sketch";
      product19["ProductCode"] = "WP0019";
      product19["ProductListPrice"] = 12.95;
      product19["ProductDescription"] = "A strategic planning tool for the Romney campaign.";
      product19["ProductColor"] = "Red";
      product19["MinimumAge"] = 7;
      product19["MaximumAge"] = null;
      product19["ProductImageUrl"] = GetFieldUrlValue("WP0019", "Etch A Sketch");
      SetProductCategory(product19, termID_ArtsAndCrafts_DrawingAndColoring_Coloring);

      product19.Update();
      Console.WriteLine("  Adding Etch A Sketch");
      clientContext.ExecuteQuery();

      ListItem product20 = listProducts.AddItem(new ListItemCreationInformation());
      product20["Title"] = "Green Hornet";
      product20["ProductCode"] = "WP0020";
      product20["ProductListPrice"] = 24.95;
      product20["ProductDescription"] = "A fast car for crusin' the strip at night.";
      product20["ProductColor"] = "Green";
      product20["MinimumAge"] = 10;
      product20["MaximumAge"] = null;
      product20["ProductImageUrl"] = GetFieldUrlValue("WP0032", "Green Hornet");
      SetProductCategory(product20, termID_VehiclesAndRC_RCToys_Cars);
      product20.Update();
      Console.WriteLine("  Adding Green Hornet");
      clientContext.ExecuteQuery();

      ListItem product21 = listProducts.AddItem(new ListItemCreationInformation());
      product21["Title"] = "Red Wacky Stud Bumper";
      product21["ProductCode"] = "WP0021";
      product21["ProductListPrice"] = 24.95;
      product21["ProductDescription"] = "A great little vehicle for off road fun.";
      product21["ProductColor"] = "Red";
      product21["MinimumAge"] = 10;
      product21["MaximumAge"] = null;
      product21["ProductImageUrl"] = GetFieldUrlValue("WP0021", "Red Wacky Stud Bumper");
      SetProductCategory(product21, termID_VehiclesAndRC_RCToys_Trucks);
      product21.Update();
      Console.WriteLine("  Adding Red Wacky Stud Bumper");
      clientContext.ExecuteQuery();

      ListItem product22 = listProducts.AddItem(new ListItemCreationInformation());
      product22["Title"] = "Red Stomper Bully";
      product22["ProductCode"] = "WP0022";
      product22["ProductListPrice"] = 29.95;
      product22["ProductDescription"] = "A great toy that can crush and destroy all your other toys.";
      product22["ProductColor"] = "Red";
      product22["MinimumAge"] = 10;
      product22["MaximumAge"] = null;
      product22["ProductImageUrl"] = GetFieldUrlValue("WP0022", "Red Stomper Bully");
      SetProductCategory(product22, termID_VehiclesAndRC_RCToys_Trucks);
      product22.Update();
      Console.WriteLine("  Adding Red Stomper Bully");
      clientContext.ExecuteQuery();

      ListItem product23 = listProducts.AddItem(new ListItemCreationInformation());
      product23["Title"] = "Green Stomper Bully";
      product23["ProductCode"] = "WP0023";
      product23["ProductListPrice"] = 24.95;
      product23["ProductDescription"] = "A green alternative to crush and destroy the Red Stomper Bully.";
      product23["ProductColor"] = "Green";
      product23["MinimumAge"] = 10;
      product23["MaximumAge"] = null;
      product23["ProductImageUrl"] = GetFieldUrlValue("WP0023", "Green Stomper Bully");
      SetProductCategory(product23, termID_ActionFigures_MoviesAndTV_ToughGuys);
      product23.Update();
      Console.WriteLine("  Adding Green Stomper Bully");
      clientContext.ExecuteQuery();

      ListItem product24 = listProducts.AddItem(new ListItemCreationInformation());
      product24["Title"] = "Indy Race Car";
      product24["ProductCode"] = "WP0024";
      product24["ProductListPrice"] = 19.95;
      product24["ProductDescription"] = "The fastest remote control race car on the market today.";
      product24["ProductColor"] = "Black";
      product24["MinimumAge"] = 10;
      product24["MaximumAge"] = null;
      product24["ProductImageUrl"] = GetFieldUrlValue("WP0024", "Indy Race Car");
      SetProductCategory(product24, termID_VehiclesAndRC_RCToys_Cars);
      product24.Update();
      Console.WriteLine("  Adding Indy Race Car");
      clientContext.ExecuteQuery();

      ListItem product25 = listProducts.AddItem(new ListItemCreationInformation());
      product25["Title"] = "Turbo-boost Speedboat";
      product25["ProductCode"] = "WP0025";
      product25["ProductListPrice"] = 32.95;
      product25["ProductDescription"] = "The preferred water vehicle of gun runners and drug kingpins.";
      product25["ProductColor"] = "Red";
      product25["MinimumAge"] = 21;
      product25["MaximumAge"] = null;
      product25["ProductImageUrl"] = GetFieldUrlValue("WP0025", "Turbo-boost Speedboat");
      SetProductCategory(product25, termID_VehiclesAndRC_RCToys_Boats);
      product25.Update();
      Console.WriteLine("  Adding Turbo-boost Speedboat");
      clientContext.ExecuteQuery();

      ListItem product26 = listProducts.AddItem(new ListItemCreationInformation());
      product26["Title"] = "Sandpiper Prop Plane";
      product26["ProductCode"] = "WP0026";
      product26["ProductListPrice"] = 24.95;
      product26["ProductDescription"] = "A simple RC prop plane for younger pilots.";
      product26["ProductColor"] = "White";
      product26["MinimumAge"] = 15;
      product26["MaximumAge"] = null;
      product26["ProductImageUrl"] = GetFieldUrlValue("WP0026", "Sandpiper Prop Plane");
      SetProductCategory(product26, termID_VehiclesAndRC_RCToys_Planes);
      product26.Update();
      Console.WriteLine("  Adding Sandpiper Prop Plane");
      clientContext.ExecuteQuery();

      ListItem product27 = listProducts.AddItem(new ListItemCreationInformation());
      product27["Title"] = "Flying Badger";
      product27["ProductCode"] = "WP0027";
      product27["ProductListPrice"] = 27.95;
      product27["ProductDescription"] = "A tough fighter plane to root out evil anywhere it lives.";
      product27["ProductColor"] = "Blue";
      product27["MinimumAge"] = 15;
      product27["MaximumAge"] = null;
      product27["ProductImageUrl"] = GetFieldUrlValue("WP0027", "Flying Badger");
      SetProductCategory(product27, termID_VehiclesAndRC_RCToys_Planes);
      product27.Update();
      Console.WriteLine("  Adding Flying Badger");
      clientContext.ExecuteQuery();

      ListItem product28 = listProducts.AddItem(new ListItemCreationInformation());
      product28["Title"] = "Red Barron von Richthofen";
      product28["ProductCode"] = "WP0028";
      product28["ProductListPrice"] = 32.95;
      product28["ProductDescription"] = "A classic RC plane to hunt down and terminate Snoopy.";
      product28["ProductColor"] = "Red";
      product28["MinimumAge"] = 15;
      product28["MaximumAge"] = null;
      product28["ProductImageUrl"] = GetFieldUrlValue("WP0028", "Red Barron von Richthofen");
      SetProductCategory(product28, termID_VehiclesAndRC_RCToys_Planes);
      product28.Update();
      Console.WriteLine("  Adding Red Barron von Richthofen");
      clientContext.ExecuteQuery();

      ListItem product29 = listProducts.AddItem(new ListItemCreationInformation());
      product29["Title"] = "Flying Squirrel";
      product29["ProductCode"] = "WP0029";
      product29["ProductListPrice"] = 69.95;
      product29["ProductDescription"] = "A stealthy remote control plane that flies on the down-low and under the radar.";
      product29["ProductColor"] = "Grey";
      product29["MinimumAge"] = 18;
      product29["MaximumAge"] = null;
      product29["ProductImageUrl"] = GetFieldUrlValue("WP0029", "Flying Squirrel");
      SetProductCategory(product29, termID_VehiclesAndRC_RCToys_Planes);
      product29.Update();
      Console.WriteLine("  Adding Flying Squirrel");
      clientContext.ExecuteQuery();

      ListItem product30 = listProducts.AddItem(new ListItemCreationInformation());
      product30["Title"] = "FOX News Chopper";
      product30["ProductCode"] = "WP0030";
      product30["ProductListPrice"] = 29.95;
      product30["ProductDescription"] = "A new chopper which can generate new events on demand.";
      product30["ProductColor"] = "Blue";
      product30["MinimumAge"] = 18;
      product30["MaximumAge"] = null;
      product30["ProductImageUrl"] = GetFieldUrlValue("WP0030", "FOX News Chopper");
      SetProductCategory(product30, termID_VehiclesAndRC_RCToys_Hellicopters);
      product30.Update();
      Console.WriteLine("  Adding FOX News Chopper");
      clientContext.ExecuteQuery();

      ListItem product31 = listProducts.AddItem(new ListItemCreationInformation());
      product31["Title"] = "Seal Team 6 Helicopter";
      product31["ProductCode"] = "WP0031";
      product31["ProductListPrice"] = 59.95;
      product31["ProductDescription"] = "A serious helicopter that can open up a can of whoop-ass when required.";
      product31["ProductColor"] = "Green";
      product31["MinimumAge"] = 18;
      product31["MaximumAge"] = null;
      product31["ProductImageUrl"] = GetFieldUrlValue("WP0031", "Seal Team 6 Helicopter");
      SetProductCategory(product31, termID_VehiclesAndRC_RCToys_Hellicopters);
      product31.Update();
      Console.WriteLine("  Adding Seal Team 6 Helicopter");
      clientContext.ExecuteQuery();

      ListItem product32 = listProducts.AddItem(new ListItemCreationInformation());
      product32["Title"] = "Personal Commuter Chopper";
      product32["ProductCode"] = "WP0032";
      product32["ProductListPrice"] = 99.95;
      product32["ProductDescription"] = "A partially-test remote control device that can actually carry real people.";
      product32["ProductColor"] = "Red";
      product32["MinimumAge"] = 18;
      product32["MaximumAge"] = null;
      product32["ProductImageUrl"] = GetFieldUrlValue("WP0032", "Personal Commuter Chopper");
      SetProductCategory(product32, termID_VehiclesAndRC_RCToys_Hellicopters);
      product32.Update();
      Console.WriteLine("  Adding Personal Commuter Chopper");
      clientContext.ExecuteQuery();

      Console.WriteLine();
      Console.WriteLine("  Loading of product items has completed");
      Console.WriteLine();
    }


    private static FieldUrlValue GetFieldUrlValue(string ProductCode, string ImageDescription) { 
      FieldUrlValue urlValue = new FieldUrlValue();
      urlValue.Url = listProductImagesUrl + "/" + ProductCode + ".jpg";
      urlValue.Description = ImageDescription;
      return urlValue;
    }

    private static void SetProductCategory(ListItem item, Guid termID) {
      TaxonomyFieldValue taxonomyFieldValue = new TaxonomyFieldValue();
      taxonomyFieldValue.TermGuid = termID.ToString();
      fieldProductCategory.SetFieldValueByValue(item, taxonomyFieldValue);
    }

    
  }
}
