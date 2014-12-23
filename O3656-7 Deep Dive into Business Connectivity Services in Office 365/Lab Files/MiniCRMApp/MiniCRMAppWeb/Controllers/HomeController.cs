using Microsoft.SharePoint.Client;
using MiniCRMAppWeb.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace MiniCRMAppWeb.Controllers
{
    public class HomeController : Controller
    {

        [SharePointContextFilter]
        public async Task<ActionResult> Index(Customer customer)
        {

            if (customer.LastName != null)
            {
                var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);
                string accessToken = spContext.UserAccessTokenForSPHost;

                string connectionString = "[YOUR CONNECTION STRING]";

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    //Add new record
                    StringBuilder sql = new StringBuilder();
                    sql.Append("INSERT INTO Customers (FirstName, LastName, Company, WorkPhone, HomePhone, EmailAddress) ");
                    sql.Append("VALUES ('");
                    sql.Append(customer.FirstName);
                    sql.Append("','");
                    sql.Append(customer.LastName);
                    sql.Append("','");
                    sql.Append(customer.Company);
                    sql.Append("','");
                    sql.Append(customer.WorkPhone);
                    sql.Append("','");
                    sql.Append(customer.HomePhone);
                    sql.Append("','");
                    sql.Append(customer.EmailAddress);
                    sql.Append("')");

                    SqlCommand updateCommand = new SqlCommand(sql.ToString(), connection);
                    updateCommand.ExecuteNonQuery();

                    //Get the ID for the new record
                    SqlCommand idCommand = new SqlCommand(
                        "SELECT ID FROM Customers WHERE LastName='" + customer.LastName + "' AND FirstName='" + customer.FirstName + "'",
                        connection);
                    object newId = idCommand.ExecuteScalar();


                    //Get all endpoints
                    SqlCommand deliveryCommand =
                        new SqlCommand(
                            "SELECT DeliveryAddress, EventType FROM Subscriptions",
                            connection);

                    SqlDataReader deliveryReader = deliveryCommand.ExecuteReader();

                    if (deliveryReader.HasRows)
                    {
                        while (deliveryReader.Read())
                        {
                            //SharePoint Notification Endpoint
                            //"1" is item added, which is all this application does
                            if (deliveryReader.GetString(1) == "1")
                            {

                                //Build the request against the "Item Added" endpoint
                                HttpClient client = new HttpClient();
                                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, deliveryReader.GetString(0));
                                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
                                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                                request.Headers.Add("X-RequestDigest", await GetFormDigest());

                                StringContent message = new StringContent(NotifyBody("ID", newId.ToString()));
                                request.Content = message;


                                HttpResponseMessage response = await client.SendAsync(request);
                                string responseString = await response.Content.ReadAsStringAsync();

                            }

                        }
                    }

                    connection.Close();
                }
            }
            
            return View();
        }

        private async Task<string> GetFormDigest()
        {

            var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);
            string accessToken = spContext.UserAccessTokenForSPHost;

            StringBuilder requestUri = new StringBuilder()
             .Append(spContext.SPHostUrl)
             .Append("_api/contextinfo");

            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            HttpResponseMessage response = await client.SendAsync(request);
            string responseString = await response.Content.ReadAsStringAsync();

            XNamespace d = "http://schemas.microsoft.com/ado/2007/08/dataservices";
            XElement root = XElement.Parse(responseString);
            string digest =  root.Descendants(d + "FormDigestValue").First().Value;
            return digest;

        }
        private string NotifyBody(string CommaDelimitedIdentifierNames, string CommaDelimitedItemIds)
        {

            string format = "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>\r\n<feed xml:base=\"http://services.odata.org/OData/OData.svc/\"\r\nxmlns:d=\"http://schemas.microsoft.com/ado/2007/08/dataservices\"\r\nxmlns:m=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\"\r\nxmlns:b=\"http://schemas.microsoft.com/bcs/2012/\"\r\nxmlns=\"http://www.w3.org/2005/Atom\">\r\n<title type=\"text\">Categories</title>\r\n<id>http://services.odata.org/OData/OData.svc/Categories</id>\r\n<updated>2010-03-10T08:38:14Z</updated>\r\n<link rel=\"self\" title=\"Categories\" href=\"Categories\" />\r\n<entry>\r\n<id>http://services.odata.org/OData/OData.svc/Categories(0)</id>\r\n<title type=\"text\">Food</title>\r\n<updated>2010-03-10T08:38:14Z</updated>\r\n<author>\r\n<name />\r\n</author>\r\n<link rel=\"edit\" title=\"Category\" href=\"Categories(0)\" />\r\n<link rel=\"http://schemas.microsoft.com/ado/2007/08/dataservices/related/Products\"\r\n    type=\"application/atom+xml;type=feed\"\r\n    title=\"Products\" href=\"Categories(0)/Products\" />\r\n<category term=\"ODataDemo.Category\"\r\n    scheme=\"http://schemas.microsoft.com/ado/2007/08/dataservices/scheme\" />\r\n<content type=\"application/xml\">\r\n<m:properties>\r\n<b:BcsItemIdentity m:type=\"Edm.String\">{0}</b:BcsItemIdentity>\r\n<d:Name>Food</d:Name>\r\n</m:properties>\r\n</content>\r\n</entry>\r\n<!-- <entry> elements representing additional Categories go here -->\r\n</feed>\r\n";


            string[] identifierNames = CommaDelimitedIdentifierNames.Split(new char[] { ',' });
            string[] itemId = CommaDelimitedItemIds.Split(new char[] { ',' });

            StringBuilder idBldr = new StringBuilder();
            for (int i = 0; i < identifierNames.Length; i++)
            {
                idBldr.AppendFormat("<{0}>{1}</{0}>", identifierNames[i], itemId[i].ToString());
            }

            return string.Format(format, idBldr.ToString());

        }
    }
}
