// -----------------------------------------------------------------------
// <copyright file="SwiftModel.cs" company="Microsoft">
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
    /// Swift format model
    /// </summary>
    public class SwiftModel
    {
        /// <summary>
        /// Gets or sets type
        /// </summary>
        [JsonProperty(PropertyName = "@type")]
        public string type
        {
            get
            {
                return "MessageCard";
            }
        }

        /// <summary>
        /// Gets or sets context
        /// </summary>
        [JsonProperty(PropertyName = "@context")]
        public string context
        {
            get
            {
                return "http://schema.org/extensions";
            }
        }


        /// <summary>
        /// Gets or sets summary
        /// </summary>
        [JsonProperty(PropertyName = "summary")]
        public string Summary { get; set; }

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
        /// Gets or sets themeColor
        /// </summary>
        [JsonProperty(PropertyName = "themeColor")]
        public string ThemeColor { get; set; }

        /// <summary>
        /// Gets or sets sections
        /// </summary>
        [JsonProperty(PropertyName = "sections")]
        public SwiftSection[] Sections { get; set; }

        /// <summary>
        /// Gets or sets potentialAction
        /// </summary>
        [JsonProperty(PropertyName = "potentialAction")]
        public SwiftPotentialAction[] PotentialActions { get; set; }

        /// <summary>
        /// Gets or sets the footer
        /// </summary>
        [JsonProperty(PropertyName = "footer")]
        public SwiftFooter Footer { get; set; }
    }
}
