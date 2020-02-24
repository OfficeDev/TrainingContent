using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using UserGroupRole.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
//using Microsoft.Identity.Client;

namespace UserGroupRole.Controllers
{
  [Authorize(Roles =("36079258-b391-4254-add1-be98e1ecc225"))]
  public class ProductsController : Controller
  {
    SampleData data;

    public ProductsController(SampleData data)
    {
      this.data = data;
    }

    public async Task<ActionResult> Index()
    {
      return View(data.Products);
    }

    // public async Task<ActionResult> Create()
    // {
    //   // get list of categories for dropdown
    //   HttpClient client = new HttpClient();
    //   client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", await GetTokenForUser());
    //   string json = await client.GetStringAsync(Constants.ProductCatalogAPI.CategoryUrl);

    //   var serializerOptions = new JsonSerializerOptions
    //   {
    //     PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    //   };
    //   var categories = JsonSerializer.Deserialize(json, typeof(List<Category>), serializerOptions) as List<Category>;

    //   var viewModel = new ProductViewModel()
    //   {
    //     Categories = categories
    //   };

    //   return View(viewModel);
    // }

    // [HttpPost]
    // [ValidateAntiForgeryToken]
    // public async Task<ActionResult> Create([Bind("ProductName", "CategoryId")] ProductViewModel model)
    // {
    //   if (ModelState.IsValid)
    //   {
    //     var newProd = new Product()
    //     {
    //       Name = model.ProductName,
    //       Category = new Category { Id = model.CategoryId }
    //     };

    //     HttpClient client = new HttpClient();
    //     client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", await GetTokenForUser());

    //     var content = new StringContent(JsonSerializer.Serialize(newProd, typeof(Product)), Encoding.UTF8, "application/json");
    //     await client.PostAsync(Constants.ProductCatalogAPI.ProductUrl, content);

    //     return RedirectToAction("Index");
    //   }
    //   return View(model);
    // }
  }
}
