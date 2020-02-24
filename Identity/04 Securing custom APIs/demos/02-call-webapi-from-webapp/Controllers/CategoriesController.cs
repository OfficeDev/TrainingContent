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
  public class CategoriesController : Controller
  {
    private IConfidentialClientApplication application;

    public CategoriesController(IConfidentialClientApplication application)
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
      string json = await client.GetStringAsync(Constants.ProductCatalogAPI.CategoryUrl);

      var serializerOptions = new JsonSerializerOptions
      {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
      };
      var categories = JsonSerializer.Deserialize(json, typeof(List<Category>), serializerOptions) as List<Category>;
      return View(categories);
    }

    public ActionResult Create()
    {
      return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<ActionResult> Create([Bind("Name")] Category category)
    {
      if (ModelState.IsValid)
      {
        var newCat = new Category() { Name = category.Name };

        HttpClient client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", await GetTokenForUser());

        var content = new StringContent(JsonSerializer.Serialize(newCat, typeof(Category)), Encoding.UTF8, "application/json");
        await client.PostAsync(Constants.ProductCatalogAPI.CategoryUrl, content);

        return RedirectToAction("Index");
      }
      return View(category);
    }
  }
}