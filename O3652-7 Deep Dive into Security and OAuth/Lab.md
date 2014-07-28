# Deep Dive into Security and OAuth
In this lab, you will create apps that use different approaches for OAuth security management.

## Prerequisites
1. You must have an Office 365 tenant and Windows Azure subscription to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
2. You must have [Fiddler] (http://www.telerik.com/fiddler) installed.

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
    9. After the new project is created, set breaskpoints in **HomeController.cs** as shown.<br/>
      ![](Images/05.png?raw=true "Figure 5")
2. Start **Fiddler** to capture web traffic from your app.
  1. In Fiddler click **Tools/Fiddler Options**.
  2. Click **HTTPS**.
  3. Check the box entitled **Decrypt HTTPS Traffic**.
  4. When warned, click **Yes** to trust the Fiddler root certificate.
  5. Confirm any additional dialog boxes to install the certificate.
  6. Click **OK** to close the options dialog.
3. Debug the app by pressing **F5** in Visual Studio 2013.
  1. When prompted, sign into Office 365.
  2. When prompted, click **Trust It**.<br/>
      ![](Images/07.png?raw=true "Figure 7")
  3. When the first breakpoint is hit, look for the session in Fiddler near the bottom of the list.<br/>
      ![](Images/08.png?raw=true "Figure 8")
  4. Right click the session and select **View in New Window**.
  5. Click the **Web Forms** tab.
  6. Notice that SharePoint has included the SPHostUrl, SPLanguage, SPClientTag, and SPProductNumber query string parameters in the initial call. These are known as the **Standard Tokens**.
  7. Notice that the context token is included in the body as **SPAppToken**<br/>.
      ![](Images/09.png?raw=true "Figure 9")
  8. Close the window.
  9. Return to Visual Studio, and press **F5** to continue debugging.
  10. When the second breakpoint is hit, look for the session in Fiddler near the bottom of the list.<br/>
      ![](Images/10.png?raw=true "Figure 10")
  11. Right click the session and select **View in New Window**.
  12. Click the **Headers** tab and examine the access token in the **Cookies/Login** section <br/>
      ![](Images/11.png?raw=true "Figure 11")
  13. Return to Visual Studio, and press **F5** to continue debugging.
  14. With the app still running, open a new browser window to **/_layouts/15/AppPrincipals.aspx**.
  15. Look for **ProviderHostedOAuth** in the list of registered apps to confirm that the app was registered during debugging.
  16. Stop debugging.


**Congratulations! You have completed **

