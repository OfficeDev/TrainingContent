using AppLevelectWeb.Models;
using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AppLevelectWeb.Controllers
{
    public class HomeController : Controller
    {
        [SharePointContextFilter]
        public ActionResult Index(string lastPosition)
        {
            var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);
            List<Employee> employees = new List<Employee>();

            using (var clientContext = spContext.CreateUserClientContextForSPAppWeb())
            {
                List list = clientContext.Web.Lists.GetByTitle("Employees");
                CamlQuery camlQuery = new CamlQuery();

                if (lastPosition != null)
                {
                    ListItemCollectionPosition position = new ListItemCollectionPosition();
                    position.PagingInfo = string.Format("Paged=TRUE&p_ID={0}", lastPosition);
                    camlQuery.ListItemCollectionPosition = position;
                    lastPosition = (int.Parse(lastPosition) + 20).ToString();
                }
                else
                {
                    lastPosition = "20";
                }

               camlQuery.ViewXml=@"<View>
                    <Query>
                      <OrderBy>
                        <FieldRef Name='LastName'/>
                      </OrderBy>
                    </Query>
                    <ViewFields>
                      <FieldRef Name='EmployeeID'/>
                      <FieldRef Name='LastName'/>
                      <FieldRef Name='FirstName'/>
                      <FieldRef Name='HireDate'/>
                      <FieldRef Name='HomePhone'/>
                    </ViewFields>
                    <RowLimit>100</RowLimit>
                  </View>";

                ListItemCollection listItems = list.GetItems(camlQuery);
                clientContext.Load(
                     listItems,
                     items => items
                         .Include(
                             item => item["EmployeeID"],
                             item => item["LastName"],
                             item => item["FirstName"],
                             item => item["HireDate"],
                             item => item["HomePhone"]));
                clientContext.ExecuteQuery();

                foreach (ListItem listItem in listItems)
                {
                    Employee employee = new Employee();
                    employee.EmployeeID = listItem["EmployeeID"] == null ? -1 : (int)listItem["EmployeeID"];
                    employee.FirstName = listItem["FirstName"] == null ? string.Empty : listItem["FirstName"].ToString();
                    employee.LastName = listItem["LastName"] == null ? string.Empty : listItem["LastName"].ToString();
                    employee.HomePhone = listItem["HomePhone"] == null ? string.Empty : listItem["HomePhone"].ToString();
                    employee.HireDate = listItem["HireDate"] == null ? DateTime.Today : (DateTime)listItem["HireDate"];
                    employees.Add(employee);
                }
            }

            ViewBag.LastPosition = lastPosition;
            return View(employees);
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
