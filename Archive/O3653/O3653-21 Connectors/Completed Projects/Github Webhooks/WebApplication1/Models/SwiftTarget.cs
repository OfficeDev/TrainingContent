// -----------------------------------------------------------------------
// <copyright file="SwiftSection.cs" company="Microsoft">
//   Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// --------

namespace Microsoft.Connectors.Common.Card.Formatting.ObjectModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Newtonsoft.Json;

    /// <summary>
    /// Swift Section object
    /// </summary>
    public class SwiftTarget
    {
        /// <summary>
        /// Gets or sets os
        /// </summary>
        [JsonProperty(PropertyName = "os")]
        public string OS { get; set; }

        /// <summary>
        /// Gets or sets uri
        /// </summary>
        [JsonProperty(PropertyName = "uri")]
        public string URI { get; set; }
    }
}
