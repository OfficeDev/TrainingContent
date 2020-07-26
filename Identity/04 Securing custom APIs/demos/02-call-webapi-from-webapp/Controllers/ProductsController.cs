// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using ProductCatalogWeb.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Microsoft.Identity.Web;

namespace ProductCatalogWeb.Controllers
{
  [Authorize]
  public class ProductsController : Controller
  {
    private ITokenAcquisition tokenAcquisition;

    public ProductsController(ITokenAcquisition tokenAcquisition)
    {
      this.tokenAcquisition = tokenAcquisition;
    }


    [AuthorizeForScopes(Scopes = new[] { Constants.ProductCatalogAPI.ProductReadScope })]
    public async Task<ActionResult> Index()
    {
      var client = new HttpClient();

      var accessToken = await tokenAcquisition.GetAccessTokenForUserAsync(Constants.ProductCatalogAPI.SCOPES);
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

      string json = await client.GetStringAsync(Constants.ProductCatalogAPI.ProductUrl);

      var serializerOptions = new JsonSerializerOptions
      {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
      };
      var products = JsonSerializer.Deserialize(json, typeof(List<Product>), serializerOptions) as List<Product>;
      return View(products);
    }

    [AuthorizeForScopes(Scopes = new[] { Constants.ProductCatalogAPI.ProductWriteScope })]
    public async Task<ActionResult> Create()
    {
      // get list of categories for dropdown
      var client = new HttpClient();

      var accessToken = await tokenAcquisition.GetAccessTokenForUserAsync(Constants.ProductCatalogAPI.SCOPES);
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

      string json = await client.GetStringAsync(Constants.ProductCatalogAPI.CategoryUrl);

      var serializerOptions = new JsonSerializerOptions
      {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
      };
      var categories = JsonSerializer.Deserialize(json, typeof(List<Category>), serializerOptions) as List<Category>;

      var viewModel = new ProductViewModel()
      {
        Categories = categories
      };

      return View(viewModel);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [AuthorizeForScopes(Scopes = new[] { Constants.ProductCatalogAPI.ProductWriteScope })]
    public async Task<ActionResult> Create([Bind("ProductName", "CategoryId")] ProductViewModel model)
    {
      if (ModelState.IsValid)
      {
        var newProd = new Product()
        {
          Name = model.ProductName,
          Category = new Category { Id = model.CategoryId }
        };

        var client = new HttpClient();

        var accessToken = await tokenAcquisition.GetAccessTokenForUserAsync(Constants.ProductCatalogAPI.SCOPES);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var content = new StringContent(JsonSerializer.Serialize(newProd, typeof(Product)), Encoding.UTF8, "application/json");
        await client.PostAsync(Constants.ProductCatalogAPI.ProductUrl, content);

        return RedirectToAction("Index");
      }
      return View(model);
    }
  }
}