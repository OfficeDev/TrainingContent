using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HostWebEventsWeb
{
    public static class LabHelper
    {
        /// <summary>
        /// Adds a list to a site
        /// </summary>
        /// <param name="properties">Site to operate on</param>
        /// <param name="listType">Type of the list</param>
        /// <param name="featureID">Feature guid that brings this list type</param>
        /// <param name="listName">Name of the list</param>
        /// <param name="enableVersioning">Enable versioning on the list</param>
        public static List AddList(ClientContext ctx, Web web, ListTemplateType listType, string listName)
        {
            ListCollection listCollection = web.Lists;
            ctx.Load(listCollection, lists => lists.Include(list => list.Title).Where(list => list.Title == listName));
            ctx.ExecuteQuery();

            if (listCollection.Count == 0)
            {
                ListCollection listCol = web.Lists;
                ListCreationInformation lci = new ListCreationInformation();
                lci.Title = listName;
                lci.TemplateType = (int)listType;
                List newList = listCol.Add(lci);
                newList.Description = "Demo list for remote event receiver lab";
                newList.Fields.AddFieldAsXml("<Field DisplayName='Description' Type='Text' />",true,AddFieldOptions.DefaultValue);
                newList.Fields.AddFieldAsXml("<Field DisplayName='AssignedTo' Type='Text' />",true,AddFieldOptions.DefaultValue);
                newList.Update();
                return newList;
                //ctx.Load(listCol);
                //ctx.ExecuteQuery();                
            }
            else
            {
                return listCollection[0];
            }
        }
    }
}