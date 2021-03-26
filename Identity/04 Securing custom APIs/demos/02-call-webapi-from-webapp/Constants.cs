// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

using System.Collections.Generic;

namespace Constants
{
  public static class ProductCatalogAPI
  {
    public const string CategoryUrl = "https://localhost:5050/api/Categories";
    public const string ProductUrl = "https://localhost:5050/api/Products";
    public const string ProductReadScope = "api://a17cd71a-6a90-4bf0-9231-34bf600670e4/Product.Read";
    public const string ProductWriteScope = "api://a17cd71a-6a90-4bf0-9231-34bf600670e4/Product.Write";
    public const string CategoryReadScope = "api://a17cd71a-6a90-4bf0-9231-34bf600670e4/Category.Read";
    public const string CategoryWriteScope = "api://a17cd71a-6a90-4bf0-9231-34bf600670e4/Category.Write";

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