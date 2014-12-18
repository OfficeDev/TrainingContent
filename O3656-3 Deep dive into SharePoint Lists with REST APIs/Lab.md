#Deep dive into SharePoint Lists with REST APIs

In this lab you will create two solutions that will interact with the SharePoint REST API. In the first exercise you will create a SharePoint hosted app that will demonstrate how to perform CRUD-Q operations using client-side scripting. In the second exercise you will create a SharePoint provider-hosted app that will demonstrate how to perform CRUD-Q operations using server-side coding with C#.

## Prerequisites
1. You must have one of the following environments:
  1. An Office 365 tenant or 
  1. An On-premises SharePoint 2013 environment
1. You must have the Office Developer Tools for Visual STudio 2013 version 12.0.31105 installed in Visual Studio 2013.

## Exercise 1: SharePoint Hosted App that Does CRUD-Q with JavaScript
*In this first exercise you will create a SharePoint hosted app that will demonstrate how to perform CRUD-Q operations using client-side scripting.*

1. Launch Visual Studio 2013.
1. Create a new SharePoint Hosted App project:
  1. In Visual Studio select **File/New/Project**.
  1. Select the **App for SharePoint** from the **Visual C#/Office-SharePoint/Apps** template category.
  1. Set the name of the project to **RestClientSide** and click **OK**.
  1. In the next page of the wizard, enter the URL of a SharePoint 2013 Developer site to use for testing & set the type of app as a **SharePoint-hosted** app.
  1. Finally click **Finish**
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
    <script type="text/javascript" src="../Scripts/knockout-3.2.0.js"></script>
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
    '/_api/web/lists/getbytitle(\'CeoList\')' +
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
      __metadata:{type:'SP.Data.CeoListListItem'},
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
      '/_api/web/lists/getbytitle(\'CeoList\')' +
      '/items';
    // build request headers
    var requestHeaders = {
      'Accept': 'application/json;odata=verbose',
      'Content-Type': 'application/json;odata=verbose',
      'X-RequestDigest': jQuery("#__REQUESTDIGEST").val()
    };
    // build data object to send to service
    var thirdCeoUpdateData = {
      __metadata: { type: 'SP.Data.CeoListListItem' },
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

   When the browser loads the homepage for the app, first click the **refresh list** button to get all the CEOs into the list on the page.

   Then click the **appoint 3rd ceo** button to retire the existing CEO and appoint a new CEO.

   Finally click the **delete first person** button to remove the dummy CEO.

> **NOTE** When running this sample, it assumes specific data is present. If you want to rerun the sample, make sure you either retract the app or delete the app form your test site so the next time you run it, the list is recreated with the initial sample data.

Congratulations! You've created a project that uses JavaScript and client-side technologies to call the SharePoint 2013 REST API!


## Exercise 2: SharePoint Provider Hosted App that Does CRUD-Q with Server Side Code
*In this second exercise you will create a SharePoint provider-hosted app that will demonstrate how to perform CRUD-Q operations using server-side coding with C#.*

