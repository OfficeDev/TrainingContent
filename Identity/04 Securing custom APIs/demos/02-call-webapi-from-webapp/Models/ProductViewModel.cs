using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ProductCatalogWeb.Models
{
  public class ProductViewModel
  {
    public string ProductName { get; set; }
    public int CategoryId { get; set; }
    public List<Category> Categories { get; set; }
  }
}