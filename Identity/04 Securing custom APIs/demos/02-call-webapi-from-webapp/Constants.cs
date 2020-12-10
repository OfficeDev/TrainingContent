// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

using System.Collections.Generic;

namespace Constants
{
  public static class ProductCatalogAPI
  {
    public const string CategoryUrl = "https://localhost:5050/api/Categories";
    public const string ProductUrl = "https://localhost:5050/api/Products";
    public const string ProductReadScope = "api://9a6458f0-c1c7-4e19-b9b1-b4ef888d02e6/Product.Read";
    public const string ProductWriteScope = "api://9a6458f0-c1c7-4e19-b9b1-b4ef888d02e6/Product.Write";
    public const string CategoryReadScope = "api://9a6458f0-c1c7-4e19-b9b1-b4ef888d02e6/Category.Read";
    public const string CategoryWriteScope = "api://9a6458f0-c1c7-4e19-b9b1-b4ef888d02e6/Category.Write";

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