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

namespace ProductCatalogWeb.Controllers
{
  [Authorize]
  public class ProductsController : Controller
  {
    private IConfidentialClientApplication application;

    public ProductsController(IConfidentialClientApplication application)
    {
      this.application = application;
    }

    private async Task<string> GetTokenForUser()
    {
      // Get the account.
      string userObjectId = User.FindFirstValue(Constants.ClaimIds.UserObjectId);
      string tenantId = User.FindFirstValue(Constants.ClaimIds.TenantId);
      var accountIdentifier = $"{userObjectId}.{tenantId}";
      IAccount account = await application.GetAccountAsync(accountIdentifier);

      var authResult = await application.AcquireTokenSilent(Constants.ProductCatalogAPI.SCOPES.ToArray(), account).ExecuteAsync();
      return authResult.AccessToken;
    }

    public async Task<ActionResult> Index()
    {
      HttpClient client = new HttpClient();
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", await GetTokenForUser());
      string json = await client.GetStringAsync(Constants.ProductCatalogAPI.ProductUrl);

      var serializerOptions = new JsonSerializerOptions
      {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
      };
      var products = JsonSerializer.Deserialize(json, typeof(List<Product>), serializerOptions) as List<Product>;
      return View(products);
    }

    public async Task<ActionResult> Create()
    {
      // get list of categories for dropdown
      HttpClient client = new HttpClient();
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", await GetTokenForUser());
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
    public async Task<ActionResult> Create([Bind("ProductName", "CategoryId")] ProductViewModel model)
    {
      if (ModelState.IsValid)
      {
        var newProd = new Product()
        {
          Name = model.ProductName,
          Category = new Category { Id = model.CategoryId }
        };

        HttpClient client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", await GetTokenForUser());

        var content = new StringContent(JsonSerializer.Serialize(newProd, typeof(Product)), Encoding.UTF8, "application/json");
        await client.PostAsync(Constants.ProductCatalogAPI.ProductUrl, content);

        return RedirectToAction("Index");
      }
      return View(model);
    }
  }
}