To run this project, you must perform the following steps:

## Create Azure AD Application
Create an Azure AD application in your Azure tenant. Make sure you obtain the app's **ClientID**, **Client Secret** (aka: key) & the ID of your Azure AD tenant.

## Update Project's Web.Config
Open the project's `web.config` file and set the values for the **ClientID**, **Password** (aka the Azure AD app's secret / key) & **TenantId** using the values from the previously created Azure AD app.

## Run NuGet Package Restore
Download all the referenced packages in the project by running NuGet's package restore. This can be done using the **Package Manager Console** tool window in Visual Studio and clicking the button **Restore** found in the top-right corner of the tool window.

## Add Office 365 as a Connected Service
Add Office 365 as a Connected Service to the project using the wizard: **Add => Connected Service**. This will find the ClientID in the project's `web.config`. You need to add the necessary permissions required for this project in the dialog. 

Once clicking **OK** in the wizard, it will add all the necessary NuGet packages & add the necessary references to the project.

## Test by Building the Project
Finally, build the project to test that all references are correct.