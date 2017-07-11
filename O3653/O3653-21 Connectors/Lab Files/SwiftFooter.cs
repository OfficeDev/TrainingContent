// --------------------------------------------------------------------------------------------------------------------
// <copyright file="SwiftFooter.cs" company="Microsoft">
//   Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace Microsoft.Connectors.Common.Card.Formatting.ObjectModel
{
    using Newtonsoft.Json;

    /// <summary>
    /// The swift footer at the bottom of the card.
    /// </summary>
    public class SwiftFooter
    {
        /// <summary>
        /// Gets or sets action for the footer
        /// </summary>
        [JsonProperty(PropertyName = "action")]
        public SwiftPotentialAction Action { get; set; }
    }
}
