#Deep Dive into Azure AD with the Office 365 APIs 

In this lab you will configure your Azure Active Directory (Azure AD) tenant to provide authentication services to various application types; you will walk thru the http requests that facilitate authentication and you will explore the O365 Discovery Service using a Windows Store App.

## Prerequisites
1. You must have an Office 365 tenant and Windows Azure subscription to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
2. You must have the Office 365 API Tools version 1.1.728 installed in Visual Studio 2013.
3. You must have the TelerikFiddler application installed. Fiddler can be downloaded from [http://www.telerik.com/fiddler](http://www.telerik.com/fiddler) 

## Exercise 1: Register an application in Azure AD 
*Consuming O365 APIs requires all requests to be authorized, both the current user and the application. Azure AD Provides the authentication for the app and user.*

### Create the app domain:
1. Launch Internet Explorer.
2. In Internet Explorer, navigate to https://manage.windowsazure.com/
3. Enter the email address and password of an account that have permissions to manage the directory of the Azure tenant (e.g. admin@sample.onmicrosoft.com).
4. In the left-hand navigation, scroll down to and click on Active Directory.
5. Click on the name of a directory to select it and display. Depending on the state of your portal, you will see the Quick Start page, or the list of Users. On either page, click **Applications** in the toolbar. 
<br/>
![](Images/Fig01a.png) ![](Images/Fig01b.png)
<br/>*You may notice that the list of applications includes Office 365 Exchange Online and Office 365 SharePoint Online.*
6. Click the Add button at the bottom of the display.
7. On the **What do you want to do** page, click **Add an application my organization is developing**. This will start the **Add Application** wizard.
8. In the **Add Application** wizard, Enter a name of **Auth Flow Demo** and choose the type **Web Application and/or Web API**. Click the arrow to advance to the next page of the wizard.
9. In the **App Properties** page, enter a Sign-On URL of **http://authflowdemo.com**
	> NOTE: The Sign-On URL property is used to redirect the user's browser once authentication is complete. In this lab, we will not actually build a site at that URL. In a later exercise, you will monitor the authentication flow, but will not actually navigate to that URL.

10. Enter an **App ID Uri** of **http://[your-domain].onmicrosoft.com/AuthFlowDemo**.
	> NOTE: The App ID Uri must be unique within the Azure tenancy. Using a host name that matches your tenant name helps to prevent confusion, and using a value for the path that matches the app name helps to enforce uniqueness. This value can be changed if the app name or purpose changes.
11. Click OK to create the application. The application Quick Start page will display once the application is created.
<br />
![](Images/Fig02.png)
12. On the application Quick Start page, click on **CONFIGURE** in the toolbar.
13. Scroll down to the **Keys** section. In the **Select Duration** dropdown, select **1 year**. Then click the **Save** button at the bottom of the page.

	*The page will refresh and include the value of the key. In addition, a message is displayed advising that the key will not be shown a second time.*

14. For both the **Client ID** and **Key**, copy the values to the clipboard and paste into Notepad. We will require these values later.
<br />
![](Images/Fig03.png)
15. Scroll down to the **permissions to other applications** section. In the **Select Application** dropdown, select **Office 365 SharePoint Online**. In the **Delegated Permissions** dropdown on the same line, choose **Read users' mail**. Again, in the **Select Application** dropdown, select **Office 365 Exchange Online**. In the **Delegated Permissions** dropdown on the same line, choose **Read users' files**. 
<br />
![](Images/Fig07.png)
16. Click the **Save** button at the bottom of the page.

*You have completed the creation & registration of an application in Azure AD.*  

##Exercise 2: Manually invoke and review the authentication flow
*In this exercise, we will manually walk thru the steps of logging in, consenting the application and requesting an access token for an Office 365 service.*

### Login and consent the application
1. Launch an InPrivate session of Internet Explorer.
2. Navigate to the Azure AD authorize page:

	`https://login.windows.net/common/oauth2/authorize?resource=Microsoft.SharePoint&redirect_uri=http://authflowdemo.com/&response_type=code&client_id=[CLIENT-ID]`

	> Note: Replace the placeholder [CLIENT-ID] with the actual Client Id copied from the application configuration page.

	The following are the query string parameters that are part of this request:
	- resource - the Azure AD-secured resource for which authorization is being performed.
	- redirect_uri - the URL to which the authorization code is to be sent upon completion of the authorization & consent process
	- response_type - indicates that the authorization should respond with an authorization code instead of an access token. The Office 365 APIs utilize the code approach, since different tokens are required for the various services (Exchange, SharePoint, etc.). An authorization code can be used to request multiple access tokens.
	- client_id - used to identity the application making the request
	
3. If prompted, enter the user name and password. Once logged in, you will see a page informing you that the application needs permissions to continue. This is called the **Common Consent** dialog. You can click **Show More** to view information about the application.
4. Before continuing, launch **Fiddler**. Fiddler will intercept the conversation between the browser and server, providing the ability to view the details of the request & response.
5. In Internet Explorer, click **OK** to continue. The browser will display a DNS error. (Remember, we configured the application to redirect to a url of http://authflowdemo.com, but we did not create a website at that address.) Notice the address bar of Internet Explorer also contains query string parameters.
6. Switch to **Fiddler**. Near the bottom of the session list will be an entry in red with a result code of 502. Before that, there will be a session with a response code of 302. Select "302" entry.
7. Notice that the **Hostname** of the entry is login.windows.net. This entry represents the **OK** button on the common consent dialog. 
8. On the right side of the Fiddler display, select the **Inspectors** tab. The **Inspectors** tab shows the request from the browser on the top and the response from the server on the bottom.
9. In the response inspector (lower half), click the **Headers** tab. The headers include instructions for the browser to store cookies from Azure AD (login.windows.net) to persist the login as well as a Location header to redirect the browser. The address for the redirect is the **Sign-On Url** of the application in Azure AD. The redirect request includes query string parameters.
<br/>
![](Images/Fig05.png)
10. In the **Fiddler** session list, select the "502" entry. In the **Inspectors** tab, view the Request (upper half) WebForms view. This will display the query string parameters in a grid format. Notice a code parameter - this is the authorization code returned by AzureAD for this request. The code will be unique to the application and user.
<br/>
![](Images/Fig06.png)
	> Copy this code to Notepad. The code will be required in the next step.

###Request an Access token
1. In **Fiddler**, click on the Composer tab.

	*The composer tab providers the ability to construct an http request.*

2. Change the verb to **POST**
3. Change the url to:
 
	`https://login.windows.net/common/oauth2/token`

4. Add the following to **Request Headers**:

	`Content-Type: application/x-www-form-urlencoded`

5. The **Request Body** must be UrlEncoded, so there is a preparatory step before completing the form.

	Launch **Windows PowerShell ISE**

	Run the following cmdlets:

    	[System.Reflection.Assembly]::LoadWithPartialName("System.Web") | out-null
    	[System.Web.HttpUtility]:UrlEncode("[CLIENT-SECRET]")
    
	> Note: Replace the placeholder [CLIENT-SECRET] with the actual Client Id copied from the application configuration page.


	The UrlEncode method will output the encoded client secret. Copy this value to Notepad.

6. The **Request Body** contains the following parameters that are required to get an access token.
	- grant_type - specifies that we are providing an authorization code instead of requesting the user to enter credentials.
	- resource - the resource to which an access token is requested.
	- redirect_uri - the URL to which the access token is to be sent upon validation of the request
	- client_id - used to identity the application making the request
	- client_secret - used to authenticate the application

	Enter the following in the **Request Body**, replacing the [tokens] with values as described below:

	`grant_type=authorization_code&resource=https://outlook.office365.com&redirect_uri=http%3A%2F%2Fauthflowdemo.com%2F&client_id=[CLIENT-ID]&client_secret=[CLIENT-SECRET]&code=[AUTHORIZATION-CODE]`

	> Note: Token replacement instructions:
	> 
	> - client_id - copied from the application configuration page in the Azure portal.
	> - client_secret - copied from the UrlEncode method in Windows PowerShell ISE.
	> - code - copied from the Fiddler Inspector tab of the "502" request.

<br />
![](Images/Fig08.png)
6. 
 















15. Scroll down to the **permissions to other applications** section. In the **Select Application** dropdown, select **Office 365 Exchange Online**. In the **Delegated Permissions** dropdown on the same line, choose **Read users' mail**. Again, in the **Select Application** dropdown, select **Office 365 SharePoint Online**. In the **Delegated Permissions** dropdown on the same line, choose **Read users' files**. 


	*We are selecting permissions from all applications in order to show the full range of values exposed in the Discovery Service.
