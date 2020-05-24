// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

namespace ProductCatalog.Models
{
  public class Product
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public Category Category { get; set; }
  }
}