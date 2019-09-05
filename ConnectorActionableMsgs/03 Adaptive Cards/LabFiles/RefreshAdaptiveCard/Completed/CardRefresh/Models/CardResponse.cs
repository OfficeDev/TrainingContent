/*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CardRefresh.Models
{
  public class CardResponse
  {
    public string Comment { get; set; }
    public string CachedComments { get; set; }
  }
}