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
  public class Comment
  {
    public string ActionPerformer { get; set; }
    public DateTime CommentDate { get; set; }
    public string CommentText { get; set; }
  }
}