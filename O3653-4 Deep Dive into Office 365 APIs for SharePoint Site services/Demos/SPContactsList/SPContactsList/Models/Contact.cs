using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace SPContactsList.Models
{
    public class Contact
    {
        XNamespace a = "http://www.w3.org/2005/Atom";
        XNamespace d = "http://schemas.microsoft.com/ado/2007/08/dataservices";
        XNamespace m = "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata";

        public string Id { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public XElement ToXElement()
        {
            return new XElement(a + "entry",
                    new XAttribute(XNamespace.Xmlns + "d", d),
                    new XAttribute(XNamespace.Xmlns + "m", m),
                    new XElement(a + "category", new XAttribute("term", "SP.Data.ContactsListItem"), new XAttribute("scheme", "http://schemas.microsoft.com/ado/2007/08/dataservices/scheme")),
                    new XElement(a + "content", new XAttribute("type", "application/xml"),
                        new XElement(m + "properties",
                            new XElement(d + "Title", this.LastName),
                            new XElement(d + "FirstName", this.FirstName),
                            new XElement(d + "Email", this.Email),
                            new XElement(d + "WorkPhone", this.Phone))));
        }

    }

    public static class ExtensionMethods
    {
        static XNamespace a = "http://www.w3.org/2005/Atom";
        static XNamespace d = "http://schemas.microsoft.com/ado/2007/08/dataservices";
        static XNamespace m = "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata";

        public static Contact ToContact(this XElement root)
        {
            XElement properties = root.Descendants(m + "properties").First();

            Contact contact = new Contact();
            contact.Id = properties.Descendants(d + "ID").First().Value;
            contact.LastName = properties.Descendants(d + "Title").First().Value;
            contact.FirstName = properties.Descendants(d + "FirstName").First().Value;
            contact.Email = properties.Descendants(d + "Email").First().Value;
            contact.Phone = properties.Descendants(d + "WorkPhone").First().Value;
            return contact;
        }
    }
}