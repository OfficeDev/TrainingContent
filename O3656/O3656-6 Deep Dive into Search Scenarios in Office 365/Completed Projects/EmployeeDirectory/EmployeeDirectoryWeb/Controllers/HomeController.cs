using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


using System.Text;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Xml.Linq;
using System.Threading.Tasks;
using EmployeeDirectoryWeb.Models;

namespace EmployeeDirectoryWeb.Controllers
{
    public class HomeController : Controller
    {
        [SharePointContextFilter]
        public async Task<ActionResult> Index(string startLetter)
        {
            List<Person> people = new List<Person>();

            if (startLetter != null)
            {
                var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);

                string accessToken = spContext.UserAccessTokenForSPHost;

                StringBuilder requestUri = new StringBuilder()
                .Append(spContext.SPHostUrl)
                .Append("/_api/search/query?querytext='LastName:")
                .Append(startLetter)
                .Append("*'&selectproperties='LastName,FirstName,WorkEmail,WorkPhone'&sourceid='B09A7990-05EA-4AF9-81EF-EDFAB16C4E31'&sortlist='FirstName:ascending'");

                HttpClient client = new HttpClient();
                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                HttpResponseMessage response = await client.SendAsync(request);
                string responseString = await response.Content.ReadAsStringAsync();

                XElement root = XElement.Parse(responseString);

                XNamespace d = "http://schemas.microsoft.com/ado/2007/08/dataservices";

                foreach (XElement row in root.Descendants(d + "Rows").First().Elements(d + "element"))
                {
                    Person person = new Person();

                    foreach (XElement cell in row.Descendants(d + "Cells").First().Elements(d + "element"))
                    {
                        if (cell.Elements(d + "Key").First().Value == "FirstName")
                        {
                            person.FirstName = cell.Elements(d + "Value").First().Value;
                        }
                        if (cell.Elements(d + "Key").First().Value == "LastName")
                        {
                            person.LastName = cell.Elements(d + "Value").First().Value;
                        }
                        if (cell.Elements(d + "Key").First().Value == "WorkPhone")
                        {
                            person.WorkPhone = cell.Elements(d + "Value").First().Value;
                        }
                        if (cell.Elements(d + "Key").First().Value == "WorkEmail")
                        {
                            person.WorkEmail = cell.Elements(d + "Value").First().Value;
                        }
                    }

                    people.Add(person);
                }

            }

            return View(people);

        }


        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
