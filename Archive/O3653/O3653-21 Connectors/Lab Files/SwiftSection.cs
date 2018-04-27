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
    public class SwiftSection
    {
        /// <summary>
        /// Gets or sets title
        /// </summary>
        [JsonProperty(PropertyName = "title")]
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets text
        /// </summary>
        [JsonProperty(PropertyName = "text")]
        public string Text { get; set; }

        /// <summary>
        /// Gets or sets title
        /// </summary>
        [JsonProperty(PropertyName = "facts")]
        public SwiftFact[] Facts { get; set; }

        /// <summary>
        /// Gets or sets images
        /// </summary>
        [JsonProperty(PropertyName = "images")]
        public SwiftImage[] Images { get; set; }

        /// <summary>
        /// Getso or sets activityTitile
        /// </summary>
        [JsonProperty(PropertyName = "activityTitle")]
        public string ActivityTitle { get; set; }

        /// <summary>
        /// Gets or sets activitySubtitle
        /// </summary>
        [JsonProperty(PropertyName = "activitySubtitle")]
        public string ActivitySubtitle { get; set; }

        /// <summary>
        /// Gets or sets activityText
        /// </summary>
        [JsonProperty(PropertyName = "activityText")]
        public string ActivityText { get; set; }

        /// <summary>
        /// Gets or sets activityImage
        /// </summary>
        [JsonProperty(PropertyName = "activityImage")]
        public string ActivityImage { get; set; }

        /// <summary>
        /// Gets or sets potentialAction
        /// </summary>
        [JsonProperty(PropertyName = "potentialAction")]
        public SwiftPotentialAction[] PotentialActions { get; set; }
    }
}
