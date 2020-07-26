// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

using System.Collections.Generic;

namespace Constants
{
  public static class ProductCatalogAPI
  {
    public const string CategoryUrl = "https://localhost:5050/api/Categories";
    public const string ProductUrl = "https://localhost:5050/api/Products";
    public const string ProductReadScope = "api://17758935-3189-41f4-b4cc-4f5d85b6ee2f/Product.Read";
    public const string ProductWriteScope = "api://17758935-3189-41f4-b4cc-4f5d85b6ee2f/Product.Write";
    public const string CategoryReadScope = "api://17758935-3189-41f4-b4cc-4f5d85b6ee2f/Category.Read";
    public const string CategoryWriteScope = "api://17758935-3189-41f4-b4cc-4f5d85b6ee2f/Category.Write";

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