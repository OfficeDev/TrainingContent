// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using UserGroupRole.Models;

namespace UserGroupRole.Controllers
{
  [Authorize(Roles = ("ProductViewers,ProductAdministrators"))]
  public class ProductsController : Controller
  {
    SampleData data;

    public ProductsController(SampleData data)
    {
      this.data = data;
    }

    public ActionResult Index()
    {
      return View(data.Products);
    }

    [Authorize(Roles = ("ProductAdministrators"))]
    public ActionResult Create()
    {
      var viewModel = new ProductViewModel()
      {
        Categories = data.Categories
      };
      return View(viewModel);
    }

    [Authorize(Roles = ("ProductAdministrators"))]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public ActionResult Create([Bind("ProductName", "CategoryId")] ProductViewModel model)
    {
      if (ModelState.IsValid)
      {
        data.Products.Add(new Product()
        {
          ID = data.Products.Max(p => p.ID) + 1,
          Name = model.ProductName,
          Category = data.Categories.FirstOrDefault(c => c.ID == model.CategoryId)
        });
        return RedirectToAction("Index");
      }
      return View(model);
    }
  }
}