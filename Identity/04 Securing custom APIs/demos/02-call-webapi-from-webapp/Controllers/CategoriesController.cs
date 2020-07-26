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
  public class CategoriesController : Controller
  {
    private ITokenAcquisition tokenAcquisition;
    string[] scopes = Constants.ProductCatalogAPI.SCOPES.ToArray();
    string url = "https://localhost:5050/api/Categories";

    public CategoriesController(ITokenAcquisition tokenAcquisition)
    {
      this.tokenAcquisition = tokenAcquisition;
    }

    [AuthorizeForScopes(Scopes = new[] { Constants.ProductCatalogAPI.CategoryReadScope })]
    public async Task<ActionResult> Index()
    {
      var client = new HttpClient();

      var accessToken = await tokenAcquisition.GetAccessTokenForUserAsync(Constants.ProductCatalogAPI.SCOPES);
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

      var json = await client.GetStringAsync(url);

      var serializerOptions = new JsonSerializerOptions
      {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
      };
      var categories = JsonSerializer.Deserialize(json, typeof(List<Category>), serializerOptions) as List<Category>;
      return View(categories);
    }

    [AuthorizeForScopes(Scopes = new[] { Constants.ProductCatalogAPI.CategoryWriteScope })]
    public ActionResult Create()
    {
      return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [AuthorizeForScopes(Scopes = new[] { Constants.ProductCatalogAPI.CategoryWriteScope })]
    public async Task<ActionResult> Create([Bind("Name")] Category category)
    {
      if (ModelState.IsValid)
      {
        var newCat = new Category() { Name = category.Name };

        var client = new HttpClient();

        var accessToken = await tokenAcquisition.GetAccessTokenForUserAsync(Constants.ProductCatalogAPI.SCOPES);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var content = new StringContent(JsonSerializer.Serialize(newCat, typeof(Category)), Encoding.UTF8, "application/json");
        await client.PostAsync(url, content);

        return RedirectToAction("Index");
      }
      return View(category);
    }
  }
}