/***************************************************************************************************
	DiscoveryXElements.cs
	Copyright (c) Microsoft Corporation

	XLINQ element and namespace names.
***************************************************************************************************/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Win8ServiceDiscovery
{
    public static class DiscoveryXElements
    {
        #region Namespaces
        public const string XNamespaceAtom = @"http://www.w3.org/2005/Atom";
        public const string XNamespaceOData = @"http://schemas.microsoft.com/ado/2007/08/dataservices";
        public const string XNamespaceODataMetadata = @"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata";
        #endregion

        #region Atom Names
        // Append "Atom" at the end
        public static readonly XName ContentAtom = XName.Get("content", XNamespaceAtom);
        public static readonly XName EntryAtom = XName.Get("entry", XNamespaceAtom);
        public static readonly XName IdAtom = XName.Get("id", XNamespaceAtom);
        #endregion

        #region Odata Metatada
        // Append "Metadata" at the end
        public static readonly XName PropertiesMetadata = XName.Get("properties", XNamespaceODataMetadata);
        #endregion

        #region Odata
        // Realm 
        public static readonly XName AccountType = XName.Get("AccountType", XNamespaceOData);
        public static readonly XName AuthorizationServices = XName.Get("AuthorizationServices", XNamespaceOData);
        public static readonly XName Scope = XName.Get("Scope", XNamespaceOData);
        public static readonly XName UnsupportedScope = XName.Get("UnsupportedScope", XNamespaceOData);

        // Services and AllServices
        public static readonly XName Capability = XName.Get("Capability", XNamespaceOData);
        public static readonly XName ServiceAccountType = XName.Get("ServiceAccountType", XNamespaceOData);
        public static readonly XName ServiceId = XName.Get("ServiceId", XNamespaceOData);
        public static readonly XName ServiceEndpointUri = XName.Get("ServiceEndpointUri", XNamespaceOData);
        public static readonly XName ServiceResourceId = XName.Get("ServiceResourceId", XNamespaceOData);

        // SkyDrivePro 
        public static readonly XName Title = XName.Get("Title", XNamespaceOData);
        #endregion
    }
}
