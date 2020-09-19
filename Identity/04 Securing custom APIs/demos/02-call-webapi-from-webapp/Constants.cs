// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

using System.Collections.Generic;

namespace Constants
{
  public static class ProductCatalogAPI
  {
    public const string CategoryUrl = "https://localhost:5050/api/Categories";
    public const string ProductUrl = "https://localhost:5050/api/Products";
    public const string ProductReadScope = "api://[web-api-client-id/Product.Read";
    public const string ProductWriteScope = "api://[web-api-client-id/Product.Write";
    public const string CategoryReadScope = "api://[web-api-client-id/Category.Read";
    public const string CategoryWriteScope = "api://[web-api-client-id/Category.Write";

    public static List<string> SCOPES = new List<string>()
    {
      ProductReadScope, ProductWriteScope, CategoryReadScope, CategoryWriteScope
    };
  }

  public static class ClaimIds
  {
    public const string UserObjectId = "http://schemas.microsoft.com/identity/claims/objectidentifier";
    public const string TenantId = "http://schemas.microsoft.com/identity/claims/tenantid";
  }
}