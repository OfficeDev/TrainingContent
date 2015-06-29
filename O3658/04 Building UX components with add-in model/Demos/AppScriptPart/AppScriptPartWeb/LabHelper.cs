using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace AppScriptPartWeb
{
    public static class LabHelper
    {
        /// <summary>
        /// Takes an in memory copy of the AppScript .webpart file and alters the file in memory to ensure that the script link used is correct.
        /// NOTE this code is not production ready and will throw NullReferenceExceptions if the webpart does not contain a propert with a name of Content
        /// </summary>
        /// <param name="workingCopy"><see cref="MemoryStream"/> containing .webpart xml file</param>
        /// <param name="httpRequest"><see cref="HttpRequest"/> used to build the Url to the script file to be used</param>
        public static void SetJsLink(MemoryStream workingCopy, HttpRequest httpRequest)
        {
            //set the stream to the start of the file
            workingCopy.Position = 0;
            //load the stream into an XDocument for editing
            XDocument webpartFile = XDocument.Load(workingCopy);
            //find the Content property as this element is in a Namespace we neet to use the namespace in the query
            XNamespace ns = "http://schemas.microsoft.com/WebPart/v3";
            XElement content =
                webpartFile.Descendants(ns + "property").FirstOrDefault(n => n.Attribute("name").Value == "Content");
            //Build up a Url to the scenario2.js 
            //NOTE: This Url changes depending on where this is hosted so this approach ensures that the link always works
            //      When using a development environment webserver the port is not reliable so hardcoding may fail when using different machines
            string scenarioUrl = String.Format("{0}://{1}:{2}/Scripts", httpRequest.Url.Scheme,
                httpRequest.Url.DnsSafeHost, httpRequest.Url.Port);
            string revision = Guid.NewGuid().ToString().Replace("-", "");

            string jsLink = string.Format("{0}/{1}?rev={2}", scenarioUrl, "scenario2.js", revision);
            content.Value = string.Format(content.Value, jsLink);
            //Reset the position of the stream so that the Save() call overwrites the existing content
            //NOTE: Use a new stream here if the altered stream maybe shorter than the original
            workingCopy.Position = 0;
            webpartFile.Save(workingCopy);
        }
    }
}