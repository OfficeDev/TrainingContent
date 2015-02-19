using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Configuration;
using System.Globalization;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Xml.Linq;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Security.Claims;
using System.Net;
using SPResearchTracker.Controllers;
using SPResearchTracker.Utils;

namespace SPResearchTracker.Models
{
    public interface IResearchRepository
    {
        Task<bool> ListExists(string listName);
        Task<bool> CreateList(string listName, string listTemplate);
        Task<bool> AddFieldToList(string listName, string fieldName, string fieldTypeKind);
        void CacheConfigurations();
    }
    public class ResearchRepository : Repository, IResearchRepository
    {
        /// <summary>
        /// Determines if the given list exists in the SharePoint site
        /// </summary>
        /// <param name="accessHeader">The token to access SharePoint</param>
        /// <param name="listName">The name of the target list</param>
        /// <returns>True if list exists</returns>
        public async Task<bool> ListExists(string listName)
        {
            StringBuilder requestUri = new StringBuilder()
                .Append(this.SiteUrl)
                .Append("/_api/web/lists?$select=Title&$filter=Title eq '")
                .Append(listName)
                .Append("'");

            HttpResponseMessage response = await this.Get(requestUri.ToString());
            string responseString = await response.Content.ReadAsStringAsync();
            XElement root = XElement.Parse(responseString);

            if (!response.IsSuccessStatusCode)
            {
                return false;
            }

            if (root.Descendants(ExtensionMethods.d + "Title").Count() == 0)
            {
                return false;
            }

            if (root.Descendants(ExtensionMethods.d + "Title").First().Value == listName)
            {
                return true;
            }
            else
            {
                return false;
            }

        }

        /// <summary>
        /// Creates a list in the SharePoint site
        /// </summary>
        /// <param name="accessHeader">The token to access SharePoint</param>
        /// <param name="listName">The name of the target list</param>
        /// <param name="listTemplate">The ID of the list template (e.g., 100)</param>
        /// <returns>True if list created successfully</returns>
        public async Task<bool> CreateList(string listName, string listTemplate)
        {
            StringBuilder requestUri = new StringBuilder()
                .Append(this.SiteUrl).Append("/_api/web/lists");

            StringContent requestData = new StringContent(
            new XElement(ExtensionMethods.atom + "entry",
            new XAttribute(XNamespace.Xmlns + "d", ExtensionMethods.d),
            new XAttribute(XNamespace.Xmlns + "m", ExtensionMethods.m),
            new XElement(ExtensionMethods.atom + "category", new XAttribute("term", "SP.List"), new XAttribute("scheme", "http://schemas.microsoft.com/ado/2007/08/dataservices/scheme")),
            new XElement(ExtensionMethods.atom + "content", new XAttribute("type", "application/xml"),
                new XElement(ExtensionMethods.m + "properties",
                    new XElement(ExtensionMethods.d + "Title", listName),
                    new XElement(ExtensionMethods.d + "BaseTemplate", listTemplate)))).ToString());

            HttpResponseMessage response = await this.Post(requestUri.ToString(), requestData);
            return response.IsSuccessStatusCode;
        }

        /// <summary>
        /// Creates a field in the target list
        /// </summary>
        /// <param name="accessHeader">The token to access SharePoint</param>
        /// <param name="listName">The name of the target list</param>
        /// <param name="fieldName">The name of the field to create</param>
        /// <param name="fieldTypeKind">A string represention a value from the SP.FieldType enumeration (e.g., text = 2)</param>
        /// <returns>True if field created successfully</returns>
        public async Task<bool> AddFieldToList(
            string listName,
            string fieldName,
            string fieldTypeKind)
        {

            StringBuilder requestUri = new StringBuilder()
                .Append(this.SiteUrl).Append("/_api/web/lists/getByTitle('")
                .Append(listName)
                .Append("')/fields");

            StringContent requestData = new StringContent(
                new XElement(ExtensionMethods.atom + "entry",
                new XAttribute(XNamespace.Xmlns + "d", ExtensionMethods.d),
                new XAttribute(XNamespace.Xmlns + "m", ExtensionMethods.m),
                new XElement(ExtensionMethods.atom + "category", new XAttribute("term", "SP.Field"), new XAttribute("scheme", "http://schemas.microsoft.com/ado/2007/08/dataservices/scheme")),
                new XElement(ExtensionMethods.atom + "content", new XAttribute("type", "application/xml"),
                    new XElement(ExtensionMethods.m + "properties",
                        new XElement(ExtensionMethods.d + "Title", fieldName),
                        new XElement(ExtensionMethods.d + "FieldTypeKind", fieldTypeKind)))).ToString());

            HttpResponseMessage response = await this.Post(requestUri.ToString(), requestData);

            return response.IsSuccessStatusCode;

        }

        /// <summary>
        /// Returns the names of the lists to validate the SharePoint configuration
        /// </summary>
        /// <param name="accessHeader">The token to access SharePoint</param>
        /// <returns></returns>

        public async void CacheConfigurations()
        {
            List<ConfigurationInfo> configurations = new List<ConfigurationInfo>();

            StringBuilder requestUri = new StringBuilder()
                .Append(this.SiteUrl)
                .Append("/_api/web/lists?$select=Title,ListItemEntityTypeFullName&$filter=(Title eq '")
                .Append(this.ProjectsListName)
                .Append("') or (Title eq '")
                .Append(this.ReferencesListName)
                .Append("')");

            HttpResponseMessage response = await this.Get(requestUri.ToString());
            string responseString = await response.Content.ReadAsStringAsync();
            XElement root = XElement.Parse(responseString);

            foreach (XElement elem in root.Descendants(ExtensionMethods.m + "properties"))
            {
                string title = elem.Descendants(ExtensionMethods.d + "Title").First().Value;
                string type = elem.Descendants(ExtensionMethods.d + "ListItemEntityTypeFullName").First().Value;
                
                //Send configuration info back to client so they know lists are ready
                configurations.Add(new ConfigurationInfo() { Key = "List", Value = title });
                
                //Save the SharePoint type for use in creates and updates
                base.SaveInCache(title, type);
            }
        }
    }
}