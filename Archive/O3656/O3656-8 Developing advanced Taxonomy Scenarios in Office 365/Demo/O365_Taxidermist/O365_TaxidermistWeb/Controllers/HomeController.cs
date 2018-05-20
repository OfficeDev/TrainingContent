using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace O365_TaxidermistWeb.Controllers {
  public class HomeController : Controller {

    [SharePointContextFilter]
    public ActionResult Index(string SPHostWeb) {
      SiteCollectionModel model = TaxonomyManager.GetSiteCollectionModel(SPHostWeb);
      return View(model);
    }

    [SharePointContextFilter]
    public ActionResult CreateTermset() {
       return View();
    }
 
    [HttpPost]
    public ActionResult CreatePrivateTermsetGroup() {
      TaxonomyManager.CreatePrivateGroup();
      // redirect back to main view for controller 
      return RedirectToAction("Index", new { SPHostUrl = this.HttpContext.Request["SPHostUrl"] });
    }

    
    [HttpPost]
    public ActionResult CreateSimpleTermset() {
      TaxonomyManager.CreateSimpleTermset();
      // redirect back to main view for controller 
      return RedirectToAction("Index", new { SPHostUrl = this.HttpContext.Request["SPHostUrl"] });
    }

    
    [HttpPost]
    public ActionResult CreateCustomerGeographyTermset() {
      TaxonomyManager.CreateCustomerGeographyTermset();
      // redirect back to main view for controller 
      return RedirectToAction("Index", new { SPHostUrl = this.HttpContext.Request["SPHostUrl"] });
    }

    [HttpPost]
    public ActionResult CreateProductCategoriesTermset() {
      TaxonomyManager.CreateProductCategoriesTermset();
      // redirect back to main view for controller 
      return RedirectToAction("Index", new { SPHostUrl = this.HttpContext.Request["SPHostUrl"] });
    }
    
    
  }
}
