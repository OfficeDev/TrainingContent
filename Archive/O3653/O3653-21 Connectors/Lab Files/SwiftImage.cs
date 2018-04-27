// -----------------------------------------------------------------------
// <copyright file="SwiftImage.cs" company="Microsoft">
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
    /// Swift imgae object
    /// </summary>
    public class SwiftImage
    {
        /// <summary>
        /// Gets or sets title
        /// </summary>
        [JsonProperty(PropertyName = "title")]
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets iamge
        /// </summary>
        [JsonProperty(PropertyName = "image")]
        public string Image { get; set; }
    }
}
