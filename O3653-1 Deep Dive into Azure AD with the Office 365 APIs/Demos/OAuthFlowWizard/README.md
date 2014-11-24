# How to Run the Sample

## Step 1: Create an Azure AD Application
1. Follow the steps in the **hands on lab, exercise 1** for this module to create a new Azure AD application.
1. Take care to make a copy of the app's **Client ID** and **Client Secret (aka: Key)**.
1. In addition to the steps in that exercise, set the following values in the **Configure** page for the app:
  - **Application Is Multi-Tenant**: YES
  - **Reply URL**: http://authflowdemo.com
1. With the browser window still open, look for the GUID of the Tenant ID in the URL and copy it for future use. 

## Step 2: Configure the demo Project
1. Open the project in Visual Studio.
1. Open `App.config` file in the root of the project.
1. Set the values of all the settings values to reflect the Azure AD application you just created as well as the details for your Office 365 tenant.

### Step 3: Build and Debug your web application
Now you are ready for a test run. Hit F5 to test the app.