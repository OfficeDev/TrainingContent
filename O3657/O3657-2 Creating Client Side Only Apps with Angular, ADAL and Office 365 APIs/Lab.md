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

> todo

## Exercise 3: Configure Authentication & ADAL JSON
In this exercise you will update the starter project to have a login & logout process as well as secure specific routes in the Angular application for authenticated users.

> todo

## Exercise 4: Utilize Live Office 365 & SharePoint Online REST Services
In this exercise you will create a SharePoint site using the provided site template that includes sample data. After creating the site, you will update the starter app to use the live services in Office 365 & SharePoint Online instead of the static sample files.

> todo
