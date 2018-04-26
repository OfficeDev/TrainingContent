#Deep dive into SharePoint Lists with REST APIs

In this lab you will create two solutions that will interact with the SharePoint REST API. In the first exercise you will create a SharePoint hosted Add-in that will demonstrate how to perform CRUD-Q operations using client-side scripting. In the second exercise you will create a SharePoint provider-hosted Add-in that will demonstrate how to perform CRUD-Q operations using server-side coding with C#.

## Prerequisites
You must have one of the following environments:
  1. You must have an Office 365 tenant to complete this lab. If you do not have one, the lab for O3651-7 Setting up your Developer environment in Office 365 shows you how to obtain a trial.
  1. You must have installed Visual Studio 2015.
  1. You must have installed Microsoft Office Developer Tools for Visual Studio 2015.


## Exercise 1: SharePoint Hosted Add-in that Does CRUD-Q with JavaScript
*In this first exercise you will create a SharePoint hosted Add-in that will demonstrate how to perform CRUD-Q operations using client-side scripting.*

1. Launch Visual Studio 2015.
1. Create a new SharePoint Hosted Add-in project:
  1. In Visual Studio select **File/New/Project**.
  1. Select the **SharePoint Add-in** from the **Visual C#/(Office/SharePoint)/Web Add-ins** template category.
  1. Set the name of the project to **RestClientSide** and click **OK**.
  1. In the **Specify the SharePoint Add-in settings** dialog, enter the URL for your Office 365 developer site, select the Add-in hosting type of **SharePoint-hosted** and click **Next**.
  1. In the **Specify the target SharePoint version** dialog, select the Add-in target version of **SharePoint Online** and click **Finish** to create the new project.
1. Create a SharePoint list that you will read and write data to using the REST API:
  1. Right-click the project **RestClientSide** in the **Solution Explorer** tool widow and select **Add / New Item**.
  1. In the **Add New Item** dialog, select **List**.
  1. Give the list a name of **CeoList** and click **Add**.
  1. On the **SharePoint Customization Wizard** page, set the name of the list to **CEO List**, select a **customizable list template** and pick **Default (Custom List)**.
  1. Click **Finish**.
  1. After Visual Studio creates the list, it will open the list designer.
  1. Make the following changes & additions to the list schema:
    1. Add **TenureStartYear** (type = Single Line of Text).
    1. Add **TenureEndYear** (type = Single Line of Text).
  1. Save your changes.
1. Add some default data to the list. In this case you will add three people to the list. The first one is simply there to delete. The others represent the first two CEO's of Microsoft. Later you'll add code that will appoint the third CEO to the company.
  1. Open the file **CeoList/CeoListInstance/Elements.xml** in the project.
  1. Before the closing `</ListInstance>` element, add the following XML to add three items to the list when it is created:
  
    ````xml
    <Data>
      <Rows>
        <Row>
          <Field Name="Title">John Doe</Field>
          <Field Name="TenureStartYear">1971</Field>
          <Field Name="TenureEndYear">1972</Field>
        </Row>
        <Row>
          <Field Name="Title">Bill Gates</Field>
          <Field Name="TenureStartYear">1975</Field>
          <Field Name="TenureEndYear">2000</Field>
        </Row>
        <Row>
          <Field Name="Title">Steve Ballmer</Field>
          <Field Name="TenureStartYear">2000</Field>
          <Field Name="TenureEndYear">Present</Field>
        </Row>
      </Rows>
    </Data>
    ````

  1. Save you changes.

> This project is going to make extensive use of JavaScript and client-side techniques like no page refreshes in an effort to focus on the code used in making REST requests. As such a few freely available & popular third-party libraries will be used.

1. Add a two NuGet packages to the project:
  1. Open the **Package Management Console** and run the following two commands. 
  
    ````powershell
    PM> Install-Package KnockoutJS
    PM> Install-Package Q
    ````

    The first one adds the popular [KnockoutJS](http://knockoutjs.com) library to your project. This will be used to simplify updating the page with the data you get back form the REST API.

    The second one adds a JavaScript promise library [Q](http://documentup.com/kriskowal/q) simplifies working with async requests as you will chain a few together in this sample.

  1. With these libraries added to the project, the next step is to add them to the homepage of the site. Open the **Pages/Default.aspx** file and add the following to lines to the **PlaceHolderAdditionalPageHead** content placeholder after the existing scripts:

    ````html
    <script type="text/javascript" src="../Scripts/knockout-3.4.1.js"></script>
    <script type="text/javascript" src="../Scripts/q.min.js"></script>
    ````

1. Next, add the code required to implement the user interface that will trigger the calls to the SharePoint REST API. Replace all the markup in the **PlaceHolderMain** content placeholder with the following:

  ````html
	  <input type="button" disabled="disabled" 
	         value="refresh list"
	         data-bind="click: getAllChiefExecutives"/>&nbsp;
	  <input type="button" disabled="disabled" 
	         value="appoint 3rd ceo"
	         data-bind="click: addThirdCeo"/>&nbsp;
	  <input type="button" disabled="disabled" 
	         value="delete first person"
	         data-bind="click: deleteFirstCeo"/>
	
	  <h1>Microsoft CEO's</h1>
	  <table>
	    <thead>
	      <tr>
	        <th>Name</th>
	        <th>Tenure</th>
	      </tr>
	    </thead>
	    <tbody data-bind="foreach: chiefExecutives">
	      <tr>
	        <td data-bind="text: Title"></td>
	        <td><span data-bind="text: TenureStartYear"></span> - <span data-bind="  text: TenureEndYear"></span></td>
	      </tr>
	    </tbody>
	  </table>
  ````

  > If you aren't familiar with the different `data-bind` attributes, these are used by the **KnockoutJS** library to update the user interface for us. You don't have to understand how they work to complete this lab.
  
1. Create a skeleton view model and bind an instance of it to the page with KnockoutJS.
  1. Open the **Scripts/App.js** file and delete all the contents.
  1. Add the following JavaScript to the **App.js** file:

    ````javascript
    (function () {
      'use strict';

      /**
       * view model used for the page in binding with knockout.js
       */
      var viewModel = function () {
        var self = this;

        // collection of ceo's that will be displayed on the page
        self.chiefExecutives = ko.observableArray([]);
        // get all CEOs
        self.getAllChiefExecutives = getAllChiefExecutives;
        self.addThirdCeo = addThirdCeo;
        self.deleteFirstCeo = deleteFirstCeo;

        // get all CEO's from the list
        function getAllChiefExecutives() {
        };

        // add satya nadella to the company
        function addThirdCeo() {
          var jobs = [];
        }

        // delete the dummy record
        function deleteFirstCeo() {
        }
      }

      /**
       * attach view model to the page & enable all buttons
       */
      jQuery(document).ready(function () {
        // create & bind view model to the page
        ko.applyBindings(new viewModel());

        // enable all buttons now that the scripts have loaded & view model is bound
        jQuery('input[type="button"]').removeAttr('disabled');
      });
    })();
    ````

    > This creates a new view model and attaches it to the root of the page. It contains four public members. 
    >
    > The `chiefExecutives` is a collection of entities that you will fetch from the SharePoint list using the REST API.
    > 
    > The `getAllChiefExecutives()`, `addThirdCeo()` & `deleteFirstCeo()` functions are bound to buttons in the page and are used to trigger HTTP requests.

1. Locate the function `getAllChiefExecutives()` and add the following code to it. This will issue an HTTP **GET** request to the REST API to get all the CEO's in the list, sorted by the first year they were appointed as CEO of Microsoft:

  ````javascript
  // build query, sorted in ascending order of CEO
  var endpoint = _spPageContextInfo.webAbsoluteUrl +
    '/_api/web/lists/getbytitle(\'CEO List\')' +
    '/items' +
    '?$select=Title,TenureStartYear,TenureEndYear' + 
    '&$orderby=TenureStartYear';
  // create request headers
  var requestHeaders = {
    'Accept': 'application/json;odata=verbose'
  };

  // execute the request
  return jQuery.ajax({
    url: endpoint,
    type: 'GET',
    headers: requestHeaders
  }).done(function (response) {
    // clear the current results out
    self.chiefExecutives([]);
    // bind the returned results to the collection
    self.chiefExecutives(response.d.results);
  });
  ````

1. Locate the function `addThirdCeo()`. This function will do two things. First it will update the last CEO listed to set an end date for their tenure as Microsoft CEO. Then it will add the new CEO. Finally it will refresh the list of CEOs in the client by calling the function you just implemented.

  > Three HTTP requests will be submitted in this function. It is important that they all run sequentially because we want to ensure that you follow a logical progression: one CEO must finish before another starts, then only after those changes have been implemented, you want to get a new list.
  > 
  > To implement this, we will use promises and the **Q** library. Notice how each jQuery AJAX call is added to a `jobs` array. At the end of the function they will be executed in order and once they complete, the refresh of the list of CEOs will be run.

  1. Add the following code to the `addThirdCeo()` function to retire the currently listed CEO:
  
    ````javascript
    // build update query
    var totalCeos = self.chiefExecutives().length;
    var endpoint = self.chiefExecutives()[totalCeos - 1].__metadata.uri;
    // build request headers
    var requestHeaders = {
      'Accept': 'application/json;odata=verbose',
      'Content-Type': 'application/json;odata=verbose',
      'X-RequestDigest': jQuery("#__REQUESTDIGEST").val(),
      'X-Http-Method': 'MERGE',
      'If-Match': self.chiefExecutives()[totalCeos - 1].__metadata.etag
    };
    // build data object to send to service
    var firstCeoUpdateData = {
      __metadata:{type:'SP.Data.CEO_x0020_ListListItem'},
      TenureEndYear: '2014'
    };
    // add the ajax request to collection of promises to execute
    jobs.push(jQuery.ajax({
      url: endpoint,
      type: 'POST',
      headers: requestHeaders,
      data: JSON.stringify(firstCeoUpdateData),
      success: function (resonse) {
        alert('second ceo updated');
      },
      fail: function (error) {
        alert('error occurred updating second ceo: ' + error.message);
      }
    }));
    ````

  1. Next, add the following code to add the new CEO:

    ````javascript
    // build create query
    var endpoint = _spPageContextInfo.webAbsoluteUrl +
      '/_api/web/lists/getbytitle(\'CEO List\')' +
      '/items';
    // build request headers
    var requestHeaders = {
      'Accept': 'application/json;odata=verbose',
      'Content-Type': 'application/json;odata=verbose',
      'X-RequestDigest': jQuery("#__REQUESTDIGEST").val()
    };
    // build data object to send to service
    var thirdCeoUpdateData = {
      __metadata: { type: 'SP.Data.CEO_x0020_ListListItem' },
      Title: 'Satya Nadella',
      TenureStartYear: '2014',
      TenureEndYear: 'present'
    };
    // add the ajax request to collection of promises to execute
    jobs.push(jQuery.ajax({
      url: endpoint,
      type: 'POST',
      headers: requestHeaders,
      data: JSON.stringify(thirdCeoUpdateData),
      success: function (resonse) {
        alert('third ceo created');
      },
      fail: function (error) {
        alert('error occurred creating third ceo: ' + error.message);
      }
    }));
    ````

  1. Finally, add the following code that will execute the two HTTP requests (an update and insert) and once they complete, it will refresh the list of CEOs:
  
    ````javascript
    // execute all jobs in order...
    Q.all(jobs)
      .then(function () {
        // when the jobs are complete, get all ceos again
        self.getAllChiefExecutives();
      });
    ````

1. Locate the function `deleteFirstCeo()`. Add the following code to it to delete the first "dummy" person that was added when the list was created and then refresh the list of CEOs in the client:

  ````javascript
  var jobs = [];

  // build update query
  var endpoint = self.chiefExecutives()[0].__metadata.uri;
  // build request headers
  var requestHeaders = {
    'Accept': 'application/json;odata=verbose',
    'X-RequestDigest': jQuery("#__REQUESTDIGEST").val(),
    'If-Match': '*'
  };

  jobs.push(jQuery.ajax({
    url: endpoint,
    type: 'DELETE',
    headers: requestHeaders,
    success: function (resonse) {
      alert('first person deleted');
    },
    fail: function (error) {
      alert('error occurred deleting first person: ' + error.message);
    }
  }));

  // execute all jobs in order...
  Q.all(jobs)
    .then(function () {
      // when the jobs are complete, get all ceos again
      self.getAllChiefExecutives();
    });
  ````

1. Save all your changes and press **F5**. To test the project.

   When the browser loads the homepage for the Add-in, first click the **refresh list** button to get all the CEOs into the list on the page.

   Then click the **appoint 3rd ceo** button to retire the existing CEO and appoint a new CEO.

   Finally click the **delete first person** button to remove the dummy CEO.

> **NOTE** When running this sample, it assumes specific data is present. If you want to rerun the sample, make sure you either retract the Add-in or delete the Add-in form your test site so the next time you run it, the list is recreated with the initial sample data.

Congratulations! You've created a project that uses JavaScript and client-side technologies to call the SharePoint 2013 REST API!


## Exercise 2: SharePoint Provider Hosted Add-in that Does CRUD-Q with Server Side Code
*In this second exercise you will create a SharePoint provider-hosted Add-in that will demonstrate how to perform CRUD-Q operations using server-side coding with C#.*

1. Launch Visual Studio 2015.
1. Create a new SharePoint Hosted Add-in project:
  1. In Visual Studio select **File/New/Project**.
  1. Select the **SharePoint Add-in** from the **Visual C#/(Office/SharePoint)/Web Add-ins** template category.
  1. Set the name of the project to **RestServerSide** and click **OK**.
  1. In the **Specify the SharePoint Add-in settings** dialog, enter the URL for your Office 365 developer site, select the Add-in hosting type of **Provider-hosted** and click **Next**.
  1. In the **Specify the target SharePoint version** dialog, select the Add-in target version of **SharePoint Online** and click **Next**.
  1. In the **Specify the web project type** dialog, select **ASP.NET MVC Web Application** and click **Next**. 
  1. On the next page of the wizard, select the first option to use the **Use Window Azure Access Control Service** in obtaining tokens to handle the Add-in authentication process.
  1. Finally click **Finish**
1. Create a SharePoint list that you will read and write data to using the REST API:
  1. Right-click the project **RestServerSide** in the **Solution Explorer** tool widow and select **Add / New Item**.
  1. In the **Add New Item** dialog, select **List**.
  1. Give the list a name of **CeoList** and click **Add**.
  1. On the **SharePoint Customization Wizard** page, set the name of the list to **CEO List**, select a **customizable list template** and pick **Default (Custom List)**.
  1. Click **Finish**.
  1. After Visual Studio creates the list, it will open the list designer.
  1. Make the following changes & additions to the list schema:
    1. Add **TenureStartYear** (type = Single Line of Text).
    1. Add **TenureEndYear** (type = Single Line of Text).
  1. Save your changes.
1. Add some default data to the list. In this case you will add three people to the list. The first one is simply there to delete. The others represent the first two CEO's of Microsoft. Later you'll add code that will appoint the third CEO to the company.
  1. Right-click the file **CeoList/CeoListInstance/Elements.xml** in the project and select **View Code**.
  1. Before the closing `</ListInstance>` element, add the following XML to add three items to the list when it is created:
  
    ````xml
    <Data>
      <Rows>
        <Row>
          <Field Name="Title">John Doe</Field>
          <Field Name="TenureStartYear">1971</Field>
          <Field Name="TenureEndYear">1972</Field>
        </Row>
        <Row>
          <Field Name="Title">Bill Gates</Field>
          <Field Name="TenureStartYear">1975</Field>
          <Field Name="TenureEndYear">2000</Field>
        </Row>
        <Row>
          <Field Name="Title">Steve Ballmer</Field>
          <Field Name="TenureStartYear">2000</Field>
          <Field Name="TenureEndYear">Present</Field>
        </Row>
      </Rows>
    </Data>
    ````

  1. Save you changes.

  Now let's create a class to communicate with the SharePoint REST API that will return data back to the web application and submit it to the REST API.

1. Within the **Models** folder, create a new class named **SpChiefExecutive.cs** and update the class to look like the following code. This is the model object that our web application will use:

  ````c#
  public class SpChiefExecutive
  {
    public string Id { get; set; }
    public string Name { get; set; }
    public string TenureStartYear { get; set; }
    public string TenureEndYear { get; set; }
  }
  ````

1. Because we will be working with REST services and using JSON to submit & receive data to/from the service, we need an easy way to parse it. We will use JSON serialization to help up with this task. To support this we'll use a popular and freely available NuGet package named JSON.NET:
  1. Using the **Package Manager Console**, run the following command to install JSON.NET into the project:

    ````powershell
    PM> Install-Package -Id Newtonsoft.Json -ProjectName RestServerSideWeb
    ````

  1. Now, add a new class to the **Models** folder named **SpChiefExecutiveJsonCollection.cs**
  1. Add the following `using` statement to the file:

    ````c#
    using Newtonsoft.Json;
    ````

  1. Next, add the following code to the file, replacing the default class it created:
  
    ````c#
    public class SpChiefExecutiveJsonCollection {
      [JsonProperty(PropertyName = "d")]
      public DataCollectionResponse Data { get; set; }
    }

    public class SpChiefExecutiveJsonSingle
    {
      [JsonProperty(PropertyName = "d")]
      public SpChiefExecutiveJson Data { get; set; }
    }

    public class DataCollectionResponse {
      [JsonProperty(PropertyName = "results")]
      public SpChiefExecutiveJson[] Results { get; set; }
    }

    public class SpChiefExecutiveJson {
      [JsonProperty(PropertyName = "__metadata")]
      public JsonMetadata Metadata { get; set; }
      public int Id { get; set; }
      public int ID { get; set; }
      public string Title { get; set; }
      public string TenureStartYear { get; set; }
      public string TenureEndYear { get; set; }
    }

    public class JsonMetadata {
      [JsonProperty(PropertyName = "id")]
      public string Id { get; set; }
      [JsonProperty(PropertyName = "uri")]
      public string Uri { get; set; }
      [JsonProperty(PropertyName = "etag")]
      public string ETag { get; set; }
      [JsonProperty(PropertyName = "type")]
      public string Type { get; set; }
    }
    ````

1. Now we are ready to create a repository class that will do all the heavy lifting between the web application & the REST API. 
  
  Start by creating a new class in the **Models** folder named **SpChiefExecutiveRepository.cs**.

  1. Ensure it has the following using statements at the top of the file:

    ````c#
    using Newtonsoft.Json;
    using RestServerSideWeb;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Threading.Tasks;
    using System.Web;
    ````

  1. Next, add an internal reference to the **SharePointContext** which will be passed into the constructor of the class by any controllers that use this repository. Do this by adding the following code to the class:

    ````c#
    private SharePointContext _spContext;
    public SpChiefExecutiveRepository(SharePointContext spContext) {
      _spContext = spContext;
    }
    ````

  1. Now let's add a method that will get data back form the SharePoint REST API. This code will do the following things:
    1. Create the endpoint of the request.
    1. Create an `HttpClient` that will issue the request. It is configured to issue an HTTP GET, accept the JSON data format in it's response & also pass the OAuth 2.0 access token obtained from the `SharePointContext` class.
    1. It then executes the call to the REST API, takes the response and uses the JSON.NET library with the class we created to deserialize the response into a strongly typed class.
    1. Finally it converts the response to a collection of objects that the controller will understand and returns the results back to the caller.

    Add the following function to the `SpChiefExecutiveRepository` class to implement this functionality:

      ````c#
      public async Task<List<SpChiefExecutive>> GetChiefExecutives() {
        StringBuilder requestUri = new StringBuilder(_spContext.SPAppWebUrl.ToString())
          .Append("_api/web/lists/getbytitle('CEO List')/items")
          .Append("?$select=Id,Title,TenureStartYear,TenureEndYear")
          .Append("&$orderby=TenureStartYear");

        HttpClient client = new HttpClient();
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUri.ToString());
        request.Headers.Add("Accept", "application/json;odata=verbose");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _spContext.UserAccessTokenForSPAppWeb);

        HttpResponseMessage response = await client.SendAsync(request);
        string responseString = await response.Content.ReadAsStringAsync();
        var spJsonResponse = JsonConvert.DeserializeObject<SpChiefExecutiveJsonCollection>(responseString);

        var ceoList = new List<SpChiefExecutive>();
        foreach (var item in spJsonResponse.Data.Results) {
          var ceo = new SpChiefExecutive {
            Id = item.Id.ToString(),
            Name = item.Title,
            TenureStartYear = item.TenureStartYear,
            TenureEndYear = item.TenureEndYear
          };
          ceoList.Add(ceo);
        }

        return ceoList.OrderByDescending(c => c.TenureStartYear).ToList();
      }
      ````

  1. Now you need a way to update an item in the list. Add a new function `UpdateCurrentCeo()` that will follow the same process as the last function to communicate with the REST API. 
    1. It first gets a fresh list of customers and finds the one that has a `TenureEndYear` equal to **Present**. It does this to get the ID of the CEO that should be *retired*.
    1. It creates a `existingCeoJson` object to update the CEO record withe a new `TenureEndYear`.
    1. Next, it uses JSON.NET to convert this strongly typed object into a JSON string that it will submit to the REST API using the `HttpRequestMessage`'s `Content` property.

    Add the following function to the `SpChiefExecutiveRepository` class to implement this functionality:

      ````c#
      private async Task UpdateCurrentCeo() {
        // get list of all current CEO's
        var results = await GetChiefExecutives();
        // get CEO with no tenure end date
        var currentCeo = results.FirstOrDefault(ceo => ceo.TenureEndYear == "Present");

        StringBuilder requestUri = new StringBuilder(_spContext.SPAppWebUrl.ToString())
          .Append("_api/web/lists/getbytitle('CEO List')/items")
          .Append("(" + currentCeo.Id + ")");

        // updated ceo
        var existingCeoJson = new SpChiefExecutiveJson {
          Metadata = new JsonMetadata { Type = "SP.Data.CEO_x0020_ListListItem" },
          TenureEndYear = "2014"
        };

        StringContent requestContent = new StringContent(JsonConvert.SerializeObject(
          existingCeoJson,
          Formatting.None,
          new JsonSerializerSettings {
            NullValueHandling = NullValueHandling.Ignore
          }));
        requestContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json;odata=verbose");

        HttpClient client = new HttpClient();
        HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _spContext.UserAccessTokenForSPAppWeb);
        request.Headers.Add("Accept", "application/json;odata=verbose");
        request.Headers.Add("If-Match", "*");
        request.Headers.Add("X-Http-Method", "Merge");
        request.Content = requestContent;

        await client.SendAsync(request);
      }
      ````
  1. Next, add the following method that follows the same pattern as the update method you previously added to insert a new CEO into the SharePoint List:

    ````c#
    private async Task AddNewCeo() {
      StringBuilder requestUri = new StringBuilder(_spContext.SPAppWebUrl.ToString())
        .Append("_api/web/lists/getbytitle('CEO List')/items");

      // updated ceo
      var newCeoJson = new SpChiefExecutiveJson {
        Metadata = new JsonMetadata { Type = "SP.Data.CEO_x0020_ListListItem" },
        Title = "Satya Nadella",
        TenureStartYear = "2014",
        TenureEndYear = "Present"
      };

      StringContent requestContent = new StringContent(JsonConvert.SerializeObject(
        newCeoJson,
        Formatting.None,
        new JsonSerializerSettings {
          NullValueHandling = NullValueHandling.Ignore
        }));
      requestContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json;odata=verbose");

      HttpClient client = new HttpClient();
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, requestUri.ToString());
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _spContext.UserAccessTokenForSPAppWeb);
      request.Headers.Add("Accept", "application/json;odata=verbose");
      request.Headers.Add("If-Match", "*");
      request.Content = requestContent;

      await client.SendAsync(request);
    }
    ````

  1. Because the process of appointing a new CEO involves updating the existing CEO's `TenureEndDate`, create a helper function that will issue both of this calls for you:

    ````c#
    public async Task AppointNewCeo() {

      // update the current ceo to have end date on tenure
      await UpdateCurrentCeo();

      // appoint a new ceo
      await AddNewCeo();
    }
    ````

  1. Finally, add the following function to add the ability to delete items from the list:

    ````c#
    public async Task DeleteFirstPerson() {
      // get list of all current CEO's
      var results = await GetChiefExecutives();
      // get CEO with no tenure end date
      var currentCeo = results.FirstOrDefault(ceo => ceo.Id == "1");

      StringBuilder requestUri = new StringBuilder(_spContext.SPAppWebUrl.ToString())
        .Append("_api/web/lists/getbytitle('CEO List')/items")
        .Append("(" + currentCeo.Id + ")");

      HttpClient client = new HttpClient();
      HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, requestUri.ToString());
      request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _spContext.UserAccessTokenForSPAppWeb);
      request.Headers.Add("Accept", "application/json;odata=verbose");
      request.Headers.Add("If-Match", "*");

      await client.SendAsync(request);
    }
    ````

  At this point we have all the plumbing wired up... now we can add a controller and views to bring visibility of this functionality to the web application.

1. First, add a new class **SpChiefExecutiveViewModel.cs** in the **Models** folder that will be handed off to the views from the controller you will create in a moment:
  
  ````c#
  public class SpChiefExecutiveViewModel {
    public List<SpChiefExecutive> SpChiefExecutives { get; set; }
  }
  ````

1. Now right-click the **Controllers** folder, select **Add => Controller** and select **MVC5 Controller - Empty**. When prompted for a name, use **CeoController**.
  1. This controller will have three methods on it. One to show a list of CEO's, one to appoint a new CEO and one to remove the sample CEO from the list. Therefore add the following code to the `CeoController` class:

    ````c#
    public async Task<ActionResult> Index() {
      var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);

      SpChiefExecutiveViewModel model = new SpChiefExecutiveViewModel();

      SpChiefExecutiveRepository repository = new SpChiefExecutiveRepository(spContext);
      model.SpChiefExecutives = await repository.GetChiefExecutives();

      return View(model);
    }

    public async Task<ActionResult> AppintNewCeo()
    {
      var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);

      SpChiefExecutiveRepository repository = new SpChiefExecutiveRepository(spContext);

      await repository.AppointNewCeo();

      return Redirect("/?SPHostUrl=" +spContext.SPHostUrl);
    }

    public async Task<ActionResult> RemoveSampleCeo()
    {
      var spContext = SharePointContextProvider.Current.GetSharePointContext(HttpContext);

      SpChiefExecutiveRepository repository = new SpChiefExecutiveRepository(spContext);

      await repository.DeleteFirstPerson();

      return Redirect("/?SPHostUrl=" + spContext.SPHostUrl);
    }
    ````

  1. Before moving on, make sure the following `using` statements are at the top of the class to ensure everything resolves if you haven't already fixed it up:

    ````c#
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Mvc;
    using RestServerSideWeb.Models;
    ````

  Next, add a view to show the list of CEO's. 

1. Right-click in the `Index()` method and select **Add View**.
  1. In the wizard, set the following values and click **OK**:
    - View name: **Index**
    - Template: **List**
    - Model class: **SpChiefExecutiveViewModel(RestServerSideWeb.Models)**
    - Create as a partial view: **Unchecked**
    - Reference script libraries: **Checked**
    - Use a layout page: **Checked** & empty
  1. In the view that was created, **Views/Ceo/Index.cshtml**, make sure the code looks like the following. If not, update it where necessary:

    ````html
    @model RestServerSideWeb.Models.SpChiefExecutiveViewModel

    @{
      ViewBag.Title = "List of Microsoft CEOs";
    }

    <h2>Index</h2>

    <p>
      @Html.ActionLink("Appoint 3rd CEO", "AppintNewCeo", "Ceo") | @Html.ActionLink("Delete First Sample CEO", "RemoveSampleCeo", "Ceo")
    </p>
    <table class="table">
      <tr>
        <th>Name</th>
        <th>Tenure</th>
      </tr>

      @foreach (var item in @Model.SpChiefExecutives) {
        <tr>
          <td>
            @item.Name
          </td>
          <td>
            @item.TenureStartYear - @item.TenureEndYear
          </td>
        </tr>
      }
    </table>
    ````

1. Finally, update the layout to contain a link to our new controller & view.
  1. Open the **Views/Shared/_Layout.cshtml**.
  1. Locate where the other navigation elements are: Home, About & Contact
  1. Add the following line immediately after the **Contact** link:

    ````html
    <li>@Html.ActionLink("Microsoft CEOs", "Index", "Ceo")</li>
    ````

1. Save all your changes and press **F5**. To test the project.

   When the browser loads the homepage for the app, first click the **Microsoft CEO's** link in the header.

   Then click the link **Appoint 3rd CEO** to retire the existing CEO and appoint a new CEO.

   Finally click the **Delete First Sample CEO** link to remove the dummy CEO.

> **NOTE** When running this sample, it assumes specific data is present. If you want to rerun the sample, make sure you either retract the Add-in or delete the Add-in form your test site so the next time you run it, the list is recreated with the initial sample data.

Congratulations! You've created a project that uses ASP.NET MVC and server-side code to call the SharePoint 2015 REST API!