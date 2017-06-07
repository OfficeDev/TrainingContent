// -----------------------------------------------------------------------
// <copyright file="SwiftFact.cs" company="Microsoft">
//   Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// --------

namespace Microsoft.Connectors.Common.Card.Formatting.ObjectModel
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Newtonsoft.Json;

    /// <summary>
    /// Swift fact object
    /// </summary>
    public class SwiftFact
    {
        /// <summary>
        /// Gets or sets name
        /// </summary>
        [JsonProperty(PropertyName = "name", Required = Required.Always)]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets value
        /// </summary>
        [JsonProperty(PropertyName = "value")]
        public string Value { get; set; }
    }
}
