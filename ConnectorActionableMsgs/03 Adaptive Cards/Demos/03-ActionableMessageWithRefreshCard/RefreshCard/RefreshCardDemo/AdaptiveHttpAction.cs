﻿/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */
using AdaptiveCards;
using Newtonsoft.Json;
using System.Collections.Specialized;
using System.ComponentModel;

namespace WebApplication1
{
  public class AdaptiveHttpAction : AdaptiveAction
  {
    public const string TypeName = "Action.Http";

    public override string Type { get; set; } = TypeName;

    [JsonProperty("Url", Required=Required.Always)]
    public string UrlString { get; set; }

    [JsonProperty(Required = Required.Always)]
    public string Method { get; set; }

    [DefaultValue(null)]
    [JsonRequired]
    public string Body { get; set; }

    public StringDictionary Headers { get; set; }

    public AdaptiveHttpAction()
    {
      Headers = new StringDictionary();
    }
  }
}
