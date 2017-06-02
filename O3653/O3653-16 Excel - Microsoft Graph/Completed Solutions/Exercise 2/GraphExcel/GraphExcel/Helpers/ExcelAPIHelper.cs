//Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
//See LICENSE in the project root for license information.

using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using GraphExcel.Models;
using Newtonsoft.Json;
using System.Drawing;
using System.IO;
using System.Web;
using System.Web.Mvc;

namespace GraphExcel
{
    public class RESTAPIHelper
    {
        private static string restURLBase = "https://graph.microsoft.com/testexcel/me/drive/items/";
        private static string fileId = null;

        public static async Task LoadWorkbook(string accessToken)
        {
            try
            {
                var fileName = "ToDoList.xlsx";
                var serviceEndpoint = "https://graph.microsoft.com/v1.0/me/drive/root/children";
                //string fileId = null;

                String absPath = HttpContext.Current.Server.MapPath("Assets/ToDo.xlsx");
                HttpClient client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                //client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

                var filesResponse = await client.GetAsync(serviceEndpoint + "?$select=name,id");

                if (filesResponse.IsSuccessStatusCode)
                {
                    var filesContent = await filesResponse.Content.ReadAsStringAsync();

                    JObject parsedResult = JObject.Parse(filesContent);

                    foreach (JObject file in parsedResult["value"])
                    {

                        var name = (string)file["name"];
                        if (name.Contains("ToDoList.xlsx"))
                        {
                            fileId = (string)file["id"];
                            restURLBase = "https://graph.microsoft.com/testexcel/me/drive/items/" + fileId + "/workbook/worksheets('ToDoList')/";
                            return;
                        }
                    }

                }

                else
                {
                    Console.WriteLine("Could not get user files:" + filesResponse.StatusCode);
                }

                // We know that the file doesn't exist, so upload it and create the necessary worksheets, tables, and chart.
                var excelFile = File.OpenRead(absPath);
                byte[] contents = new byte[excelFile.Length];
                excelFile.Read(contents, 0, (int)excelFile.Length); excelFile.Close();
                var contentStream = new MemoryStream(contents);


                var contentPostBody = new StreamContent(contentStream);
                contentPostBody.Headers.Add("Content-Type", "application/octet-stream");


                // Endpoint for content in an existing file.
                var fileEndpoint = new Uri(serviceEndpoint + "/" + fileName + "/content");

                var requestMessage = new HttpRequestMessage(HttpMethod.Put, fileEndpoint)
                {
                    Content = contentPostBody
                };

                HttpResponseMessage response = await client.SendAsync(requestMessage);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var parsedResponse = JObject.Parse(responseContent);
                    fileId = (string)parsedResponse["id"];
                    restURLBase = "https://graph.microsoft.com/testexcel/me/drive/items/" + fileId + "/workbook/worksheets('ToDoList')/";

                    var workbookEndpoint = "https://graph.microsoft.com/testexcel/me/drive/items/" + fileId + "/workbook";

                    //Get session id

                    var sessionJson = "{" +
                        "'saveChanges': true" +
                        "}";
                    var sessionContentPostbody = new StringContent(sessionJson);
                    sessionContentPostbody.Headers.Clear();
                    sessionContentPostbody.Headers.Add("Content-Type", "application/json");
                    var sessionResponseMessage = await client.PostAsync(workbookEndpoint + "/createsession", sessionContentPostbody);
                    var sessionResponseContent = await sessionResponseMessage.Content.ReadAsStringAsync();
                    JObject sessionObject = JObject.Parse(sessionResponseContent);
                    var sessionId = (string)sessionObject["id"];

                    client.DefaultRequestHeaders.Add("Workbook-Session-Id", sessionId);


                    var worksheetsEndpoint = "https://graph.microsoft.com/testexcel/me/drive/items/" + fileId + "/workbook/worksheets";

                    //Worksheets
                    var toDoWorksheetJson = "{" +
                                                "'name': 'ToDoList'," +
                                                "}";

                    var toDoWorksheetContentPostBody = new StringContent(toDoWorksheetJson);
                    toDoWorksheetContentPostBody.Headers.Clear();
                    toDoWorksheetContentPostBody.Headers.Add("Content-Type", "application/json");
                    var toDoResponseMessage = await client.PostAsync(worksheetsEndpoint, toDoWorksheetContentPostBody);


                    var summaryWorksheetJson = "{" +
                            "'name': 'Summary'" +
                            "}";

                    var summaryWorksheetContentPostBody = new StringContent(summaryWorksheetJson);
                    summaryWorksheetContentPostBody.Headers.Clear();
                    summaryWorksheetContentPostBody.Headers.Add("Content-Type", "application/json");
                    var summaryResponseMessage = await client.PostAsync(worksheetsEndpoint, summaryWorksheetContentPostBody);

                    //ToDoList table in ToDoList worksheet
                    var toDoListTableJson = "{" +
                            "'address': 'A1:H1'," +
                            "'hasHeaders': true" +
                            "}";

                    var toDoListTableContentPostBody = new StringContent(toDoListTableJson);
                    toDoListTableContentPostBody.Headers.Clear();
                    toDoListTableContentPostBody.Headers.Add("Content-Type", "application/json");
                    var toDoListTableResponseMessage = await client.PostAsync(worksheetsEndpoint + "('ToDoList')/tables/$/add", toDoListTableContentPostBody);

                    //New table in Summary worksheet
                    var summaryTableJson = "{" +
                            "'address': 'A1:B1'," +
                            "'hasHeaders': true" +
                            "}";

                    var summaryTableContentPostBody = new StringContent(summaryTableJson);
                    summaryTableContentPostBody.Headers.Clear();
                    summaryTableContentPostBody.Headers.Add("Content-Type", "application/json");
                    var summaryTableResponseMessage = await client.PostAsync(worksheetsEndpoint + "('Summary')/tables/$/add", summaryTableContentPostBody);

                    var patchMethod = new HttpMethod("PATCH");


                    //Rename Table1 in ToDoList worksheet to "ToDoList"
                    var toDoListTableNameJson = "{" +
                            "'name': 'ToDoList'," +
                            "}";

                    var toDoListTableNamePatchBody = new StringContent(toDoListTableNameJson);
                    toDoListTableNamePatchBody.Headers.Clear();
                    toDoListTableNamePatchBody.Headers.Add("Content-Type", "application/json");


                    var toDoListRequestMessage = new HttpRequestMessage(patchMethod, worksheetsEndpoint + "('ToDoList')/tables('Table1')") { Content = toDoListTableNamePatchBody };
                    var toDoListTableNameResponseMessage = await client.SendAsync(toDoListRequestMessage);


                    //Rename ToDoList columns
                    var colToDoOneNameJson = "{" +
                            "'values': [['Id'], [null]] " +
                            "}";

                    var colToDoOneNamePatchBody = new StringContent(colToDoOneNameJson);
                    colToDoOneNamePatchBody.Headers.Clear();
                    colToDoOneNamePatchBody.Headers.Add("Content-Type", "application/json");
                    var colToDoOneNameRequestMessage = new HttpRequestMessage(patchMethod, worksheetsEndpoint + "('ToDoList')/tables('ToDoList')/Columns('1')") { Content = colToDoOneNamePatchBody };
                    var colToDoOneNameResponseMessage = await client.SendAsync(colToDoOneNameRequestMessage);

                    var colToDoTwoNameJson = "{" +
                            "'values': [['Title'], [null]] " +
                            "}";

                    var colToDoTwoNamePatchBody = new StringContent(colToDoTwoNameJson);
                    colToDoTwoNamePatchBody.Headers.Clear();
                    colToDoTwoNamePatchBody.Headers.Add("Content-Type", "application/json");
                    var colToDoTwoNameRequestMessage = new HttpRequestMessage(patchMethod, worksheetsEndpoint + "('ToDoList')/tables('ToDoList')/Columns('2')") { Content = colToDoTwoNamePatchBody };
                    var colToDoTwoNameResponseMessage = await client.SendAsync(colToDoTwoNameRequestMessage);

                    var colToDoThreeNameJson = "{" +
                            "'values': [['Priority'], [null]] " +
                            "}";

                    var colToDoThreeNamePatchBody = new StringContent(colToDoThreeNameJson);
                    colToDoThreeNamePatchBody.Headers.Clear();
                    colToDoThreeNamePatchBody.Headers.Add("Content-Type", "application/json");
                    var colToDoThreeNameRequestMessage = new HttpRequestMessage(patchMethod, worksheetsEndpoint + "('ToDoList')/tables('ToDoList')/Columns('3')") { Content = colToDoThreeNamePatchBody };
                    var colToDoThreeNameResponseMessage = await client.SendAsync(colToDoThreeNameRequestMessage);

                    var colToDoFourNameJson = "{" +
                            "'values': [['Status'], [null]] " +
                            "}";

                    var colToDoFourNamePatchBody = new StringContent(colToDoFourNameJson);
                    colToDoFourNamePatchBody.Headers.Clear();
                    colToDoFourNamePatchBody.Headers.Add("Content-Type", "application/json");
                    var colToDoFourNameRequestMessage = new HttpRequestMessage(patchMethod, worksheetsEndpoint + "('ToDoList')/tables('ToDoList')/Columns('4')") { Content = colToDoFourNamePatchBody };
                    var colToDoFourNameResponseMessage = await client.SendAsync(colToDoFourNameRequestMessage);

                    var colToDoFiveNameJson = "{" +
                            "'values': [['PercentComplete'], [null]] " +
                            "}";

                    var colToDoFiveNamePatchBody = new StringContent(colToDoFiveNameJson);
                    colToDoFiveNamePatchBody.Headers.Clear();
                    colToDoFiveNamePatchBody.Headers.Add("Content-Type", "application/json");
                    var colToDoFiveNameRequestMessage = new HttpRequestMessage(patchMethod, worksheetsEndpoint + "('ToDoList')/tables('ToDoList')/Columns('5')") { Content = colToDoFiveNamePatchBody };
                    var colToDoFiveNameResponseMessage = await client.SendAsync(colToDoFiveNameRequestMessage);

                    var colToDoSixNameJson = "{" +
                            "'values': [['StartDate'], [null]] " +
                            "}";

                    var colToDoSixNamePatchBody = new StringContent(colToDoSixNameJson);
                    colToDoSixNamePatchBody.Headers.Clear();
                    colToDoSixNamePatchBody.Headers.Add("Content-Type", "application/json");
                    var colToDoSixNameRequestMessage = new HttpRequestMessage(patchMethod, worksheetsEndpoint + "('ToDoList')/tables('ToDoList')/Columns('6')") { Content = colToDoSixNamePatchBody };
                    var colToDoSixNameResponseMessage = await client.SendAsync(colToDoSixNameRequestMessage);

                    var colToDoSevenNameJson = "{" +
                            "'values': [['EndDate'], [null]] " +
                            "}";

                    var colToDoSevenNamePatchBody = new StringContent(colToDoSevenNameJson);
                    colToDoSevenNamePatchBody.Headers.Clear();
                    colToDoSevenNamePatchBody.Headers.Add("Content-Type", "application/json");
                    var colToDoSevenNameRequestMessage = new HttpRequestMessage(patchMethod, worksheetsEndpoint + "('ToDoList')/tables('ToDoList')/Columns('7')") { Content = colToDoSevenNamePatchBody };
                    var colToDoSevenNameResponseMessage = await client.SendAsync(colToDoSevenNameRequestMessage);

                    var colToDoEightNameJson = "{" +
                            "'values': [['Notes'], [null]] " +
                            "}";

                    var colToDoEightNamePatchBody = new StringContent(colToDoEightNameJson);
                    colToDoEightNamePatchBody.Headers.Clear();
                    colToDoEightNamePatchBody.Headers.Add("Content-Type", "application/json");
                    var colToDoEightNameRequestMessage = new HttpRequestMessage(patchMethod, worksheetsEndpoint + "('ToDoList')/tables('ToDoList')/Columns('8')") { Content = colToDoEightNamePatchBody };
                    var colToDoEightNameResponseMessage = await client.SendAsync(colToDoEightNameRequestMessage);

                    //Rename Summary columns
                    var colSumOneNameJson = "{" +
                            "'values': [['Status'], [null]] " +
                            "}";

                    var colSumOneNamePatchBody = new StringContent(colSumOneNameJson);
                    colSumOneNamePatchBody.Headers.Clear();
                    colSumOneNamePatchBody.Headers.Add("Content-Type", "application/json");
                    var colSumOneNameRequestMessage = new HttpRequestMessage(patchMethod, worksheetsEndpoint + "('Summary')/tables('2')/Columns('1')") { Content = colSumOneNamePatchBody };
                    var colSumOneNameResponseMessage = await client.SendAsync(colSumOneNameRequestMessage);

                    var colSumTwoNameJson = "{" +
                            "'values': [['Count'], [null]] " +
                            "}";

                    var colSumTwoNamePatchBody = new StringContent(colSumTwoNameJson);
                    colSumTwoNamePatchBody.Headers.Clear();
                    colSumTwoNamePatchBody.Headers.Add("Content-Type", "application/json");
                    var colSumTwoNameRequestMessage = new HttpRequestMessage(patchMethod, worksheetsEndpoint + "('Summary')/tables('2')/Columns('2')") { Content = colSumTwoNamePatchBody };
                    var colSumTwoNameResponseMessage = await client.SendAsync(colSumTwoNameRequestMessage);

                    //Set numberFormat to text for the two date fields

                    var dateRangeJSON = "{" +
                        "'numberFormat': '@'" +
                        "}";
                    var datePatchBody = new StringContent(dateRangeJSON);
                    datePatchBody.Headers.Clear();
                    datePatchBody.Headers.Add("Content-Type", "application/json");
                    var dateRequestMessage = new HttpRequestMessage(patchMethod, worksheetsEndpoint + "('ToDoList')/range(address='$F1:$G1000')") { Content = datePatchBody };
                    var dateResponseMessage = await client.SendAsync(dateRequestMessage);


                    //Add rows to summary table

                    var summaryTableNSRowJson = "{" +
                            "'values': [['Not started', '=COUNTIF(ToDoList[PercentComplete],[@Status])']]" +
                        "}";
                    var summaryTableNSRowContentPostBody = new StringContent(summaryTableNSRowJson, System.Text.Encoding.UTF8);
                    summaryTableNSRowContentPostBody.Headers.Clear();
                    summaryTableNSRowContentPostBody.Headers.Add("Content-Type", "application/json");

                    var summaryTableNSRowResponseMessage = await client.PostAsync(worksheetsEndpoint + "('Summary')/tables('2')/rows", summaryTableNSRowContentPostBody);

                    var summaryTableNSRowTwoJson = "{" +
                            "'values': [['In-progress', '=COUNTIF(ToDoList[PercentComplete],[@Status])']]" +
                        "}";
                    var summaryTableNSRowTwoContentPostBody = new StringContent(summaryTableNSRowTwoJson, System.Text.Encoding.UTF8);
                    summaryTableNSRowTwoContentPostBody.Headers.Clear();
                    summaryTableNSRowTwoContentPostBody.Headers.Add("Content-Type", "application/json");

                    var summaryTableNSRowTwoResponseMessage = await client.PostAsync(worksheetsEndpoint + "('Summary')/tables('2')/rows", summaryTableNSRowTwoContentPostBody);

                    var summaryTableNSRowThreeJson = "{" +
                            "'values': [['Completed', '=COUNTIF(ToDoList[PercentComplete],[@Status])']]" +
                        "}";
                    var summaryTableNSRowThreeContentPostBody = new StringContent(summaryTableNSRowThreeJson, System.Text.Encoding.UTF8);
                    summaryTableNSRowThreeContentPostBody.Headers.Clear();
                    summaryTableNSRowThreeContentPostBody.Headers.Add("Content-Type", "application/json");

                    var summaryTableNSRowThreeResponseMessage = await client.PostAsync(worksheetsEndpoint + "('Summary')/tables('2')/rows", summaryTableNSRowThreeContentPostBody);

                    //Add chart to Summary worksheet
                    var chartJson = "{" +
                        "\"type\": \"Pie\", " +
                        "\"sourcedata\": \"A1:B4\", " +
                        "\"seriesby\": \"Auto\"" +
                        "}";

                    var chartContentPostBody = new StringContent(chartJson);
                    chartContentPostBody.Headers.Clear();
                    chartContentPostBody.Headers.Add("Content-Type", "application/json");
                    var chartCreateResponseMessage = await client.PostAsync(worksheetsEndpoint + "('Summary')/charts/$/add", chartContentPostBody);

                    //Update chart position and title
                    var chartPatchJson = "{" +
                        "'left': 99," +
                        "'name': 'Status'," +
                        "}";

                    var chartPatchBody = new StringContent(chartPatchJson);
                    chartPatchBody.Headers.Clear();
                    chartPatchBody.Headers.Add("Content-Type", "application/json");
                    var chartPatchRequestMessage = new HttpRequestMessage(patchMethod, worksheetsEndpoint + "('Summary')/charts('Chart 1')") { Content = chartPatchBody };
                    var chartPatchResponseMessage = await client.SendAsync(chartPatchRequestMessage);

                    //Close workbook session
                    var closeSessionJson = "{}";
                    var closeSessionBody = new StringContent(closeSessionJson);
                    sessionContentPostbody.Headers.Clear();
                    sessionContentPostbody.Headers.Add("Content-Type", "application/json");
                    var closeSessionResponseMessage = await client.PostAsync(workbookEndpoint + "/closesession", closeSessionBody);

                }

                else
                {
                    Console.WriteLine("We could not create the file. The request returned this status code: " + response.StatusCode);

                }

            }

            catch (Exception e)
            {
                Console.WriteLine(e.Message);

            }
        }

        public static async Task<List<ToDoItem>> GetToDoItems(string accessToken)
        {
            List<ToDoItem> todoItems = new List<ToDoItem>();

            using (var client = new HttpClient())
            {
                //client.BaseAddress = new Uri(restURLBase);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // New code:
                HttpResponseMessage response = await client.GetAsync(restURLBase + "tables('ToDoList')/Rows");
                if (response.IsSuccessStatusCode)
                {
                    string resultString = await response.Content.ReadAsStringAsync();

                    dynamic x = Newtonsoft.Json.JsonConvert.DeserializeObject(resultString);
                    JArray y = x.value;

                    todoItems = BuildList(todoItems, y);
                }
            }

            return todoItems;
        }

        private static List<ToDoItem> BuildList(List<ToDoItem> todoItems, JArray y)
        {
            foreach (var item in y.Children())
            {
                var itemProperties = item.Children<JProperty>();

                //Get element that holds row collection
                var element = itemProperties.FirstOrDefault(xx => xx.Name == "values");
                JProperty index = itemProperties.FirstOrDefault(xxx => xxx.Name == "index");

                //The string array of row values
                JToken values = element.Value;

                //linq query to get rows from results
                var stringValues = from stringValue in values select stringValue;
                //rows
                foreach (JToken thing in stringValues)
                {
                    IEnumerable<string> rowValues = thing.Values<string>();

                    //Cast row value collection to string array
                    string[] stringArray = rowValues.Cast<string>().ToArray();


                    try
                    {
                        ToDoItem todoItem = new ToDoItem(
                             stringArray[0],
                             stringArray[1],
                             stringArray[3],
                             stringArray[4],
                             stringArray[2],
                             stringArray[5],
                             stringArray[6],
                        stringArray[7]);
                        todoItems.Add(todoItem);
                    }
                    catch (FormatException f)
                    {
                        Console.WriteLine(f.Message);
                    }
                }
            }

            return todoItems;

        }

        public static async Task<ToDoItem> CreateToDoItem(
                                                 string accessToken,
                                                 string title,
                                                 string priority,
                                                 string status,
                                                 string percentComplete,
                                                 string startDate,
                                                 string endDate,
                                                 string notes)
        {
            ToDoItem newTodoItem = new ToDoItem();

            //int id = new Random().Next(1, 1000);
            string id = Guid.NewGuid().ToString();

            var priorityString = "";

            switch (priority)
            {
                case "1":
                    priorityString = "High";
                    break;
                case "2":
                    priorityString = "Normal";
                    break;
                case "3":
                    priorityString = "Low";
                    break;
            }

            var statusString = "";

            switch (status)
            {
                case "1":
                    statusString = "Not started";
                    break;
                case "2":
                    statusString = "In-progress";
                    break;
                case "3":
                    statusString = "Completed";
                    break;
            }
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(restURLBase);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                using (var request = new HttpRequestMessage(HttpMethod.Post, restURLBase))
                {
                    //Create 2 dimensional array to hold the row values to be serialized into json
                    object[,] valuesArray = new object[1, 8] { { id, title, percentComplete.ToString(), priorityString, statusString, startDate, endDate, notes } };

                    //Create a container for the request body to be serialized
                    RequestBodyHelper requestBodyHelper = new RequestBodyHelper();
                    requestBodyHelper.index = null;
                    requestBodyHelper.values = valuesArray;

                    //Serialize the final request body
                    string postPayload = JsonConvert.SerializeObject(requestBodyHelper);

                    //Add the json payload to the POST request
                    request.Content = new StringContent(postPayload, System.Text.Encoding.UTF8);


                    using (HttpResponseMessage response = await client.PostAsync("tables('ToDoList')/rows", request.Content))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            string resultString = await response.Content.ReadAsStringAsync();
                            dynamic x = Newtonsoft.Json.JsonConvert.DeserializeObject(resultString);
                        }
                    }
                }
            }
            return newTodoItem;
        }

        public static async Task<FileContentResult> getChartImage(string accessToken)
        {
            FileContentResult returnValue = null;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://graph.microsoft.com/testexcel/me/drive/items/" + fileId + "/workbook/worksheets('Summary')/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                string chartId = null;


                //Take the first chart off the charts collection, since we know there is only one
                HttpResponseMessage chartsResponse = await client.GetAsync("charts");

                var responseContent = await chartsResponse.Content.ReadAsStringAsync();
                var parsedResponse = JObject.Parse(responseContent);
                chartId = (string)parsedResponse["value"][0]["id"];

                HttpResponseMessage response = await client.GetAsync("charts('" + chartId + "')/Image(width=0,height=0,fittingMode='fit')");

                if (response.IsSuccessStatusCode)
                {
                    string resultString = await response.Content.ReadAsStringAsync();

                    dynamic x = JsonConvert.DeserializeObject(resultString);
                    JToken y = x.Last;
                    Bitmap imageBitmap = StringToBitmap(x["value"].ToString());
                    ImageConverter converter = new ImageConverter();
                    byte[] bytes = (byte[])converter.ConvertTo(imageBitmap, typeof(byte[]));
                    returnValue = new FileContentResult(bytes, "image/bmp");
                }
                return returnValue;
            }
        }

        public static Bitmap StringToBitmap(string base64ImageString)
        {
            Bitmap bmpReturn = null;
            byte[] byteBuffer = Convert.FromBase64String(base64ImageString);
            MemoryStream memoryStream = new MemoryStream(byteBuffer);

            memoryStream.Position = 0;

            bmpReturn = (Bitmap)Bitmap.FromStream(memoryStream);
            memoryStream.Close();
            memoryStream = null;
            byteBuffer = null;
            return bmpReturn;


        }
    }
    public class RequestBodyHelper
    {
        public object index;
        public object[,] values;
    }
}