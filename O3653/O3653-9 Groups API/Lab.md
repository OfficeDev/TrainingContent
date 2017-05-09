**Note: If you wish to see the MSAL version of these samples please [click here](MSAL%20Lab.md).**

# Deep Dive into the Microsoft Graph for Office 365 Groups
In this lab, you will use the Microsoft Graph to access and program against Office 365 Groups using Fiddler and MVC web app.

## Prerequisites
1. You must have an Office 365 tenant and Microsoft Azure subscription to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
1. You must have access to an Exchange mailbox within an Office 365 developer tenancy.
1. You must have Fiddler (http://www.telerik.com/fiddler) or another HTTP debugging proxy tool installed to complete exercise 3.
1. You must have Visual Studio 2017 with ASP.NET and web development workload installed.
1. This lab requires you to use multiple starter files or an entire starter project from the GitHub location. You can either download the whole repo as a zip or clone the repo https://github.com/OfficeDev/TrainingContent.git for those familiar with git.

## Exercise 1: Create and Interact with Office 365 Groups using the Browser
In this exercise, you will use the browser to create and interact with Office 365 Groups. You'll want to ensure you have a few users in your Office 365 tenant that you can use. For this lab we've created the following users ahead of time:

	- Janice Galvin (janice.galvin@<tenant>.onmicrosoft.com)
	- Ken Sanchez (ken.sanchez@<tenant>.onmicrosoft.com)
	- Maria Anders (maria.anders@<tenant>.onmicrosoft.com)
	- Rob Walters (rob.walters@<tenant>.onmicrosoft.com)
	- Thomas Hardy (thomas.hardy@<tenant>.onmicrosoft.com) 

Using these accounts, create and interact with some groups using the web interface.

### Create a New Group 
1. Within a browser, navigate to the **https://mail.office365.com** site & login using a valid account *(in this step, we will use Rob Walters)*.
1. Create a new group named **Contoso Merger Working Group**.
   1. In the left navigation, locate & click the **PLUS** icon.

      ![Screenshot of the previous step](Images/Figure01.png)

   1. Set the name to **Contoso Merger Working Group** & give it a description as shown in the following figure.

      ![Screenshot of the previous step](Images/Figure02.png)

   1. Click the **Create** button at the top to create the group.

1. After creating the group, you will be prompted to add a user as a member to the group. Add one of your test users to the group *(in this step we used Janice Galvin)*.
1. After creating the group it will appear in the left-hand navigation and indicated with a tile that contains letters from the group's name. 
   1. Update the logo for the group to be more descriptive. Click the group logo.

      ![Screenshot of the previous step](Images/Figure03.png)	

   1. Then Click the pencil icon to change group icon.

      ![Screenshot of the previous step](Images/Figure04.png)	       
               
   1. Select the **contoso.png** file in the [Lab Files](./Lab%20Files) folder within this lab as the new icon for the group.
   1. Click **Save** button. 
1. With the icon set, start up a conversation in the group that other members can participate in.
   1. Click the **New conversation** link in the middle-pane and enter the following message:
      ```
	  Does anyone have prior relationships with firms that do corporate valuations?
	  ```
	
   1. Once you send the message, you will see the message appear in the list of conversations:

      ![Screenshot of the previous step](Images/Figure05.png)	

1. At this point the current user (*Rob Walters*) is not subscribed to the group. Ideally all messages to this group should show up in his mailbox. To do this, click **Joined** button on top navigation, select **Subscribe to this group by email**.

    > Conversations are just one of the features available in groups. In addition to conversations there is a shared calendar, files, notebook and other options. Feel free to explore and add additional content.

    ![Screenshot of the previous step](Images/Figure06.png)	

### Interact with the Group as a Member
1. In the last section you added another user (*Janice Galvin*) as a member when you created the group. Login as this user on the same **https://mail.office365.com** site.
1. Once you login, you will see the **Contoso Merger Working Group** listed in the left-hand navigation. Select the group.
1. Locate the conversation that was created in the previous step and click the **reply all** link to leave a comment:
    ```
    I used to work for a valuation firm... let me dig up a contact and get back to you.
    ```

1. You will see the conversation update with the message you just added.
1. Logout of **https://mail.office365.com** and login as the original user (*Rob Walters*).

    ![Screenshot of the previous step](Images/Figure07.png)

1. Notice that when you login, the message will appear in their email inbox, not just in the group's conversations view. This is because you subscribed to the conversations.

### Search and join an Office 365 Group as another user
1. Now let's try to find the group as another user. Login as a new user (*in this step we used **Thomas Hardy**).
1. Once logged in, click the **More** link in the left-hand navigation.
    
    ![Screenshot of the previous step](Images/Figure08.png)

1. Select **Discover** menu.
 
    ![](Images/Figure09.png)

1. Enter **contoso** as the search term and press **ENTER**.

    ![Screenshot of the previous step](Images/Figure10.png)

1. Select the group **Contoso Merger Working Group** and click the **Join** button to join the group.
1. You should now be able to go back to main page for your inbox and see the group listed in the left-hand pane. Notice that you can see all the conversations and other aspects of the group.

In this exercise you created and interacted with Office 365 Groups using the browser interface. 

## Exercise 2: Register application for the Microsoft Graph 
In this exercise, you will register an application in Application Registration Portal.

1. Within a browser, navigate to the **Application Registration Portal**: https://apps.dev.microsoft.com
2. Sign in with either an Azure AD user or a Microsoft account (e.g. admin@sample.onmicrosoft.com).
3. Click the **Add an app** button at the top right corner. 
4. In the **New Application Registration** wizard, enter a name of **O3653-9**. Click the **Create application** button to the next page.
5. In the **O3653-9 Registration** page, click the **Add Platform** button.
6. In the **Add Platform** wizard, select **Web**.
7. Enter **https://localhost:44300/** and **https://dev.office.com** into the **Redirect URIs**.
8. In the **Microsoft Graph Permissions** section, click **Add** button next **Delegated Permissions**.
9. In the **Select Permission** wizard, Select **Directory.Read.All**, **Group.ReadWrite.All** permissions.

	![Screenshot of the previous step](Images/Figure11.png)

10. Remove the **User.Read** permission.
11. Click the **Generate New Password**.
12. Copy the **password** to a text file as you will need it later in this lab, and then click **OK**.

	![Screenshot of the previous step](Images/Figure12.png)

13. Copy the **Application Id** to a text file as you will need it later in this lab.

	![Screenshot of the previous step](Images/Figure13.png)

14. Click the **Save** button at the bottom left corner.
15. In the browser, navigate to the **Azure Portal**: https://portal.azure.com.
16. Click **Azure Active Directory** on the left nav bar, then click **Properties**, copy the **Directory ID** to a text file as you will need it later in this lab.

    ![Screenshot of the previous step](Images/Figure14.png) 

## Exercise 3: Use Fiddler to access the Microsoft Graph for Office 365 Groups
In this exercise, you will use Fiddler to access the Microsoft Graph for Office 365 Groups to interact with the different capabilities. The Groups API is part of the Microsoft Graph. In order to call the Microsoft Graph, you must pass along a valid OAuth2 access token. To obtain an access token you must first authenticate with Azure AD and obtain an authorization code.

### Authenticate & Obtain an Authorization Code from Azure AD 
Use the Azure AD authorization endpoint to authenticate & obtain an authorization code.

1. Open Fiddler, select **Tools**->**Telerik Fiddler Options**, then click **HTTPS** tab, check **Capture HTTPS CONNECTs** and **Decrypt HTTPS traffic**. If it asks you to **Trust the Fiddler Root certificate**, agree all the confirmation boxes until the certificate is installed, then reopen Fiddler.

    ![Screenshot of the previous step](Images/fiddler-options.png)

1. Take the following URL and replace the `{tenant-id}` & `{client-id}` tokens with the **Directory ID** and **Application Id** obtained in Exercise 2.

    ````
	https://login.microsoftonline.com/{tenant-id}/oauth2/authorize?
	client_id={client-id}
	&resource=https://graph.microsoft.com/
	&redirect_uri=https://dev.office.com
	&response_type=code
	````

1. Open a browser navigate to the above URL after you replaced the tokens. Be sure to remove any line breaks from the above URL that were added for readability.
	
    > You will be prompted to login using the same account you used to create the application.

1. Open Fiddler and find the last session that took you to the current page after logging into Azure AD. The following figure shows what Fiddler will likely look like for you, with the highlighted session you are interested in. Specifically, you are looking for a session that has a `/?code=` in the URL:

    ![Screenshot of the previous step](Images/Figure15.png)

	> NOTE: To simplify the screenshot, session requests for script & image files have been removed.

1. With the session selected in Fiddler, click the **Inspector** tab and then click the **WebForms** tab. This will show a list of all the values submitted to the current page.
1. Copy the value for the **code** to the text file; this is the authorization code that can be used to obtain an access token.

## Obtain an OAuth2 Access Token for the Microsoft Graph
Use the Azure AD token endpoint to obtain an access token for the Microsoft Graph using the authorization code you just obtained.

1. Take the following URL and replace the `{tenant-id}` token with the **Directory ID** obtained in Exercise 2:

    ````
    https://login.microsoftonline.com/{tenant-id}/oauth2/token
    ```` 

1. Within Fiddler, click the **Composer** tab.
1. Set the HTTP action to **POST** and copy the URL above with the replaced token into the address path.
1. Within the box just below the HTTP action & URL, add the following HTTP headers:

    ````
    Accept: application/json
    Content-Type: application/x-www-form-urlencoded
    ````

1. Now, take the following and replace the `{client-id}` token with the **Application Id** obtained in Exercise 2. Replace the `{url-encoded-client-secret}` token with the URL encoded value of the **password** obtained in Exercise 2.

	> To get the URL encoded value, search for the phrase *url encode* on [http://www.bing.com]. It will display a utility to paste the value you obtained in the first exercise and convert it to the URL encoded version.
	
	Lastly, replace the `{authorization-code}` token with the code that you got from the previous step, using Fiddler.

    ````
    grant_type=authorization_code
    &redirect_uri=https://dev.office.com
    &client_id={client-id}
	&client_secret={url-encoded-client-secret}
	&resource=https://graph.microsoft.com
	&code={authorization-code}
	````

1. Take the resulting string from all the previous changes and paste it into the **Request Body** box within the **Composer** tab. Be sure to remove all line breaks form the string so you are left with something that looks like the following:

	![Screenshot of the previous step](Images/Figure16.png)  

1. Click the **Execute** button to make the request.
1. Select the session that was just created and click the **Inspectors** tab. Here you see the all the values that were submitted in the request.
1. Click the **JSON** tab in the lower part of the **Inspector** tab. This contains the access and refresh tokens from the successful request. 
1. Copy & save the access token just like you've done with the client ID, secret & tenant ID in the previous exercise.

	![Screenshot of the previous step](Images/Figure17.png)  

### Issue Requests to the User API and Group API's REST Endpoint via the Microsoft Graph
Now that you have an access token, create a few requests to the Microsoft Graph's REST endpoint.

1. First get information about the currently logged in user from the Microsoft Graph. Within Fiddler's **Composer** tab, do the following:
   1. Set the HTTP action to **GET**.
   1. Set the endpoint URL to **https://graph.microsoft.com/v1.0/me**
   1. Set the HTTP headers to the following values, replacing the `{access-token}` token to the actual token you just obtained in the last step:
	
    ````
    Accept: application/json
    Authorization: Bearer {access-token}
    ````

   1. Clear the box for the **Request Body**.
   1. Click the **Execute** button.
   1. Select the session you just created and click the **Inspectors** tab. Look at the results that came back to find information about you, the currently logged in user.

1. Get a list of all the groups that exist within your organization.
   1. Within the Fiddler **Composer** tab.
   1. Set the endpoint URL to **https://graph.microsoft.com/v1.0/{tenant-id}/groups**

      > NOTE: Replace the `{tenant-id}` with the **Directory ID** obtained in Exercise 2.

   1. Leave the same HTTP headers in place & click the **Execute** button.
   1. Select the session you just created and click the **Inspectors** tab. Look at the results that came back to find a list of all the groups in your organization.

      > NOTE: Select a group and copy the `id` value and save it to a text file, we will use this value later.
	
1. Check the groups you are currently a member of. *This assumes you are logged in as a user that's a member of at least one group.*
   1. Within the Fiddler **Composer** tab.
   1. Set the endpoint URL to **https://graph.microsoft.com/v1.0/me/memberOf**
   1. Leave the same HTTP headers in place & click the **Execute** button.
   1. Select the session you just created and click the **Inspectors** tab. Look at the results that came back to find information about the groups you are a member of.
	
1. You can also search for a specific group using the OData query syntax:	
   1. Within the Fiddler **Composer** tab.
   1. Set the endpoint URL to **https://graph.microsoft.com/v1.0/{tenant-id}/groups?$filter=startswith(displayName,'Contoso')**

      > NOTE: Replace the `{tenant-id}` with the **Directory ID** obtained in Exercise 2.

   1. Leave the same HTTP headers in place & click the **Execute** button.
   1. Select the session you just created and click the **Inspectors** tab. Look at the results that came back to find information about the group that was created in a previous exercise.

1. Now, look at the members within the specified group. *For this step, you need to get the ID (aka: objectId) of the group you found in the previous step*: 
   1. Within the Fiddler **Composer** tab.
   1. Set the endpoint URL to **https://graph.microsoft.com/v1.0/{tenant-id}/groups/{replace-with-group-object-id}/members**

      > NOTE: Replace the `{tenant-id}` with the **Directory ID** obtained in Exercise 2, replace the `{replace-with-group-object-id}` with group id value obtained in the previous step.

   1. Leave the same HTTP headers in place & click the **Execute** button.
   1. Select the session you just created and click the **Inspectors** tab. Look at the results that came back to find a list of all conversations in the group.

1. Now, look at the conversations within the specified group. *For this step, you need to get the ID (aka: objectId) of the group you found in the previous step*: 
   1. Within the Fiddler **Composer** tab.
   1. Set the endpoint URL to **https://graph.microsoft.com/v1.0/{tenant-id}/groups/{replace-with-group-object-id}/conversations**

      > NOTE: Replace the `{tenant-id}` with the **Directory ID** obtained in Exercise 2, replace the `{replace-with-group-object-id}` with group id value obtained in the previous step.

   1. Leave the same HTTP headers in place & click the **Execute** button.
   1. Select the session you just created and click the **Inspectors** tab. Look at the results that came back to find a list of all conversations in the group.

      > NOTE: Select a conversation and copy the `id` value and save it to a text file, we will use this value later.

1. You can also look at the conversations as threads.
   1. Within the Fiddler **Composer** tab.
   1. Set the endpoint URL to **https://graph.microsoft.com/v1.0/{tenant-id}/groups/{replace-with-group-object-id}/threads**

      > NOTE: Replace the `{tenant-id}` with the **Directory ID** obtained in Exercise 2, replace the `{replace-with-group-object-id}` with group id value obtained in the previous step.

   1. Leave the same HTTP headers in place & click the **Execute** button.
   1. Select the session you just created and click the **Inspectors** tab. Look at the results that came back to find a list of all threads in the group.

      > NOTE: Select a thread and copy the `id` value and save it to a text file, we will use this value later.

1. You can see all the posts within a thread.
   1. Within the Fiddler **Composer** tab.
   1. Set the endpoint URL to **https://graph.microsoft.com/v1.0/{tenant-id}/groups/{replace-with-group-object-id}/threads/{replace-with-thread-id}/posts**

      > NOTE: Replace the `{tenant-id}` with the **Directory ID** obtained in Exercise 2, replace the `{replace-with-group-object-id}` with group id value and replace `{replace-with-thread-id}` with thread id value obtained in the previous step.

   1. Leave the same HTTP headers in place & click the **Execute** button.
   1. Select the session you just created and click the **Inspectors** tab. Look at the results that came back to find a list of all messages within a thread.
	
1. The Groups API also allows you to look at the events and files associated with the group:
   1. Within the Fiddler **Composer** tab.
   1. Set the endpoint URL to **https://graph.microsoft.com/v1.0/{tenant-id}/groups/{replace-with-group-object-id}/events**

      > NOTE: Replace the `{tenant-id}` with the **Directory ID** obtained in Exercise 2, replace the `{replace-with-group-object-id}` with group id value obtained in the previous step.

   1. Leave the same HTTP headers in place & click the **Execute** button.
   1. Select the session you just created and click the **Inspectors** tab. Look at the results that came back to find a list of all the events within the group.
   1. Set the endpoint URL to **https://graph.microsoft.com/v1.0/{tenant-id}/groups/{replace-with-group-object-id}/drive/root/children**
   1. Leave the same HTTP headers in place & click the **Execute** button.
   1. Select the session you just created and click the **Inspectors** tab. Look at the results that came back to find a list of all the files within the group.
	
	> NOTE: this part of the Groups API is leveraging the capabilities of the Files and Events API endpoints in the Microsoft Graph. These specific endpoints are covered in more depth in other modules within these courses.
	
In this exercise, you used the raw REST API interface of the Groups API by Fiddler tools to interact with the different capabilities.

## Exercise 4: Use MVC web app to utilize the Microsoft Graph SDK against Office 365 Groups
In this exercise, you will use MVC web app to utilize the Microsoft Graph SDK against Office 365 Groups.

> Note: If you receive errors when running the web app, please see the [TroubleShooting](#troubleshooting) to quickly resolve the issues. 

1. Locate the [StarterFiles](StarterFiles) folder that contains a starter project. The starter project is an ASP.NET MVC5 web application that you will update to call the Microsoft Graph.
1. Open the **Office365Group** solution in Visual Studio.
1. Open the **Web.config** file.

    ![Screenshot of the previous step](Images/Figure18.png) 

   1. Replace the value for **ClientId** with the **Application Id** you got from Exercise 2.
   2. Replace the value for **ClientSecret** with the **password** that you got form Exercise 2.
   3. Replace the value for **TenantId** with the **Directory ID** that you got form Exercise 2.

1. Add the code to get Graph Access token.
   1. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **GetGraphAccessTokenAsync** method.

		````c#
		var AzureAdGraphResourceURL = "https://graph.microsoft.com/";
		var Authority = ConfigurationManager.AppSettings["ida:AADInstance"] + ConfigurationManager.AppSettings["ida:TenantId"];
		var signInUserId = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value;
		var userObjectId = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
		var clientCredential = new ClientCredential(ConfigurationManager.AppSettings["ida:ClientId"], ConfigurationManager.AppSettings["ida:ClientSecret"]);
		var userIdentifier = new UserIdentifier(userObjectId, UserIdentifierType.UniqueId);
		AuthenticationContext authContext = new AuthenticationContext(Authority, new ADALTokenCache(signInUserId));
		var result = await authContext.AcquireTokenSilentAsync(AzureAdGraphResourceURL, clientCredential, userIdentifier);
		return result.AccessToken;
		````

1. Add the code to get GraphServiceClient.
   1. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **GetGraphServiceAsync** method.

		````c#
        var accessToken = await GetGraphAccessTokenAsync();
        var graphserviceClient = new GraphServiceClient(GraphResourceUrl,
                                      new DelegateAuthenticationProvider(
                                                    (requestMessage) =>
                                                    {
                                                        requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", accessToken);
                                                        return Task.FromResult(0);
                                                    }));
        return graphserviceClient;
		````


1. Add the **about me** interface.
   1. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **AboutMe** method.

		````c#
		var me = await _repo.GetMe();
		return View(me);
		````

   1. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **GetMe** method.

		````c#
        var graphServiceClient = await GetGraphServiceAsync();
        var me = await graphServiceClient.Me.Request().GetAsync();
        UserModel myModel = new UserModel()
        {
            Id = me.Id,
            displayName = me.DisplayName,
            givenName = me.GivenName,
            mail = me.Mail,
            mobilePhone = me.MobilePhone
        };
        return myModel;
		````

   1. Test this interface:
      1. In **Visual Studio**, press **F5** to begin debugging, when prompted, log in with your **Organizational Account**.
      1. On the **Home** page, click **Group** menu, then click **About Me** button, you will find **About Me** page like the following screenshot:

         ![Screenshot of the previous step](Images/Figure20.png) 

1. Add the **my organization groups** interface.
   1. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **MyOrganizationGroups** method.

		````c#
		var groups = await _repo.GetMyOrganizationGroups();
		return View("List", groups);
		````

   1. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **GetMyOrganizationGroups** method.

		````c#
        var graphServiceClient = await GetGraphServiceAsync();
        var request = graphServiceClient.Groups.Request().Filter("securityEnabled eq false").Select("id,displayName");
        var allGroups = new List<GroupModel>();
        do
        {
            var groups = await request.GetAsync();
            allGroups.AddRange(groups.CurrentPage.Select(x => new GroupModel() { Id = x.Id, displayName = x.DisplayName }).ToList());
            request = groups.NextPageRequest;
        } while(request != null);
        return allGroups;
		````

   1. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **Photo** method.

		````c#
		Stream photo = await _repo.GetGroupPhoto(groupId);
        return new FileStreamResult(photo, "image/jpeg");
		````

   1. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **GetGroupPhoto** method.

		````c#
        var graphServiceClient = await GetGraphServiceAsync();
        return await graphServiceClient.Groups[groupId].Photo.Content.Request().GetAsync();
		````

   1. Test this interface:
      1. In **Visual Studio**, press **F5** to begin debugging, when prompted, log in with your **Organizational Account**.
      1. On the **Home** page, click **Group** menu, then click **My Organization Groups** button, you will find **My Organization Groups** page like the following screenshot:

         ![Screenshot of the previous step](Images/Figure21.png) 

1. Add the **joined groups** interface.
   1. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **JoinedGroups** method.

		````c#
		var groups = await _repo.GetJoinedGroups();
		return View("List", groups);
		````

   2. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **GetJoinedGroups** method.

		````c#
        var graphServiceClient = await GetGraphServiceAsync();
        var request = graphServiceClient.Me.MemberOf.Request();
        var allGroups = new List<GroupModel>();
        do
        {
            var groups = await request.GetAsync();
            allGroups.AddRange(groups.CurrentPage.Where(x => x.ODataType == "#microsoft.graph.group").Select(x => new GroupModel() { Id = x.Id, displayName = (x as Group).DisplayName }).ToList());
            request = groups.NextPageRequest;
        } while (request != null);
        return allGroups;
		````

   3. Test this interface:
      1. In **Visual Studio**, press **F5** to begin debugging, when prompted, log in with your **Organizational Account**.
      2. On the **Home** page, click **Group** menu, then click **Joined Groups** button, you will find **Joined Groups** page like the following screenshot:

         ![Screenshot of the previous step](Images/Figure22.png) 

1. Add the **search for a specific group** interface.
   1. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **SearchGroup** method.

		````c#
		var groups = await _repo.SearchGroupByName(groupName);
		return View("List", groups);
		````

   2. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **SearchGroupByName** method.

		````c#
        var graphServiceClient = await GetGraphServiceAsync();
        var request = graphServiceClient.Groups.Request().Filter(string.Format("startswith(displayName,'{0}')", groupName)).Select("id,displayName");
        var allGroups = new List<GroupModel>();
        do
        {
            var groups = await request.GetAsync();
            allGroups.AddRange(groups.CurrentPage.Select(x => new GroupModel() { Id = x.Id, displayName = x.DisplayName }).ToList());
            request = groups.NextPageRequest;
        } while (request != null);
            
        return allGroups;
		````

   3. Test this interface:
      1. In **Visual Studio**, press **F5** to begin debugging, when prompted, log in with your **Organizational Account**.
      2. On the **Home** page, click **Group** menu, enter a **search term** that matches the name of one of your Office 365 Groups, then click **Search For a Specific Group** button, you will find the **search results** page like the following screenshot:

         ![Screenshot of the previous step](Images/Figure23.png) 

1. Add the **create a group** interface.
   1. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **CreateGroup** method.

		````c#
		await _repo.CreateGroup(groupName, groupAlias);
        return RedirectToAction("Index");
		````

   2. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **CreateGroup** method.

		````c#
        var graphServiceClient = await GetGraphServiceAsync();
        var request = graphServiceClient.Groups.Request();

        // Initialize a new group
        Group newGroup = new Group()
        {
            DisplayName = groupName,
            // The group's email will be set as <groupAlias>@<yourdomain>
            MailNickname = groupAlias,
            MailEnabled = true,
            SecurityEnabled = false,
            GroupTypes = new List<string>() { "Unified" }
        };

        Group createdGroup = await request.AddAsync(newGroup);
        return createdGroup.Id;
		````

   3. Test this interface:
      1. In **Visual Studio**, press **F5** to begin debugging, when prompted, log in with your **Organizational Account**.
      2. On the **Home** page, click **Group** menu, enter a **new group name** and an **email alias** for the new group, then click **Create Group** button.

         ![Screenshot of the previous step](Images/Figure24.png)

      3. click **My Organization Groups** menu, you will go to **My Organization Groups** page and find the group your just created.

1. Add the **members within the specified group** interface.
    1. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **GroupMembers** method.

		````c#
		ViewBag.GroupId = id;
        var members = await _repo.GetGroupMembers(id);
        return View("GroupMembers", members);
		````

   2. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **GetGroupMembers** method.

		````c#
	    var graphServiceClient = await GetGraphServiceAsync();
        var request = graphServiceClient.Groups[id].Members.Request();
        var allMembers = new List<UserModel>();
        do
        {
            var members = await request.GetAsync();
            allMembers.AddRange(members.CurrentPage.Where(x => x.ODataType == "#microsoft.graph.user").Select(x => x as User).Select(x => new UserModel
            {
                Id = x.Id,
                displayName = x.DisplayName,
                givenName = x.GivenName,
                mail = x.Mail,
                mobilePhone = x.MobilePhone
            }).ToList());
            request = members.NextPageRequest;
        } while (request != null);
        return allMembers;
		````

	3. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **AddMember** method.

		````c#
		await _repo.AddGroupMember(groupId, newMemberEmail);
        return RedirectToAction("GroupMembers", new RouteValueDictionary(new { id = groupId }));
		````

   4. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **AddGroupMember** method.

		````c#
	    var graphServiceClient = await GetGraphServiceAsync();
        var user = await graphServiceClient.Users[newMemberEmail].Request().GetAsync();
        if (user != null)
        {
            await graphServiceClient.Groups[groupId].Members.References.Request().AddAsync(user);
        }
        return user;
		````

   5. Test this interface:
      1. In **Visual Studio**, press **F5** to begin debugging, when prompted, log in with your **Organizational Account**.
      2. On the **Home** page, click **Group** menu, then click **Joined Groups** button, the group list will be shown.
      3. On **Group List** page, click the **Members** link for any group, you will find **Group Members** like the following screenshot.

         ![Screenshot of the previous step](Images/Figure25.png)

      4. At the top of the **Group Members** page, enter the email of an existing user, then click **Add Member** button. After the adding finished, the new member will be shown in the page.

1. Add the **conversations within the specified group** interface.
    1. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **GroupConversations** method.

		````c#
        ViewBag.GroupId = id;
		var conversations = await _repo.GetGroupConversations(id);
		return View("GroupConversations", conversations);
		````

   2. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **GetGroupConversations** method.

		````c#
	    var graphServiceClient = await GetGraphServiceAsync();
        var request = graphServiceClient.Groups[id].Conversations.Request().Select("id,topic,preview,lastDeliveredDateTime");
        var allConversations = new List<ConversationModel>();
        do
        {
            var conversations = await request.GetAsync();
            allConversations.AddRange(conversations.CurrentPage.Select(x => new ConversationModel
            {
                Id = x.Id,
                topic = x.Topic,
                preview = x.Preview,
                lastDeliveredDateTime = x.LastDeliveredDateTime
            }).ToList());
            request = conversations.NextPageRequest;
        } while (request != null);
        return allConversations;
		````

	3. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **AddConversation** method.

		````c#
		await _repo.AddGroupConversation(groupId, topic, message);
        // Sometimes the newly added conversation can't be retrieved immediately, so wait a second to work around this issue
        Thread.Sleep(1000);
        return RedirectToAction("GroupConversations", new RouteValueDictionary(new { id = groupId }));        
		````

   4. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **AddGroupConversation** method.

		````c#
	    // Build the conversation
        Conversation conversation = new Conversation()
        {
            Topic = topic,
            // Conversations have threads
            Threads = new ConversationThreadsCollectionPage()
        };
        conversation.Threads.Add(new ConversationThread()
        {
            // Threads contain posts
            Posts = new ConversationThreadPostsCollectionPage()
        });
        conversation.Threads[0].Posts.Add(new Post()
        {
            // Posts contain the actual content
            Body = new ItemBody() { Content = message, ContentType = BodyType.Text }
        });

        var graphServiceClient = await GetGraphServiceAsync();
        var request = graphServiceClient.Groups[groupId].Conversations.Request();
        return await request.AddAsync(conversation);
		````

   5. Test this interface:
      1. In **Visual Studio**, press **F5** to begin debugging, when prompted, log in with your **Organizational Account**.
      2. On the **Home** page, click **Group** menu, then click **Joined Groups** button, the group list will be shown.
      3. On **Group List** page, click the **Conversations** link for any group, you will find **Group Conversations** like the following screenshot.

         ![Screenshot of the previous step](Images/Figure26.png)

      4. At the top of the **Group Conversations** page, enter a **topic** and a **message** for a new conversation, then click **Add Conversation** button. After the creation finished, the new conversation will be shown in the page.

1. Add the **group threads** interface.
   1. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **GroupThreads** method.

		````c#
		ViewBag.GroupId = id;
        var threads = await _repo.GetGroupThreads(id);
        return View("GroupThreads", threads);
		````

   2. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **GetGroupThreads** method.

		````c#
        var graphServiceClient = await GetGraphServiceAsync();
        var request = graphServiceClient.Groups[id].Threads.Request().Select("id,topic,preview,lastDeliveredDateTime");
        var allThreads = new List<ThreadModel>();
        do
        {
            var threads = await request.GetAsync();
            allThreads.AddRange(threads.CurrentPage.Select(x => new ThreadModel
            {
                Id = x.Id,
                topic = x.Topic,
                preview = x.Preview,
                lastDeliveredDateTime = x.LastDeliveredDateTime
            }).ToList());
            request = threads.NextPageRequest;
        } while (request != null);
        return allThreads;
		````

   3. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **AddThread** method.

		````c#
		await _repo.AddGroupThread(groupId, topic, message);
        // Sometimes the newly added thread can't be retrieved immediately, so wait a second to work around this issue
        Thread.Sleep(1000);
        return RedirectToAction("GroupThreads", new RouteValueDictionary(new { id = groupId }));
		````

   4. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **AddGroupThread** method.

		````c#
        var graphServiceClient = await GetGraphServiceAsync();
        var thread = new ConversationThread()
        {
            Topic = topic,
            // Threads contain posts
            Posts = new ConversationThreadPostsCollectionPage()
        };
        thread.Posts.Add(new Post()
        {
            Body = new ItemBody() { Content = message, ContentType = BodyType.Text }
        });
        return await graphServiceClient.Groups[groupId].Threads.Request().AddAsync(thread);
		````

   5. Test this interface:
      1. In **Visual Studio**, press **F5** to begin debugging, when prompted, log in with your **Organizational Account**.
      2. On the **Home** page, click **Group** menu, then click **Joined Groups** button, the group list will be shown.
      3. On **Group List** page, click the **Threads** link for any group, you will find **Group Threads** page like the following screenshot.

         ![Screenshot of the previous step](Images/Figure27.png)

      4. At the top of the **Group Threads** page, enter a **topic** and a **message** for a new thread, then click **Add Thread** button. After the creation finished, the new thread will be shown in the page.

1. Add the **all the posts within a thread** interface.
   1. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **GroupThreadPosts** method.

		````c#
		ViewBag.GroupId = groupId;
        ViewBag.ThreadId = threadId;
        var threads = await _repo.GetGroupThreadPosts(groupId, threadId);
        return View("GroupThreadPosts", threads);
		````

   2. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **GetGroupThreadPosts** method.

		````c#
        var graphServiceClient = await GetGraphServiceAsync();
        var request = graphServiceClient.Groups[groupId].Threads[threadId].Posts.Request().Select("body,from,sender");
        var allPosts = new List<PostModel>();
        do
        {
            var posts = await request.GetAsync();
            allPosts.AddRange(posts.CurrentPage.Select(x => new PostModel
            {
                content = x.Body.Content,
                fromEmailAddress = x.From.EmailAddress.Address,
                senderEmailAddress = x.Sender.EmailAddress.Address
            }).ToList());
            request = posts.NextPageRequest;
        } while (request != null);
        return allPosts;
		````

   3. Test this interface:
      1. In **Visual Studio**, press **F5** to begin debugging, when prompted, log in with your **Organizational Account**.
      2. On the **Home** page, click **Group** menu, then click **Joined Groups** button, the group list will be shown.
      3. On **Group List** page, click **Threads** link of any group.
      4. On **Groups Threads** page, click the **Post** link for any thread, you will find **posts list** like the following screenshot.

         ![Screenshot of the previous step](Images/Figure28.png)

1. Add the **events associated with the group** interface.
   1. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **GroupEvents** method.

		````c#
        ViewBag.GroupId = id;
        var groupEvents = await _repo.GetGroupEvents(id);
        return View("GroupEvents", groupEvents);
		````

   2. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **GetGroupEvents** method.

		````c#
        var graphServiceClient = await GetGraphServiceAsync();
        var request = graphServiceClient.Groups[groupId].Events.Request().Select("subject,bodyPreview,start,end,webLink");
        var allEvents = new List<EventModel>();
        do
        {
            var events = await request.GetAsync();
            allEvents.AddRange(events.CurrentPage.Select(x => new EventModel
            {
                subject = x.Subject,
                bodyPreview = x.BodyPreview,
                webLink = x.WebLink,
                start = DateTime.SpecifyKind(DateTime.Parse(x.Start.DateTime), x.Start.TimeZone == "UTC" ? DateTimeKind.Utc : DateTimeKind.Local),
                end = DateTime.SpecifyKind(DateTime.Parse(x.End.DateTime), x.End.TimeZone == "UTC" ? DateTimeKind.Utc : DateTimeKind.Local)
            }).ToList());
            request = events.NextPageRequest;
        } while (request != null);
        return allEvents;
		````

   3. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **AddEvent** method.

		````c#
        await _repo.AddGroupEvent(groupId, subject, start, end, location);
        return RedirectToAction("GroupEvents", new RouteValueDictionary(new { id = groupId }));
		````

   4. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **AddGroupEvent** method.

		````c#
        var graphServiceClient = await GetGraphServiceAsync();
        return await graphServiceClient.Groups[groupId].Events.Request().AddAsync(new Event()
        {
            Subject = subject,
            Start = new DateTimeTimeZone() { DateTime = start, TimeZone = "UTC" },
            End = new DateTimeTimeZone() { DateTime = end, TimeZone = "UTC" },
            Location = new Location() { DisplayName = location }
        });
		````
   3. Test this interface:
      1. In **Visual Studio**, press **F5** to begin debugging, when prompted, log in with your **Organizational Account**.
      2. On the **Home** page, click **Group** menu, then click **Joined Groups** button, the group list will be shown.
      3. On **Group List** page, click the **Events** link for any group, you will find **Group Events** page like the following screenshot. 

         ![Screenshot of the previous step](Images/Figure29.png)

      4. At the top of the **Group Events** page, enter a **Subject**, **Start Time(UTC)**, **End Time(UTC)**, **Location** for a new event, then click **Add Event** button. After the creation finished, the new event will be shown in the page.

1. Add the **files associated with the group** interface.
   1. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **GroupFiles** method.

		````c#
		ViewBag.GroupId = id;
        var files = await _repo.GetGroupFiles(id);
        return View("GroupFiles", files);
		````

   2. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **GetGroupFiles** method.

		````c#
        var graphServiceClient = await GetGraphServiceAsync();
        var request = graphServiceClient.Groups[groupId].Drive.Root.Children.Request().Select("name,webUrl,lastModifiedDateTime,size");
        var allFiles = new List<FileModel>();
        do
        {
            var files = await request.GetAsync();
            allFiles.AddRange(files.CurrentPage.Select(x => new FileModel
            {
                name = x.Name,
                webLink = x.WebUrl,
                lastModifiedDateTime = x.LastModifiedDateTime,
                size = FormatBytes((long)x.Size)
            }).ToList());
            request = files.NextPageRequest;
        } while (request != null);
        return allFiles;
		````

   3. Open **Controllers/GroupController.cs** file, use the following code to replace the body of **AddFile** method.

		````c#
		var selectedFile = Request.Files["file"];
        string fileName = Path.GetFileName(selectedFile.FileName);
        await _repo.AddGroupFile(groupId, fileName, selectedFile.InputStream);
        return RedirectToAction("GroupFiles", new RouteValueDictionary(new { id = groupId }));
		````

   4. Open **Models/GroupRespository.cs** file, use the following code to replace the body of **AddGroupFile** method.

		````c#
        var graphServiceClient = await GetGraphServiceAsync();
        return await graphServiceClient.Groups[groupId].Drive.Root.Children[fileName].Content.Request().PutAsync<DriveItem>(stream);
		````

   3. Test this interface:
      1. In **Visual Studio**, press **F5** to begin debugging, when prompted, log in with your **Organizational Account**.
      2. On the **Home** page, click **Group** menu, then click **Joined Groups** button, the group list will be shown.
      3. On **Group List** page, click the **Files** link for any group, you will find **Group Files** page like the following screenshot. 

         ![Screenshot of the previous step](Images/Figure30.png)

      4. At the top of the **Group Files** page, select a file, then click **Add File** button. After the adding finished, the new file will be shown in the page.
    
       	 > Note: Please select file which is not empty, as empty files are not accepted. 

19. Close the browser window, terminate the debugging session, and return to Visual Studio.

**Congratulations! You have completed working with the Microsoft Graph SDK against Office 365 Groups.**

## Troubleshooting
1. If you receive an error that indicates ASP.NET could not connect to the SQL database, please see the [SQL Server Database Connection Error Resolution document](../../SQL-DB-Connection-Error-Resolution.md) to quickly resolve the issue. 

2. If you recieve an error saying "Could not load file or assembly Newtonsoft.Jsonthe Newtonsoft.Json", please manually update the Newtonsoft.Json dll. You could update it by executing the following command in **Package Manager Console**.

	````powershell
	Install-Package Newtonsoft.Json -Version 9.0.1
	````

	![Screenshot of the previous step](Images/newtonsoft_error.png)