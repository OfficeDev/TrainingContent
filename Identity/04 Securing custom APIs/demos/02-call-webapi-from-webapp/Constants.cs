// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

using System.Collections.Generic;

namespace Constants
{
  public static class ProductCatalogAPI
  {
    public const string CategoryUrl = "https://localhost:5050/api/Categories";
    public const string ProductUrl = "https://localhost:5050/api/Products";

    public static List<string> SCOPES = new List<string>()
    {
      "api://2d08d9ad-1947-4d1e-a68e-8bfdc557f697/Product.Read",
      "api://2d08d9ad-1947-4d1e-a68e-8bfdc557f697/Product.Write",
      "api://2d08d9ad-1947-4d1e-a68e-8bfdc557f697/Category.Read",
      "api://2d08d9ad-1947-4d1e-a68e-8bfdc557f697/Category.Write",
    };
  }

  public static class ClaimIds
  {
    public const string UserObjectId = "http://schemas.microsoft.com/identity/claims/objectidentifier";
    public const string TenantId = "http://schemas.microsoft.com/identity/claims/tenantid";
  }
}