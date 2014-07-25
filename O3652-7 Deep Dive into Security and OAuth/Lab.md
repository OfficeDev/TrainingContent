# Deep Dive into Security and OAuth
In this lab, you will create apps that use different approaches for OAuth security management.

## Prerequisites
1. You must have an Office 365 tenant and Windows Azure subscription to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.

## Exercise 1: Create a Provider-Hosted App 
In this exercise you create a new provider-hosted app and examine the OAuth flow.

1. Create the new solution in Visual Studio 2013:
  1. Launch **Visual Studio 2013** as administrator. 
  2. In Visual Studio select **File/New/Project**.
  3. In the New Project dialog:
    1. Select **Templates/Visual C#/Office/SharePoint/Apps**.
    2. Click **App for SharePoint 2013**.
    3. Name the new project **ProviderHostedOAuth** and click **OK**.<br/>
       ![](Images/01.png?raw=true "Figure 1")
  4. In the New App for SharePoint wizard:
    1. Enter the address of a SharePoint site to use for testing the app (***NOTE:*** The targeted site must be based on a Developer Site template)
    2. Select **Provider-Hosted** as the hosting model.
    3. Click **Next**.<br/>
       ![](Images/02.png?raw=true "Figure 2")
    4. Select **ASP.NET MVC Web Application**.
    5. Click **Next**.<br/>
       ![](Images/03.png?raw=true "Figure 3")
    6. Select the option labeled **Use Windows Azure Access Control Service (for SharePoint cloud apps)**.
    7. Click **Finish**.<br/>
       ![](Images/04.png?raw=true "Figure 4")
    8. When prompted, log in using your O365 administrator credentials.


**Congratulations! You have completed **

