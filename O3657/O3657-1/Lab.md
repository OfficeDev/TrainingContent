# Creating a SharePoint-hosted Add-in using Office UI Fabric and AngularJS

In this lab you will get hands-on experience working with Office UI Fabric and AngularJS by developing a SharePoint-hosted Add-in which plays the role of a customer relationship management system (CRM).

## Prerequisites: 

1. Before you can start this lab, you must have an Office 365 developer site. You must also have Visual Studio 2015 installed with Update.
1. If you do not yet have an Office 365 developer site, you should step through the lab exercises for module 7 in which you will sign-up with Microsoft to create a new Office 365 developers site.
1. This lab requires you to use multiple starter files or an entire starter project from the GitHub location. You can either download the whole repo as a zip or clone the repo https://github.com/OfficeDev/TrainingContent.git for those familiar with git.

## Exercise 1: Configuring a SharePoint-hosted Add-in with Office UI Fabric and AngularJS
1. Using the browser, navigate to your Office 365 developer site and log on using your credentials. The purpose of this step is to ensure your developer site is accessible before you begin to work with Visual Studio.
1. On your developer workstation, launch Visual Studio as administrator.
1. Create a new project in Visual Studio 2015 by selecting the menu command **File > New > Project**.
1. In the **New Project** dialog, find the **SharePoint Add-in** project template under the **Templates > Visual C# >   Office / SharePoint > Office Add-ins** section. Enter a name of **AngularCRM**, a location of **C:\Demos** and a Solution name of **AngularCRM** and then click the **OK** button.  
![Screenshot of the previous step](Images/Fig01.png)

1. In the **New SharePoint Add-in** wizard, enter the URL for your Office 365 Developer site and select **SharePoint-hosted** for the Add-in hosting model. In the **Specify the target SharePoint version** tab, select **SharePoint Online**. When done, complete the wizard by clicking the **Finish** button.
![Screenshot of the previous step](Images/Fig02.png)  

1. Examine the default project setup for a SharePoint-hosted Add-in. As you can see, it is like a traditional SharePoint solution-based project because you have a Features and Packages node. Note that there are project folders named **Content**, **Images** & **Pages** are actually SharePoint Project Items (SPI) that are Modules and will provision their contents to the respective folders in the Add-in web when the Add-in is installed.  
![Screenshot of the previous step](Images/Fig03.png)
    
1. Right-click on the **AngularCRM** project in the solution Explorer and select **Manage NuGet Packages** to display the **Manage NuGet Packages** dialog. 
    
1. First, install the NuGet package for **AngularJS Core**.  
![Screenshot of the previous step](Images/Fig05.png)
    
1. Then, install the NuGet package for **AngularJS Route**.  
![Screenshot of the previous step](Images/Fig06.png)

1. Close the the **NuGet Package Manager** Tab.
1. Your Add-in will not be using anything from the **Pages** folder. Therefore, you should delete the **Pages** folder from your project by right-clicking on it in the solution Explorer and selecting the **Delete** command.
1. In the solution Explorer, right-click on the top-level node of the **AngularCRM** project and select the **Add > New Folder** command to create a new top-level folder. Name this folder **App**.
1. Add a new HTML file named **start.html** into the **App** folder.
1. Add a new JavaScript file named **App.js** into the **App** folder.  
![Screenshot of the previous step](Images/Fig07.png)

1. Open **start.html** in an editor windows and modify the head section to match the following code listing.

  ````html
        <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=10" />
            <title>Angular CRM</title>
        </head>
  ````
  
1.	Inside the **head** section, reference Office Fabric UI CSS from a CDN and a link to the CSS files in the **Content** folder named **App.css**.

  ````html
        <head>
            <meta charset="utf-8" />
		    <meta http-equiv="X-UA-Compatible" content="IE=10" />
		    <title>Angular CRM</title>
		
		    <link rel="stylesheet" href="http://appsforoffice.microsoft.com/fabric/1.0/fabric.min.css">
            <link rel="stylesheet" href="http://appsforoffice.microsoft.com/fabric/1.0/fabric.components.min.css">
		    <link href="../Content/App.css" rel="stylesheet">
		</head>
   ````   
1.	Add in script links to the JavaScript files in the **scripts** folder for jQuery, as well as **angular.js** and **angular.route.js**. Also, add a link to the **App.js** file which is located in the **App** folder.

  ````html
  		<head>
		    <meta charset="utf-8" />
		    <meta http-equiv="X-UA-Compatible" content="IE=10" />
		    <title>Angular CRM</title>
		
		    <link rel="stylesheet" href="//appsforoffice.microsoft.com/fabric/1.0/fabric.min.css">
            <link rel="stylesheet" href="//appsforoffice.microsoft.com/fabric/1.0/fabric.components.min.css">
		    <link href="../Content/App.css" rel="stylesheet">
		
		    <script src="../Scripts/jquery-1.9.1.js"></script>
		    <script src="../Scripts/angular.js"></script>
		    <script src="../Scripts/angular-route.js"></script>
		    <script src="App.js"></script>
		</head>
  ````  
1.	Update the **body** element by copying and pasting the following HTML layout which uses predefined Office UI Fabric styles such as **ms-NavBar**, **ms-NavBar-items** and **ms-Grid**.

  ````html
    <body class="ms-font-m">
        <div class="ms-NavBar">
            <ul class="ms-NavBar-items">
                <li class="ms-NavBar-item ms-font-xl">
                    <a class="ms-NavBar-link" href="#">Angular CRM</a>
                </li>
                <li class="ms-NavBar-item">
                    <a class="ms-NavBar-link" href="#">Home</a>
                </li>
                <li class="ms-NavBar-item">
                    <a class="ms-NavBar-link" href="#">Add Customer</a>
                </li>
                <li class="ms-NavBar-item">
                    <a class="ms-NavBar-link" href="#">About</a>
                </li>
                <li class="ms-NavBar-item ms-NavBar-item--right">
                    <a id="lnkHostWeb" class="ms-NavBar-link">Back to Host Web</a>
                </li>
            </ul>
        </div>
        <div class="ms-Grid">
            <div id="content-box" ></div>
        </div>
    </body>
  ````          
1. Save and close **start.html**.
1.	Open up **AppManifest.xml** in the designer and update the Add-in's **Start page** setting to point to **start.html**. Also, update the **Title** to something more readable such as **Angular CRM Add-in**.  
![Screenshot of the previous step](Images/Fig08.png)
1. Save and close **AppManifest.xml**.
1. Open **App.js** in an editor window and update its contents to match the following code listing.

  ````js		
		'use strict';
		
		angular.element(document).ready( function () {
		    $("#content-box").text("Hello World");
		});
  ````  
1. It's now time to test the Add-in. Press **{F5}** to begin a new debugging session. Once the Add-in has been installed, Visual Studio will start up Internet Explorer and redirect you to the Add-in's start page. You should see the Add-in's navbar and a test message of "Hello World" as shown in the following screenshot.  
![Screenshot of the previous step](Images/Fig09.png)

1.	Your Add-in will need to read query string parameters. Therefore, you will create a simple jQuery extension to add a few helper functions. Begin by creating a new JavaScript file into the **App** folder named **jquery-extensions.js**. 
![Screenshot of the previous step](Images/Fig10.png)

1.	Add the following code to  **jquery-extensions.js** to extend the jQuery library with two helper methods named **getQueryStringValues** and **getQueryStringValue**.
	
  ````js
  		$.extend({
              
		    getQueryStringValues: function () {
		        var vars = [], hash;
		        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		        for (var i = 0; i < hashes.length; i++) {
		            hash = hashes[i].split('=');
		            vars.push(hash[0]);
		            vars[hash[0]] = hash[1];
		        }
		        return vars;
		    },
				
			getQueryStringValue: function (name) {
			    return decodeURIComponent($.getQueryStringValues()[name]);
			}
		});
  ````
1.	Open **start.html** and add a new script link for named **jquery-extensions.js** right after the script link for the jQuery library.  

  ````html
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=10" />
        <title>Angular CRM</title>

        <link rel="stylesheet" href="http://appsforoffice.microsoft.com/fabric/1.0/fabric.min.css">
        <link rel="stylesheet" href="http://appsforoffice.microsoft.com/fabric/1.0/fabric.components.min.css">
        <link href="../Content/App.css" rel="stylesheet">
        <script src="../Scripts/jquery-1.9.1.js"></script>

        <script src="jquery-extensions.js"></script>

        <script src="../Scripts/angular.js"></script>
        <script src="../Scripts/angular-route.js"></script>
        <script src="App.js"></script>
    </head>
  ````  
1. Save and close **start.html**.
1. Open **App.js** and update its contents to match the following code listing.
		
  ````js
		'use strict';
		
		angular.element(document).ready( function () {
		    var hostWeb = $.getQueryStringValue("SPHostUrl");
		    $("#lnkHostWeb").attr("href", hostWeb);
		});
  ````  
1.	It's time again to test the Add-in. Press **{F5}** to begin a new debugging session. Once the Add-in has been installed, Visual Studio will start up Internet Explorer and redirect you to the Add-in's start page. At this point, you should be able to click the **Back to Host Web** link on the right-hand side of the navbar and successfully navigate back to the host web which you are using for your testing.
1.	Close the Internet explorer to terminate the debugging session and return to Visual studio.
1. The final steps in this exercise will involve adding the **ng-app** directive to the **body** element of **start.html** and adding JavaScript code to properly initialize the Add-in while the Angular framework is loading. Begin by opening **start.html** in an editor window.
1. Locate the opening tag of the **body** element and add the **ng-app** directive with an Add-in name of **AngularCRM**.

        <body class="ms-font-m" ng-app="AngularCRM" >
1.	Save your changes to **start.html**.
1.	Open **App.js** and update its contents so it matches the following code listing.

  ````js
		'use strict';
		
		var crmApp = angular.module("AngularCRM", []);
		
		crmApp.config(function () {		
		    var hostWeb = $.getQueryStringValue("SPHostUrl");
		    $("#lnkHostWeb").attr("href", hostWeb);		
		});
  ````
1.	Test the Add-in by pressing **{F5}** to begin a new debugging session. Once the Add-in has been installed, Visual Studio will start up Internet Explorer and redirect you to the Add-in's start page. At this point, you should be able to click the **Back to Host Web** link on the right-hand side of the navbar and successfully navigate back to the host web which you are using for your testing. It should work just as it did before, it's just now you are using a more angular-specific way of initializing the Add-in.
1.	Close the Internet explorer to terminate the debugging session and return to Visual studio.
  
## Exercise 2: Working with Views, Controllers and Routing
*In this lab, you will continue working with the AngularCRM project you created in the previous lab exercise. You will extend this project by adding several new views and controllers and configuring the Add-in's routing scheme.*

1. Open the **AngularCRM** project in Visual Studio if it is not already open.
2. Create a new folder named **views** inside the **App** folder.
3. Create five new HTML files inside the **views** folder named **about.html**, **edit.html**, **home.html**, **new.html** and **view.html**.  
![Screenshot of the previous step](Images/Fig11.png)
4. Update the contents of **home.html** to match the following listing and save your changes.

		<h3>Customer List</h3>
5. Update the contents of **new.html** to match the following listing and save your changes.

		<h3>New Customer</h3>
6. Update the contents of **view.html** to match the following listing and save your changes.

		<h3>View Customer</h3>
7. Update the contents of **edit.html** to match the following listing and save your changes.

		<h3>Edit Customer</h3>
8. Update the contents of **about.html** to match the following listing and save your changes.
		
		<h3 ng-bind="title"></h3>		
		<p ng-bind="description"></p>
9. Create a new JavaScript file named **controllers.js** in the **App** folder.  
![Screenshot of the previous step](Images/Fig12.png)
10. Copy and paste the following code into **controllers.js** to provide a controller starting point for each of the views.
		
		'use strict';
		
		var app = angular.module('AngularCRM');
		
		app.controller('homeController',
		    function ($scope) {        
		    }
		);
		
		app.controller('newController',
		    function ($scope) {
		    }
		);
		
		app.controller('viewController',
		    function ($scope) {
		    }
		);
		
		app.controller('editController',
		    function ($scope) {
		    }
		);
		
		app.controller('aboutController',
		    function ($scope) {
		    }
		);
11. Implement the **aboutController** controller function to create a **title** property and a **description** property on the **$scope** variable and to initialize their values using string literals.
		
		app.controller('aboutController',
		    function ($scope) {
        		$scope.title = "About the Angular CRM Add-in"
        		$scope.description = "The Angular CRM Add-in is a demo Add-in which I wrote using Office UI Fabric and AngularJS"
		    }
		);
12. Update the **head** section in **start.html** to include a script link for **controllers.js** just after the script link to **App.js** and then save your changes.
		
		<script src="App.js"></script>
		<script src="controllers.js"></script>
13. Now that you have created the views and controllers, it's time to configure the Add-in's routing scheme. Begin by opening **App.js** in an editor window.
14. Locate the line of code which calls **angular.module** and update it to include a dependency on **ngRoute** module.
		
		var crmApp = angular.module("AngularCRM", ['ngRoute']);
15. Locate the line of code which calls **angular.config** and modify the controller function parameter list to accept a parameter named **$routeProvider**.
		
		crmApp.config(function ($routeProvider) {
16. At this point, the code in **App.js** should match the following code listing.
		
		'use strict';
		
		var crmApp = angular.module("AngularCRM", ['ngRoute']);
		
		crmApp.config(function ($routeProvider) {
		
		    var hostWeb = $.getQueryStringValue("SPHostUrl");
		    $("#lnkHostWeb").attr("href", hostWeb);
		
		});
17. Add the following code to configure the Add-in's routing map just after the code which updates the **href** attribute of the anchor element with an id of **lnkHostWeb**.

		$routeProvider.when("/", {
		    templateUrl: 'views/home.html',
		    controller: "homeController"
		}).when("/view/:id", {
		    templateUrl: 'views/view.html',
		    controller: "viewController"
		}).when("/edit/:id", {
		    templateUrl: 'views/edit.html',
		    controller: "editController"
		}).when("/new", {
		    templateUrl: 'views/new.html',
		    controller: "newController"
		}).when("/about", {
		    templateUrl: 'views/about.html',
		    controller: "aboutController"
		}).otherwise({
		    redirectTo: "/"
		});
18. When you are done, the code you have written in **App.js** should match the following code listing.

		'use strict';
		
		var crmApp = angular.module("AngularCRM", ['ngRoute']);
		
		crmApp.config(function ($routeProvider) {
		
		    var hostWeb = $.getQueryStringValue("SPHostUrl");
		    $("#lnkHostWeb").attr("href", hostWeb);
		
		    // config route map
		    $routeProvider.when("/", {
		        templateUrl: 'views/home.html',
		        controller: "homeController"
		    }).when("/view/:id", {
		        templateUrl: 'views/view.html',
		        controller: "viewController"
		    }).when("/edit/:id", {
		        templateUrl: 'views/edit.html',
		        controller: "editController"
		    }).when("/new", {
		        templateUrl: 'views/new.html',
		        controller: "newController"
		    }).when("/about", {
		        templateUrl: 'views/about.html',
		        controller: "aboutController"
		    }).otherwise({
		        redirectTo: "/"
		    });
		
		});
19. The last remaining task before testing is to update the navigation links on **start.html**. Begin by opening **start.html** and locating the **a** elements with the links titled **Home**, **Add Customer** and **About**.
20. Update the **href** attribute for the **Angular CRM** link to **#/**, update the **href** attribute for the **Home** link to **#/**, Update the **href** attribute for the **Add Customer** link to **#/new** and update the **href** attribute for the **About** link to **#/about**.  

  ````html
        <ul class="ms-NavBar-items">
            <li class="ms-NavBar-item ms-font-xl">
                <a class="ms-NavBar-link" href="#/">Angular CRM</a>
            </li>
            <li class="ms-NavBar-item">
                <a class="ms-NavBar-link" href="#/">Home</a>
            </li>
            <li class="ms-NavBar-item">
                <a class="ms-NavBar-link" href="#/new">Add Customer</a>
            </li>
            <li class="ms-NavBar-item">
                <a class="ms-NavBar-link" href="#/about">About</a>
            </li>
            <li class="ms-NavBar-item ms-NavBar-item--right">
                <a id="lnkHostWeb" class="ms-NavBar-link">Back to Host Web</a>
            </li>
        </ul>
  ````		
21.	Down in the **body** section of **start.html**, locate the div element with the id of **content-box** and add the **ng-view** directive.

  ````html
        <div class="ms-Grid">
            <div id="content-box" ng-view></div>
        </div>
  ````        
22.	Save your changes to **start.html**.
23. Test the routing scheme of the Add-in by pressing **{F5}** to begin a new debugging session. Once the app has been installed, Visual Studio will start up Internet Explorer and redirect you to the app's start page. At this point, you should be able to click on the navbar links titled **Home**, **Add Customer** and **About** to navigate between these three views.
24. Click on the **About** link to navigate to the Add-in's **About** page. You should be able to verify that the **about** view is properly displaying the values of the **title** property and the **description** property that were written to the **$scope** variable by **aboutController**.   
![Screenshot of the previous step](Images/Fig13.png)
25. You have now successfully set up the routing scheme for the Add-in. Close the Internet explorer to terminate the debugging session and return to Visual studio.

## Exercise 3: Extending the AngularCRM Project with a Custom Service
*In this exercise you will extend the AngularCRM Add-in by adding a SharePoint list and then creating a custom angular service to read and write items to and from the list.*

1. Open the **AngularCRM** project in Visual Studio if it is not already open.
2. Create a new top-level folder named **Lists** at the root of the **AngularCRM** project.  
![Screenshot of the previous step](Images/Fig14.png) 
3. Right-click on the **Lists** folder and select **Add > New Item**.
4. In the **Add New Item** dialog, click the **Office/SharePoint** group on the left and then select the **List** template. Enter a name of **Customers** and click **Add**.  
![Screenshot of the previous step](Images/Fig15.png) 
5. In the **SharePoint Customization Wizard** dialog, enter a list display name of **Customers**. Select the option **Create a list instance based on an existing list template** and set the list template type to **Contacts**.  
![Screenshot of the previous step](Images/Fig16.png)
6. Click the **Finish** button in the **SharePoint Customization Wizard** to create the new project item for the list.  Inside the **Lists** folder, you should be able to see a **Customers** folder which contains an element manifest named **elements.xml**.  
![Screenshot of the previous step](Images/Fig17.png)
7. In this step you will modify the **elements.xml** so that the **Customers** list will be created with a pre-populated set of customer items.
	1.  Using Windows Explorer, look inside the **Starter Files** folder within this lab located at [\\\O3657\O3657-1](.) and locate the file named **Customers_Elements.xml.txt**.
	2.  Open **Customers_Elements.xml.txt** in NOTEPAD and copy all its contents into the Windows clipboard.
	3.  Return to Visual Studio and make sure that the **elements.xml** file for the **Customers** list is open in an editor window.
	4.  Delete all the existing content from **elements.xml**.
	5.  Paste in the contents of the clipboard.
	6.  Save your changes to **elements.xml**.
8. Look at the XML content inside **elements.xml** and examine how it uses a **Data** element with an inner **Rows** element to pre-populate the **Customers** list with a set of sample customer items to assist in your testing and debugging.  

  ````xml
    <?xml version="1.0" encoding="utf-8"?>
    <Elements xmlns="http://schemas.microsoft.com/sharepoint/">
        <ListInstance Title="Customers"
                        OnQuickLaunch="TRUE"
                        TemplateType="105"
                        FeatureId="00bfea71-7e6d-4186-9ba8-c047ac750105"
                        Url="Lists/Customers"
                        Description="My List Instance">
            <Data>
                <Rows>
                    <Row>
                        <Field Name="FirstName">Quincy</Field>
                        <Field Name="Title">Nelson</Field>
                        <Field Name="Company">Benthic Petroleum</Field>
                        <Field Name="WorkPhone">1(340)608-7748</Field>
                        <Field Name="HomePhone">1(340)517-3737</Field>
                        <Field Name="Email">Quincy.Nelson@BenthicPetroleum.com</Field>
                    </Row>
                    <Row>
                        <Field Name="FirstName">Jude</Field>
                        <Field Name="Title">Mason</Field>
                        <Field Name="Company">Cyberdyne Systems</Field>
                        <Field Name="WorkPhone">1(203)408-0466</Field>
                        <Field Name="HomePhone">1(203)411-0071</Field>
                        <Field Name="Email">Jude.Mason@CyberdyneSystems.com</Field>
                    </Row>

  ...
  
                </Rows>
            </Data>
        </ListInstance>
    </Elements>  
  ````
9. Save and close **elements.xml**.
10. In the **App** folder, create a new JavaScript file named **services.js**.  
![Screenshot of the previous step](Images/Fig19.png)
11. Open **start.html** and add a script link for **services.js** just after the script link to **controllers.js**.

		<script src="App.js"></script>
		<script src="controllers.js"></script>
		<script src="services.js"></script>
12. Save and close **start.html**.
13. Open **services.js** in an editor window.
14. Copy and paste the following code into **services.js** to provide a starting point for your service implementation.
		
		'use strict';
		
		var app = angular.module('AngularCRM');
		
		app.factory("wingtipCrmService",
		  function ($http) {
              // create service object
		      var service = {};

              // TODO: add behavior to service object

              // return service object to angular framework
		      return service;
		  });
15. Copy the following code listing to the clipboard. Return to Visual Studio and paste the clipboard contents into **services.js** at a point just below the line with the comment **TODO: add behavior to service object**. This code will initialize the service by retrieving and caching a form digest value in a variable named **requestDigest**.

  ````js		
		// retrieve and cache SharePoint form digest value
		var requestDigest;

		$http({
		  method: 'POST',
		  url: "../_api/contextinfo",
		  headers: { "Accept": "application/json; odata=verbose" }
		}).success(function (data) {
		  requestDigest = data.d.GetContextWebInformation.FormDigestValue
		});
  ````  
14.	Just below the code you added in the previous step, copy and paste the code from the following code listing to add a function to the service named **getCustomers**.
		
  ````js		
		service.getCustomers = function () {
		  var restQueryUrl = "../_api/web/lists/getByTitle('Customers')/items/" +
		                     "?$select=ID,Title,FirstName,WorkPhone,HomePhone,Email";
		  return $http({
		      method: 'GET',
		      url: restQueryUrl,
		      headers: { "Accept": "application/json; odata=verbose" }
		  })
		}
  ````
15. Open **controllers.js** in an editor window.
16. Locate the code which defines the controller function for **homeController**. In the function parameter list, add a second parameter named **wingtipCrmService** in addition to the **$scope** parameter that is already defined.

		app.controller('homeController',
		    function ($scope, wingtipCrmService) {
		    }
		);
17. Implement the **homeController** function as shown in the following code listing.

		app.controller('homeController',
		    function ($scope, wingtipCrmService) {
		
		        wingtipCrmService.getCustomers().success(function (data) {
		            $scope.customers = data.d.results;
		        });
		
		    }
		);
18. Open **Home.html** in an editor window. Copy the following HTML layout and paste it into **Home.html** to replace the existing content.

        <h3>Customer List</h3>

        <div class="ms-Table">
            <div class="ms-Table-row">
                <span class="ms-Table-cell">ID</span>
                <span class="ms-Table-cell">First Name</span>
                <span class="ms-Table-cell">Last Name</span>
                <span class="ms-Table-cell">Work Phone</span>
                <span class="ms-Table-cell">Home Phone</span>
                <span class="ms-Table-cell">Email Address</span>
                <span class="ms-Table-cell">&nbsp;</span>
                <span class="ms-Table-cell">&nbsp;</span>
                <span class="ms-Table-cell">&nbsp;</span>
            </div>
            <div class="ms-Table-row" ng-repeat="customer in customers">
                <span class="ms-Table-cell">{{customer.Id}}</span>
                <span class="ms-Table-cell">{{customer.FirstName}}</span>
                <span class="ms-Table-cell">{{customer.Title}}</span>
                <span class="ms-Table-cell">{{customer.WorkPhone}}</span>
                <span class="ms-Table-cell">{{customer.HomePhone}}</span>
                <span class="ms-Table-cell">{{customer.Email}}</span>
                <span class="ms-Table-cell"><a href="#/view/{{customer.Id}}" class="ms-Link">View</a></span>
                <span class="ms-Table-cell"><a href="#/edit/{{customer.Id}}" class="ms-Link">Edit</a></span>
                <span class="ms-Table-cell"><a href="#/" data-ng-click="deleteCustomer(customer.Id)" class="ms-Link">Delete</a></span>
            </div>
        </div>
21. Test your work by pressing **{F5}** to begin a debugging session. The Add-in should initialize the start page using the view defined in **Home.html** which should display a table of customers as shown in the following screenshot.  
![Screenshot of the previous step](Images/Fig20.png)
22. Close Internet Explorer to terminate your debugging session and return to Visual Studio.
23. Now it is time to implement the remaining functionality needed for the service. Begin by opening **services.js** and positioning your cursor just below the **getCustomers** function you added earlier.
24. Add the following function implementation to the service for the **getCustomer** function.
		
		service.getCustomer = function (id) {
		  var restQueryUrl = "../_api/web/lists/getByTitle('Customers')/items(" + id + ")/" +
		                     "?$select=ID,Title,FirstName,WorkPhone,HomePhone,Email";
		  return $http({
		      method: 'GET',
		      url: restQueryUrl,
		      headers: { "Accept": "application/json; odata=verbose" }
		  })
		}
25. Add the following function implementation to the service for the **deleteCustomer** function.

		service.deleteCustomer = function (id) {
		  var restQueryUrl = "../_api/web/lists/getByTitle('Customers')/items(" + id + ")";
		  return $http({
		      method: 'DELETE',
		      url: restQueryUrl,
		      headers: {
		          "Accept": "application/json; odata=verbose",
		          "X-RequestDigest": requestDigest,
		          "If-Match": "*"
		      }
		  });
		}
26. Add the following function implementation to the service for the **addCustomer** function.

		service.addCustomer = function (FirstName, LastName, WorkPhone, HomePhone, Email) {
		  var restQueryUrl = "../_api/web/lists/getByTitle('Customers')/items";
		
		  var customerData = {
		      __metadata: { "type": "SP.Data.CustomersListItem" },
		      Title: LastName,
		      FirstName: FirstName,
		      WorkPhone: WorkPhone,
		      HomePhone: HomePhone,
		      Email: Email
		  };
		
		  var requestBody = JSON.stringify(customerData);		
		
		  return $http({
		      method: 'POST',
		      url: restQueryUrl,
		      contentType: "application/json;odata=verbose",
		      data: requestBody,
		      headers: {
		          "Accept": "application/json; odata=verbose",
		          "X-RequestDigest": requestDigest,
		          "content-type": "application/json;odata=verbose"
		      }
		  });
		}
27. Add the following function implementation to the service for the **updateCustomer** function.
		
		service.updateCustomer = function (id, FirstName, LastName, WorkPhone, HomePhone, Email, etag) {
		  var restQueryUrl = "../_api/web/lists/getByTitle('Customers')/items(" + id + ")";
		
		  var customerData = {
		      __metadata: { "type": "SP.Data.CustomersListItem" },
		      Title: LastName,
		      FirstName: FirstName,
		      WorkPhone: WorkPhone,
		      HomePhone: HomePhone,
		      Email: Email
		  };
		
		  var requestBody = JSON.stringify(customerData);
		
		  return $http({
		      method: 'POST',
		      url: restQueryUrl,
		      contentType: "application/json;odata=verbose",
		      data: requestBody,
		      headers: {
		          "Accept": "application/json; odata=verbose",
		          "X-RequestDigest": requestDigest,
		          "content-type": "application/json;odata=verbose",
		          "If-Match": etag,
		          "X-HTTP-METHOD": "PATCH"
		      }
		  });
		}
28. Save your changes to **services.js**.
29. Open **controllers.js** in an editor window.
30. Replace the code which creates the **homeController** with the following code which adds the **deleteCustomer** function to **$scope** so that this function can be called from the **data-ng-click** attribute which has already been added to the home view.

        app.controller('homeController',
            function ($scope, $route, wingtipCrmService) {
                wingtipCrmService.getCustomers().success(function (data) {
                    $scope.customers = data.d.results;
                    // add behavior function for view to call
                    $scope.deleteCustomer = function (id) {
                        wingtipCrmService.deleteCustomer(id).success(function (data) {
                            $route.reload();
                        });
                    }
                });
            }
        );
31. Replace the code which creates the **newController** with the following code.
		
		app.controller('newController',
		    function ($scope, $location, wingtipCrmService) {
		
		        $scope.customer = {};
		        $scope.customer.FirstName = "";
		        $scope.customer.Title = "";
		        $scope.customer.WorkPhone = "";
		        $scope.customer.HomePhone = "";
		        $scope.customer.Email = "";
		
		        $scope.addCustomer = function () {
		            var firstName = $scope.customer.FirstName;
		            var lastName = $scope.customer.Title;
		            var workPhone = $scope.customer.WorkPhone;
		            var homePhone = $scope.customer.HomePhone;
		            var email = $scope.customer.Email;
		            wingtipCrmService.addCustomer(firstName, lastName, workPhone, homePhone, email)
		              .success(function (data) {
		                  $location.path("/");
		              });
		        }
		    }
		);
32. Replace the code which creates the **viewController** with the following code.
		
		app.controller('viewController',
		    function ($scope, $routeParams, wingtipCrmService) {
		        var id = $routeParams.id;
		        wingtipCrmService.getCustomer(id).success(function (data) {
		            $scope.customer = data.d;
		        });
		    }
		);
33. Replace the code which creates the **editController** with the following code.


		app.controller('editController',
		    function ($scope, $routeParams, $location, wingtipCrmService) {
		        var id = $routeParams.id;
		        wingtipCrmService.getCustomer(id).success(function (data) {
		            $scope.customer = data.d;
		
		            $scope.updateCustomer = function () {
		                var firstName = $scope.customer.FirstName;
		                var lastName = $scope.customer.Title;
		                var workPhone = $scope.customer.WorkPhone;
		                var homePhone = $scope.customer.HomePhone;
		                var email = $scope.customer.Email;
		                var etag = $scope.customer.__metadata.etag;
		                wingtipCrmService.updateCustomer(id, firstName, lastName, workPhone, homePhone, email, etag)
		                .success(function (data) {
		                    $location.path("/");
		                });
		            }
		        });
		    }
		);
34. Save your changes to **controllers.js**.
35. Open the view file in the **views** folder named **new.html** and replace the contents with the following HTML layout.
		
        <h3>New Customer</h3>

        <div class="ms-Grid">
            <div class="ms-TextField">
                <label for="txtFirstName" class="ms-Label">First Name:</label>
                <div class="ms-u-lg6">
                    <input id="txtFirstName" type="text" class="ms-TextField-field" ng-model="customer.FirstName">
                </div>
            </div>
            <div class="ms-TextField">
                <label for="txtLastName" class="ms-Label">Last Name:</label>
                <div class="ms-u-lg6">
                    <input id="txtLastName" type="text" class="ms-TextField-field" ng-model="customer.Title">
                </div>
            </div>
            <div class="ms-TextField">
                <label for="txtWorkPhone" class="ms-Label">Work Phone:</label>
                <div class="ms-u-lg6">
                    <input id="txtWorkPhone" type="text" class="ms-TextField-field" ng-model="customer.WorkPhone">
                </div>
            </div>
            <div class="ms-TextField">
                <label for="txtHomePhone" class="ms-Label">Home Phone:</label>
                <div class="ms-u-lg6">
                    <input id="txtHomePhone" type="text" class="ms-TextField-field" ng-model="customer.HomePhone">
                </div>
            </div>
            <div class="ms-TextField">
                <label for="txtEMailAddress" class="ms-Label">EMail Addresss:</label>
                <div class="ms-u-lg6">
                    <input id="txtEMailAddress" type="text" class="ms-TextField-field" ng-model="customer.Email">
                </div>
            </div>
            <div class="ms-TextField">
                <button class="ms-Button" data-ng-click="addCustomer()">
                    <span class="ms-Button-icon"><i class="ms-Icon ms-Icon--plus"></i></span>
                    <span class="ms-Button-label">Save</span>
                </button>
            </div>
        </div>

        <hr />

        <a href="#/" class="ms-Link">Return to customers list</a>
36. Save and close **new.html**.
37. Open the view file in the **views** folder named **view.html** and replace the contents with the following HTML layout.
		
        <h3>View Customer</h3>

        <div class="ms-Grid">
                <div class="ms-TextField">
                    <label for="txtID" class="ms-Label">ID:</label>
                    <div class="ms-u-lg6">
                        <input id="txtID" type="text" readonly class="ms-TextField-field" ng-model="customer.ID">
                    </div>
                </div>
                <div class="ms-TextField">
                    <label for="txtFirstName" class="ms-Label">First Name:</label>
                    <div class="ms-u-lg6">
                        <input id="txtFirstName" type="text" readonly class="ms-TextField-field" ng-model="customer.FirstName">
                    </div>
                </div>
                <div class="ms-TextField">
                    <label for="txtLastName" class="ms-Label">Last Name:</label>
                    <div class="ms-u-lg6">
                        <input id="txtLastName" type="text" readonly class="ms-TextField-field" ng-model="customer.Title">
                    </div>
                </div>
                <div class="ms-TextField">
                    <label for="txtWorkPhone" class="ms-Label">Work Phone:</label>
                    <div class="ms-u-lg6">
                        <input id="txtWorkPhone" type="text" readonly class="ms-TextField-field" ng-model="customer.WorkPhone">
                    </div>
                </div>
                <div class="ms-TextField">
                    <label for="txtHomePhone" class="ms-Label">Home Phone:</label>
                    <div class="ms-u-lg6">
                        <input id="txtHomePhone" type="text" readonly class="ms-TextField-field" ng-model="customer.HomePhone">
                    </div>
                </div>
                <div class="ms-TextField">
                    <label for="txtEMailAddress" class="ms-Label">EMail Addresss:</label>
                    <div class="ms-u-lg6">
                        <input id="txtEMailAddress" type="text" readonly class="ms-TextField-field" ng-model="customer.Email">
                    </div>
                </div>
        </div>

        <hr />

        <a class="ms-Link" href="#/edit/{{customer.Id}}">Edit this Customer</a>
        <br />
        <a href="#/" class="ms-Link" >Return to Customers List</a>
38. Save and close **view.html**.
39. Open the view file in the **views** folder named **edit.html** and replace the contents with the following HTML layout.
		
        <h3>Edit Customer</h3>

        <div class="ms-Grid">
            <div class="ms-TextField">
                <label for="txtID" class="ms-Label">ID:</label>
                <div class="ms-u-lg6">
                    <input id="txtID" type="text" readonly class="ms-TextField-field" ng-model="customer.ID">
                </div>
            </div>
            <div class="ms-TextField">
                <label for="txtFirstName" class="ms-Label">First Name:</label>
                <div class="ms-u-lg6">
                    <input id="txtFirstName" type="text" class="ms-TextField-field" ng-model="customer.FirstName">
                </div>
            </div>
            <div class="ms-TextField">
                <label for="txtLastName" class="ms-Label">Last Name:</label>
                <div class="ms-u-lg6">
                    <input id="txtLastName" type="text" class="ms-TextField-field" ng-model="customer.Title">
                </div>
            </div>
            <div class="ms-TextField">
                <label for="txtWorkPhone" class="ms-Label">Work Phone:</label>
                <div class="ms-u-lg6">
                    <input id="txtWorkPhone" type="text" class="ms-TextField-field" ng-model="customer.WorkPhone">
                </div>
            </div>
            <div class="ms-TextField">
                <label for="txtHomePhone" class="ms-Label">Home Phone:</label>
                <div class="ms-u-lg6">
                    <input id="txtHomePhone" type="text" class="ms-TextField-field" ng-model="customer.HomePhone">
                </div>
            </div>
            <div class="ms-TextField">
                <label for="txtEMailAddress" class="ms-Label">EMail Addresss:</label>
                <div class="ms-u-lg6">
                    <input id="txtEMailAddress" type="text" class="ms-TextField-field" ng-model="customer.Email">
                </div>
            </div>
            <div class="ms-TextField">
                <label for="txtID" class="ms-Label">ETag:</label>
                <div class="ms-u-lg6">
                    <input id="txtID" type="text" readonly class="ms-TextField-field" ng-model="customer.__metadata.etag">
                </div>
            </div>
            <div class="ms-TextField">
                <button class="ms-Button" data-ng-click="updateCustomer()">
                    <span class="ms-Button-icon"><i class="ms-Icon ms-Icon--plus"></i></span>
                    <span class="ms-Button-label">Save</span>
                </button>
            </div>
        </div>

        <hr />

        <a href="#/" class="ms-Link">Return to customers list</a>
40. Save and close **edit.html**.
41. Test your work by pressing **{F5}** to begin a debugging session. The Add-in should initialize the start page using the view defined in **Home.html** which should display a table of customers. However, now the Add-in should support full CRUD functionality.
42. Click on the **Add Customer** link and make sure you are able to add a new customer item.
43. Test the links in the table in the home view. You should be able to click **View** and navigate to a view which displays the details of a single item.
44. You should be able to click **Edit** and navigate to a view which allows you to edit and existing item and save your changes.
45. You should be able to click **Delete** and delete a customer item from the list.
46. You have now completed this lab.