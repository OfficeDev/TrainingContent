using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductCatalog.Models;

namespace ProductCatalog
{
  [Authorize]
  [ApiController]
  [Route("api/[controller]")]
  public class CategoriesController : ControllerBase
  {
    SampleData data;

    public CategoriesController(SampleData data)
    {
      this.data = data;
    }

    public List<Category> GetAllCategories()
    {
      HttpContext.VerifyUserHasAnyAcceptedScope(new string[] { "Category.Read" });
      return data.Categories;
    }

    [HttpGet("{id}")]
    public Category GetCategory(int id)
    {
      HttpContext.VerifyUserHasAnyAcceptedScope(new string[] { "Category.Read" });
      return data.Categories.FirstOrDefault(p => p.Id.Equals(id));
    }

    [HttpPost]
    public ActionResult CreateCategory([FromBody] Product newCategory)
    {
      HttpContext.VerifyUserHasAnyAcceptedScope(new string[] { "Category.Write" });
      if (string.IsNullOrEmpty(newCategory.Name))
      {
        return BadRequest("Product Name cannot be empty");
      }

      newCategory.Id = (data.Categories.Max(c => c.Id) + 1);
      data.Products.Add(newCategory);

      return CreatedAtAction(nameof(GetCategory), new { id = newCategory.Id }, newCategory);
    }
  }

}