# Creating Client-Side Only Apps with Angular, ADAL & Office 365 APIs
In this lab, you will take an existing web application built with [Angular](http://www.angularjs.org) that uses static JSON files as it's data source and add two things:

- Secure multiple routes in the application using the ADAL JS library for Azure Active Directory to take advantage of the OAuth2 Implicit Flow.
- Replace existing calls to static JSON files to use the SharePoint Online REST & Office 365 Files APIs, taking advantage of their support for CORS.

The important take-away from this lab is to understand how you can create a 100% client-side application that is secured (with Azure AD) and leverages data in Office 365 using the REST APIs that support CORS.

## Prerequisites
1. You must have an Office 365 tenant complete this lab. If you do not have one, the lab for **[O3651-7 Setting up your Developer environment in Office 365](https://github.com/OfficeDev/TrainingContent/blob/master/O3651/O3651-5%20Getting%20started%20with%20Office%20365%20APIs/Lab.md)** shows you how to obtain a trial.
1. You must have [node.js](http://nodejs.org/) installed on your development environment. You can get node.js from the [downlods](http://nodejs.org/download/) section on their site. Certain [node.js packages](https://www.npmjs.org) available via [NPM](htttps://www.npmjs.org) will be used in creating this Office App.
1. You will need a text editor for this lab. The editor **[Brackets](http://www.brackets.io)** is used in this lab.

## Exercise 1: Configure the Starter Project
In this exercise, you will examine and customize the **Starter Project** for the remainder of the lab.

1. Locate the starter project found in the [StarterFiles](StarterFiles).
1. Open the project in any text editor, such as [Visual Studio](https://www.visualstudio.com/) or [Brackets](http://www.brackets.io) or [WebStorm](https://www.jetbrains.com/webstorm/) or Notepad.
1. Download all NPM packages (used to build & self-host the project) and bower packages (used for external 3rd party script libraries).
  1. Open a command window and navigate to the [StarterFiles](StarterFiles) folder.
  1. Enter the following in the command prompt to download all NPM packages. When it completes it will then download all the bower packages as well.

    ````
    npm install
    ````

    > The command `npm install` will also execute `bower install` to download all bower packages.

1. Test the application by starting up a local web server and navigating to the site. One option is to use a static web server that is built on node.js: [superstatic](https://www.npmjs.org/packages/superstatic).

  To use superstatic, install it globally from a command prompt:

  ````
  npm install -g superstatic
  ````

  To start the superstatic web server, enter the following at the command prompt within the root of the [StarterFiles](StarterFiles) folder:

  ````
  ss --port 8000
  ````

  This will host the site at [http://localhost:8000](http://localhost:8000). The file [superstatic.json](StarterFiles/superstatic.json) configures *superstatic* to load the site starting with `/src` as the web root.

## Exercise 2: Setup Azure AD Application
In this exercise you will create an Azure AD application that will be used by the starter project.

1. In a browser navigate to https://manage.windowsazure.com & login.
1. In the left-hand navigation, scroll down to and click on **Active Directory**.
1. Click on the name of your Azure AD directory & then click **Applications** in the toolbar. 

  ![](Images/AzureAdApp01.png)

1. Click the **Add** button at the bottom of the display.
1. On the **What do you want to do** page, click **Add an application my organization is developing**. This will start the **Add Application** wizard.
1. In the **Add Application** wizard, enter a name of **Auth Flow Demo** and choose the type **Web Application and/or Web API**. Click the arrow to advance to the next page of the wizard.
1. In the **App Properties** page, enter a **SIGN-ON URL** of **http://localhost:8000**

1. Enter an **App ID Uri** of **http://[your-domain].onmicrosoft.com/ExpenseManager**.
  > NOTE: The App ID Uri must be unique within the Azure tenancy. Using a host name that matches your tenant name helps to prevent confusion, and using a value for the path that matches the app name helps to enforce uniqueness. This value can be changed if the app name or purpose changes.
1. Click the **check** image in the lower right of the wizard to create the application. The application **Quick Start** page will display once the application is created.

  ![](Images/AzureAdApp02.png)

1. Obtain and store the Azure AD tenant ID.
  1. On the **Quick Start** page, expand the **Get Started** / **Enable Users to Sign On**. 
  1. Locate the field **Federation Metadata Document URL**. Within that field value you will see a GUID immediately after the `login.windows.net` part of the URL. 
  1. Copy just the GUID value to the clipboard.

    ![](Images/TenantId.png)

1. On the application Quick Start page, click on **CONFIGURE** in the toolbar.
1. Copy the **Client ID** value for later use. You will need this later.
1. Scroll down to the **permissions to other applications** section. 
  1. In the **Select Application** dropdown, select **Office 365 SharePoint Online**. 
  1. In the **Delegated Permissions** dropdown on the same line, the following permissions:
  
    - Read items in all site collections
    - Edit or delete items in all site collections
    - Read user's files

1. Click the **Save** button at the bottom of the page.
1. Configure the application to allow the OAuth2 Implicit Flow:
  1. After saving the app, click the **MANAGE MANIFEST** button in the footer of the page. You will be prompted to upload / download the manifest. Download the manifest file to your desktop. It will be named **[client-id].json**.
  1. Open the manifest in a text editor. Locate the property `oauth2AllowImplicitFlow`.
  1. Set the `oauth2AllowImplicitFlow` property to `true` and save your changes.
  1. Back in the Azure Management Portal, click the **MANAGE MANIFEST** button and select **UPLOAD MANIFEST**.
  1. Select the file you just updated and upload the file.

In this exercise you created an Azure AD application and configured it to support the OAuth implicit flow.

## Exercise 3: Configure Authentication & ADAL JSON
In this exercise you will update the starter project to have a login & logout process as well as secure specific routes in the Angular application for authenticated users.

> todo

## Exercise 4: Utilize Live Office 365 & SharePoint Online REST Services
In this exercise you will create a SharePoint site using the provided site template that includes sample data. After creating the site, you will update the starter app to use the live services in Office 365 & SharePoint Online instead of the static sample files.

> todo
