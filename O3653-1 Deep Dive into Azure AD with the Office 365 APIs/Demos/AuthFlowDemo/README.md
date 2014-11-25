# How to Run the Sample

## Step 1: Create an Azure AD Application
1. Follow the steps in the **hands on lab, exercise 1** for this module to create a new Azure AD application.
1. Take care to make a copy of the app's **Client ID** and **Client Secret (aka: Key)**.
1. In addition to the steps in that exercise, set the following values in the **Configure** page for the app:
  - **Application Is Multi-Tenant**: YES
  - **Reply URL**: http://localhost:1332

## Step 2: Configure the demo Project
1. Open the project in Visual Studio.
1. Open `DemoConstants.cs` file in the root of the project.
1. Set the values of the `ClientId` & `ClientSecret` to use the same values from the app created in the previous step

### Step 3: Build and Debug your web application
Now you are ready for a test run. Hit F5 to test the app.