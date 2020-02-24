using System.Collections.Generic;

namespace Constants
{
  public static class ProductCatalogAPI
  {
    public const string CategoryUrl = "https://localhost:5050/api/Categories";
    public const string ProductUrl = "https://localhost:5050/api/Products";

    public static List<string> SCOPES = new List<string>()
    {
      "api://97a1ab8b-9ede-41fc-8370-7199a4c16224/Product.Read",
      "api://97a1ab8b-9ede-41fc-8370-7199a4c16224/Product.Write",
      "api://97a1ab8b-9ede-41fc-8370-7199a4c16224/Category.Read",
      "api://97a1ab8b-9ede-41fc-8370-7199a4c16224/Category.Write"
    };
  }

  public static class ClaimIds
  {
    public const string UserObjectId = "http://schemas.microsoft.com/identity/claims/objectidentifier";
    public const string TenantId = "http://schemas.microsoft.com/identity/claims/tenantid";
  }
}