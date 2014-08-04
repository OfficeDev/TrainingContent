# Deep Dive into Provider Hosted Apps
In this lab, you will create a Provider-Hosted app and make use of some of the advanced capabilities.

## Prerequisites
1. You must have an Office 365 tenant to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.

## Exercise 1: Create a Provider-Hosted App 
In this exercise you create a new provider-hosted app.

1. Create the new solution in Visual Studio 2013:
  1. Launch **Visual Studio 2013** as administrator. 
  2. In Visual Studio select **File/New/Project**.
  3. In the New Project dialog:
    1. Select **Templates/Visual C#/Office/SharePoint/Apps**.
    2. Click **App for SharePoint 2013**.
    3. Name the new project **AzureCloudApp** and click **OK**.<br/>
       ![](Images/3.png?raw=true "Figure 3")
  4. In the New App for SharePoint wizard:
    1. Enter the address of a SharePoint site to use for testing the app (***NOTE:*** The targeted site must be based on a Developer Site template)
    2. Select **Provider-Hosted** as the hosting model.
    3. Click **Next**.<br/>
       ![](Images/4.png?raw=true "Figure 4")
    4. Select **ASP.NET MVC Web Application**.
    5. Click **Next**.<br/>
       ![](Images/5.png?raw=true "Figure 5")
    6. Select the option labeled **Use Windows Azure Access Control Service (for SharePoint cloud apps)**.
    7. Click **Finish**.<br/>
       ![](Images/6.png?raw=true "Figure 6")
    8. When prompted, log in using your O365 administrator credentials.
2. Test your app
  1. Press F5 to begin debugging.
  2. When prompted, log in using your O365 administrator credentials.
  3. When prompted, click **Trust it**.<br/>
       ![](Images/7.png?raw=true "Figure 7")
  4. Verify that the app home page shows and that it properly welcomes you by name.<br/>
       ![](Images/8.png?raw=true "Figure 8")


**Congratulations! You have completed creating a Provider-Hosted app.**

