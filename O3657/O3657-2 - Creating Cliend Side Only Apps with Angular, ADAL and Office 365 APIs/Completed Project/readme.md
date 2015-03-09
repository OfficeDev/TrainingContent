Expense Manager with AngularJS, SharePoint/Office 365 and Microsoft Azure Active Directory
===============

If you're new to AngularJS check out the [AngularJS in 60-ish Minutes](http://weblogs.asp.net/dwahlin/video-tutorial-angularjs-fundamentals-in-60-ish-minutes) video tutorial or download the [free eBook](http://weblogs.asp.net/dwahlin/angularjs-in-60-ish-minutes-the-ebook). Also check out [The AngularJS Magazine](http://flip.it/bdyUX) for up-to-date information on using AngularJS to build Single Page Applications (SPAs).


A presentation on all samples can be found in the [presentation folder](presentation) within this repository.

![](ExpenseManager/Content/images/readmeImages/channel9scrnsht.png)

An on-demand web cast recorded by Jeremy Thake can be found on [Channel 9](http://channel9.msdn.com/Blogs/Office-365-Dev/Getting-started-with-the-Expense-Tracker-AngularJS-Office-365-API-Code-Sample).

This application is a stand-alone AngularJS application that performs CRUD operations against SharePoint/Office 365. Authentication relies on Microsoft Azure Active Directory.
This application demonstrates:

* Consuming data provided by SharePoint/Office 365 RESTful APIs
* Authentication against Microsoft Azure Active Directory 
* A custom "middle-man" proxy that allows cross-domain calls to be made to SharePoint/Office 365
* A complete application with read-only and editable data
* Using AngularJS with $http in a factory to access a backend RESTful service
* Techniques for showing multiple views of data (card view and list view)
* Custom filters for filtering customer and product data
* A custom directive to ensure unique values in a form for email 
* A custom directive that intercepts $http and jQuery XHR requests (in case either are used) and displays a loading dialog
* A custom directive that handles highlighting menu items automatically based upon the path navigated to by the user
* Form validation using AngularJS


![](ExpenseManager/Content/images/readmeImages/screenshot.png)

#Prerequisites

* Azure subscription (trial will work)
* Office 365 tenant
* SharePoint site collection in your Office 365 tenant

#Office 365 and SharePoint Setup

Following are the steps to upload the ExpensesTrackerSiteTemplate.wsp template into an existing Office 365/SharePoint site collection solution folder. Then create a Site instance within that site collection based on that site template called "Expense Tracker Site Template". This will create an Expenses site with 3 lists for employees, expenses, and states.

1. Go To the Admin Screen

    ![Active Directory](ExpenseManager/Content/images/readmeImages/1-GoToAdminScreen.png)

1. Create a new Site Collection

    ![Active Directory](ExpenseManager/Content/images/readmeImages/2-CreateNewSiteCollection.png)

1. Fill in New Site Collection Form, select template later under the custom tab for the template of the top level site.

    ![Active Directory](ExpenseManager/Content/images/readmeImages/3-FillInSiteCollectionFormChooseTemplateLater.png)

1. Click on the Solution Gallery Link.

    ![Active Directory](ExpenseManager/Content/images/readmeImages/4-clickonsolutiongallery.png)

1. Click the Upload Solution icon in the ribbon.

    ![Active Directory](ExpenseManager/Content/images/readmeImages/5-clickUploadSolution.png)

1. Browse to the .wsp file included in the package.  (in this case it is the expenses.wsp) and upload the solution.

    ![Active Directory](ExpenseManager/Content/images/readmeImages/6-browsetosolutionfromgithubfolder.png)
1. Activate the Solution.

    ![Active Directory](ExpenseManager/Content/images/readmeImages/7-ActivateSolution.png)
1. Click the Browse tab to get back to the home page.

    ![Active Directory](ExpenseManager/Content/images/readmeImages/8-clickbrowse.png)

1. Click the Custom tab.

    ![Active Directory](ExpenseManager/Content/images/readmeImages/9-clickcustomtab.png)

1. Select the Expenses (the one you uploaded and activated) solution and click OK.

    ![Active Directory](ExpenseManager/Content/images/readmeImages/10-selectexpensesandclickok.png)

1. Set the default SharePoint Security Groups.  Sometimes they line up perfectly, sometimes you might have to line them up with the drop down menu.

    ![Active Directory](ExpenseManager/Content/images/readmeImages/11-setdefaultgroups.png)

1. Browse to the Home Page.

    ![Active Directory](ExpenseManager/Content/images/readmeImages/12-HomePageTopLevelSiteWithLists.png)

1. If needed click on Site Contents to see the lists.


#Azure and Application Setup
To get the application running you'll need to do the following:

1. Login to your Azure Management Portal and select Active Directory from the left menu.

    ![Active Directory](ExpenseManager/Content/images/readmeImages/ManagementServicesMenuItem.png)

1. Click on the directory you'd like to use (Default Directory will work fine)

    ![Active Directory](ExpenseManager/Content/images/readmeImages/DefaultDirectory.png)

1. Click the "Add an application you're developing" link
1. Give the application a name of Expense Manager:

    ![Active Directory](ExpenseManager/Content/images/readmeImages/AddApplication.png)

1. Click the arrow to go to the next screen and enter the following for the information in the screen. Substitute your Office 365 Tenant ID for YOUR_TENANT: 

    ![Active Directory](ExpenseManager/Content/images/readmeImages/ApplicationProperties.png)

1. Press the Complete button in the wizard to create the application.
1. Click the CONFIGURE link at the top of the Expense Manager application screen.
1. Scroll to the "keys" section and select **1 year** from the dropdown.
1. Note the Client ID and key value that are displayed. You'll need to update the application's web.config file with these values in a moment.

    ![Active Directory](ExpenseManager/Content/images/readmeImages/ClientID.png)

1. Scroll down to the "permissions to other applications" section of the screen.
1. In the first dropdown in the Microsoft Azure Active Directory column select Office 365 SharePoint Online and make the selections shown next:

    ![Active Directory](ExpenseManager/Content/images/readmeImages/Permissions.png)

1. Click the Select application drop and add the following permission for Microsoft Azure Active Directory (see the first entry in the image below):

    ![Active Directory](ExpenseManager/Content/images/readmeImages/ADPermissions.png)

1. Click the Save icon at the bottom of the interface.
1. Open the Expense Manager's .sln file in Visual Studio 2013 or higher (click Download Zip in Github and extract the project if you haven't already)
1. Open web.config and replace Tenant, TenantID, ClientID and Password values with the values displayed in the Azure Directory screen shown earlier:

```html
    <add key="ida:Tenant" value="YOUR TENANT DOMAIN NAME (ex: acmecorp)" />
    <add key="ida:TenantID" value="YOUR ACTIVE DIRECTORY TENANTID (a GUID)" />
    <add key="ida:ClientID" value="YOUR ACTIVE DIRECTORY APP CLIENTID" />
    <add key="ida:Password" value="YOUR ACTIVE DIRECTORY APP PASSWORD" />
```

1. Open index.html from the root of the project and scroll to the bottom.
1. Locate the expenseManager.baseSPUrl variable and update YOUR_TENANT with your Office 365 tenant ID. 
1. Press F5 to build and run the application. 
1. You should be taken to a login screen where you can login using your Office 365 credentials.
