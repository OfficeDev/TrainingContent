// -----------------------------------------------------------------------
// <copyright file="SwiftPotentialAction.cs" company="Microsoft">
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
    /// Swift Potential Action object
    /// </summary>
    public class SwiftPotentialAction
    {
        /// <summary>
        /// Gets or sets context
        /// </summary>
        [JsonProperty(PropertyName = "@context")]
        public string Context { get; set; }

        /// <summary>
        /// Gets or sets type
        /// </summary>
        [JsonProperty(PropertyName = "@type")]
        public string Type { get; set; }

        /// <summary>
        /// Gets or sets name
        /// </summary>
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets target
        /// </summary>
        [JsonProperty(PropertyName = "targets")]
        public SwiftTarget[] Targets { get; set; }
    }
}
