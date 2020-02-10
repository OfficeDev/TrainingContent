using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductCatalog.Models;

namespace ProductCatalog.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/[controller]")]
  public class ProductsController : ControllerBase
  {
    SampleData data;

    public ProductsController(SampleData data)
    {
      this.data = data;
    }

    public List<Product> GetAllProducts()
    {
      HttpContext.VerifyUserHasAnyAcceptedScope(new string[] { "Product.Read" });
      return data.Products;
    }

    [HttpGet("{id}")]
    public Product GetProduct(int id)
    {
      HttpContext.VerifyUserHasAnyAcceptedScope(new string[] { "Product.Read" });
      return data.Products.FirstOrDefault(p => p.Id.Equals(id));
    }

    [HttpPost]
    public ActionResult CreateProduct([FromBody] Product newProduct)
    {
      HttpContext.VerifyUserHasAnyAcceptedScope(new string[] { "Product.Write" });
      if (string.IsNullOrEmpty(newProduct.Name))
      {
        return BadRequest("Product Name cannot be empty");
      }
      if (newProduct.Category == null)
      {
        return BadRequest("Product Category cannot be empty");
      }
      newProduct.Id = (data.Products.Max(p => p.Id) + 1);
      data.Products.Add(newProduct);
      return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, newProduct);
    }
  }
}
