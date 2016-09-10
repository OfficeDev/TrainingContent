Calling Microsoft Graph for Mail APIs with iOS
==============================================

## Overview

The lab lets students use an AzureAD account to manage an Exchange mailbox in a
Office 365 tenant with an iOS app.

## Objectives

- Learn how to create a Microsoft Graph client to manage an Exchange mailbox
- Learn how to list folders and messages

## Prerequisites

- OSX 10.X environment
- [XCode 7][xcode-7]
- [Cocoapods dependency manager][cocoapods]
- Complete the  [\\\O3654\O3654-5\01 Azure AD Auth Prerequisites](../01 Azure AD Auth Prerequisites) module.

[xcode-7]: https://itunes.apple.com/nz/app/xcode/id497799835?mt=12
[cocoapods]: https://cocoapods.org

## Exercises

The hands-on lab includes the following exercises:

- [Add Microsoft Graph SDK library to the project](#exercise1)
- [Create a ExchangeGraphService to get access to Exchange](#exercise2)
- [Connect actions in the view to Microsoft Graph SDK for Exchange](#exercise3)

<a name="exercise1"></a>
## Exercise 1: Add Microsoft Graph SDK library to the project
In this exercise you will use an existing application with the AzureAD 
authentication included, to add Microsoft Graph SDK library in the project.

### Task 1 - Open the Project
01. Clone this git repository

02. On Finder, open the **[\\\O3654\O3654-5\04 O365 Exchange SDK\src\O365-Exchange-App\Podfile](./src/O365-Exchange-App/Podfile)** file under the root folder of the project and add the lines inside the **target ... do ... end** statement:

    ```ruby
    pod 'orc'
    pod 'MSGraphSDK'
    ```
    
03. Open a Terminal and navigate to the `src/O365-Exchange-App/` folder of the project.

    Execute the following:

    ```bash
    pod install
    ```
    
02. Open the **.xcworkspace** file in the **[\\\O3654\O3654-5\04 O365 Exchange SDK\src\O365-Exchange-App](/O3654/O3654-5 Native iOS Development with Office 365 APIs/04 O365 Exchange SDK/src/O365-Exchange-App)** folder

03. Find and Open the **Auth.plist** file.

04. Fill the AzureAD account settings with the following configuration values:
    
    > Note: You can find the clientId/redirectUriString in [\\\O3654\O3654-5\01 Azure AD Auth Prerequisites\hands-on-lab.md](../01 Azure AD Auth Prerequisites/hands-on-lab.md)
    
    -   **graphResourceUrl** - The URL of the Microsoft Graph service, it is "https://graph.microsoft.com/v1.0"
    -   **resourceId**              - The root URL of the Microsoft Graph service, it  is "https://graph.microsoft.com"
    -   **authority**               - "https://login.microsoftonline.com/common"
    -   **redirectUriString**       - The redirect URL configured in Azure AD, e.g. "http://example.com/redirect"
    -   **clientId**                - The client Id obtained from Azure AD
    
    ![Screenshot of the previous step](img/fig.01.png)

03. Build and Run the project in an iOS Simulator to check the views

    Application:
    You will see a login page with buttons to access the application and to clear credentials.
    Once authenticated, the mailbox folders list will appear with one fake entry. Selecting one, you will see the emails inside the folder, and also check each email.

    Environment:
    With the credentials settings we can access to the client user mailbox through the Outlook Exchange tenant, and will be able to implement every single details of a complete email app, only using Microsoft Graph SDK
    
    ![Screenshot of the previous step](img/fig.02.png)

<a name="exercise2"></a>
## Exercise 2: Create a ExchangeGraphService to get access to Exchange
In this exercise you will connect your application to get a **MSGraphServiceClient**. This client is able to gather different verbs and send a single command to execute and get results.

01. On the XCode files explorer, make a right click in the group **Helpers** and 
select **New File**. You will see the **New File wizard**. Click on the **iOS** 
section, select **Cocoa Touch Class** and click **Next**.

    ![Screenshot of the previous step](img/fig.03.png)

02. In this section, configure the new class giving it a name (**ExchangeGraphService**), and make it a subclass of **NSObject**. Make sure that the language dropdown is set with **Objective-C** because our o365-lists library is written in that programming language. Finally click on **Next**.

    ![Screenshot of the previous step](img/fig.04.png)    

03. Now we are going to select where the new class sources files (.h and .m) will be stored. In this case we can click on **Create** directly. This will create a **.h** and **.m** files for our new class.

    ![Screenshot of the previous step](img/fig.05.png)

04. Open the **ExchangeGraphService.h** and add the header for the **getGraphServiceClient** method to get **MSGraphServiceClient**.

    ```objc
    -(void)getGraphServiceClient:(void (^)(MSGraphClient * client, NSError *error))getClientCallBack;
    ```

    Add the import sentence

    ```objc
	#import <MSGraphSDK.h>
    #import <ADAL.h>
    #import <MSBlockAuthenticationProvider.h>
    ```
05. In **ExchangeGraphService.m** add the method body:

    ```objc
	-(void)getGraphServiceClient:(void (^)(MSGraphClient* client, NSError *error))callback{
    
    [self getGraphServiceAccessToken:^(ADAuthenticationResult *result) {
        if(result != nil && result.status == AD_SUCCEEDED){
            NSString *accessToken = result.accessToken;
            MSBlockAuthenticationProvider *provider = [MSBlockAuthenticationProvider 				providerWithBlock:^(NSMutableURLRequest *request, MSAuthenticationCompletion completion) {
                NSString *oauthAuthorizationHeader = [NSString stringWithFormat:@"bearer %@", accessToken];
                [request setValue:oauthAuthorizationHeader forHTTPHeaderField:@"Authorization"];
                completion(request, nil);
            }];
            [MSGraphClient setAuthenticationProvider:provider];
            
            callback([MSGraphClient client], nil);
        }
        else{
            callback(nil, nil);
        }
    }];
	} 
	
	-(void)getGraphServiceAccessToken:(void (^)(ADAuthenticationResult* result))callback{
    
    NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"Auth" ofType:@"plist"];
    NSDictionary *content = [NSDictionary dictionaryWithContentsOfFile:plistPath];
    NSString *clientId = [content objectForKey:@"clientId"];
    NSString *graphResourceId = [content objectForKey:@"resourceId"];
    NSString *authority = [content objectForKey:@"authority"];
    NSString *redirectUriString = [content objectForKey:@"redirectUriString"];
    ADAuthenticationError *error;
    ADAuthenticationContext* context = [ADAuthenticationContext authenticationContextWithAuthority:authority error:&error];
    if (!context)
    {
        //here need
        callback(nil);
        return;
    }
    
    [context acquireTokenWithResource:graphResourceId clientId:clientId redirectUri:[NSURL URLWithString:redirectUriString] completionBlock:^(ADAuthenticationResult *result) {
        callback(result);
    }];
    
	}	
    ```
06. Open the **ExchangeGraphService.h** and add the header for the **getGraphServiceClient** method to get folders.

    ```objc
    -(void)getFolders:(void (^)(NSArray * folders, NSError *error))getFoldersCallBack;
    ```
    
07. In **ExchangeGraphService.m** add the method body:

    ```objc
	-(void)getFolders:(void (^)(NSArray * folders, NSError *error))getFoldersCallBack{
    	[self getGraphServiceClient:^(MSGraphClient *client, NSError *error) {
        	if(error != nil){
            	getFoldersCallBack(nil, error);
        	}
        	else{
            	[[[[[client me] mailFolders] request] orderBy:@"displayName"] getWithCompletion:^(MSCollection 	*response, MSGraphUserMailFoldersCollectionRequest *nextRequest, NSError *error) {
                getFoldersCallBack(response.value, error);
            	}];
        	}
    	}];
	}
    ```
08. Open the **ExchangeGraphService.h** and add the header for the **getGraphServiceClient** method to get message list for specific folder.

    ```objc
    -(void)getFolderContent:(NSString*)folderId  callback:(void (^)(NSArray * messages, NSError *error))getFolderContentCallBack;
    ```
    
07. In **ExchangeGraphService.m** add the method body:

    ```objc
    -(void)getFolderContent:(NSString*)folderId  callback:(void (^)(NSArray * messages, NSError *error))getFolderContentCallBack
{
    [self getGraphServiceClient:^(MSGraphClient *client, NSError *error) {
        if(error != nil){
            getFolderContentCallBack(nil, error);
        }
        else{
            NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"Auth" ofType:@"plist"];
            NSDictionary *content = [NSDictionary dictionaryWithContentsOfFile:plistPath];
            NSString *graphResourceUrl = [content objectForKey:@"graphResourceUrl"];
            
            MSGraphUserMessagesCollectionRequestBuilder *builder = [[MSGraphUserMessagesCollectionRequestBuilder alloc] initWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@/me/mailFolders/%@/messages",graphResourceUrl,folderId]] client:client];
            [[builder request] getWithCompletion:^(MSCollection *response, MSGraphUserMessagesCollectionRequest *nextRequest, NSError *error) {
                getFolderContentCallBack(response.value, error);
            }];
            
        }
    }];
	}
    ```
           
05. Build the application and check everything is ok.

<a name="exercise3"></a>
## Exercise 3: Connect actions in the view to Microsoft Graph SDK for Exchange
In this exercise you will navigate in every controller class of the project, in order to connect each action (from buttons, lists and events) with Exchange operations.

The Application has every event wired up with their respective controller classes. 
We need to connect these event methods to execute a verb in Exchange and gather the results.
The verb is composed by an aggregation of commands that will generate a single sentence to execute in the server side using OData queries and filters.

### Task1 - Wiring up FolderListView

01. Open the **FolderListViewController.h** class header and add two properties to hold the array that will hold the folder from the account and another one to hold the current folder when selecting from the table.

    ```objc
    @property (nonatomic) NSArray *folders;
    @property (nonatomic) MSGraphMailFolder *currentFolder;
    ```
    
    And add the import sentence

    ```objc
	#import <MSGraphSDK.h>
	#import "ExchangeGraphService.h"
    ```
    
02. Open the **FolderListViewController.m** class implementation

03. Add the **getFolders** method:

    ```objc
	-(void)getFolders{
	    [self.spinner startAnimating];
	    
	    ExchangeGraphService *exchangeService =[[ExchangeGraphService alloc] init];
	    [exchangeService getFolders:^(NSArray *folders, NSError *error) {
	        self.folders = folders;
	        dispatch_async(dispatch_get_main_queue(),^{
	            [self.spinner stopAnimating];
	            [self.tableView reloadData];
	        });
	    }];
	}
    ```

04. Call the **getFolders** method from **viewWillAppear**:

    ```objc
	- (void) viewWillAppear:(BOOL)animated{
	    [self getFolders];
	}
    ```

05. Change the **UITableView** delegate methods:

    ```objc
	- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
	    return [self.folders count];
	}

	- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
	    NSString* identifier = @"folderListCell";
	    EmailListTableViewCell *cell =[tableView dequeueReusableCellWithIdentifier: identifier ];
	    
	    MSGraphMailFolder *cellFolder = (MSGraphMailFolder*)[self.folders objectAtIndex: indexPath.row];
	    cell.title.text = cellFolder.displayName;
	    
	    return cell;
	}
        
	- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
	{
	    
	    FolderContentViewController *controller = (FolderContentViewController *)segue.destinationViewController;
	    //controller.currentFolder = self.currentFolder;
	    
	}

	- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
	{
	    self.currentFolder= [self.folders objectAtIndex:indexPath.row];
	    
	    [self performSegueWithIdentifier:@"detail" sender:self];
	}
    ```

06. Build and Run the application. Check everything is ok. Now you can see the list with all the folders from the Outlook account.

    ![Screenshot of the previous step](img/fig.06.png)

### Task2 - Wiring up FolderContentView

01. In **FolderListViewController.m** file, uncomment the **prepareForSegue:sender:**

    ```objc
    controller.currentFolder = self.currentFolder;
    ```

    And add a property to hold the folder in **FolderContentViewController.h**

    ```objc
    @property (nonatomic) MSGraphMailFolder *currentFolder;
    ```
    
    And add the import sentence

    ```objc
	#import <MSGraphSDK.h>
	#import "ExchangeGraphService.h"
    ```
02. And add two properties to hold the contents, and another one to hold the current message selection in **FolderContentViewController.h**
 
    ```objc
    @property (nonatomic) NSArray *folderMessages;
    @property (nonatomic) MSGraphMessage *currentMsg;
    ```
    
02. Now in **FolderContentViewController.m** add method **getFolderContent** to load the folder contents:

    ```objc
    -(void) getFolderContent{
    [self.spinner startAnimating];
    ExchangeGraphService *exchangeService =[[ExchangeGraphService alloc] init];
    [exchangeService getFolderContent:self.currentFolder.entityId callback:^(NSArray *messages, NSError *error) {
        self.folderMessages = messages;
        dispatch_async(dispatch_get_main_queue(),^{
            [self.spinner stopAnimating];
            [self.tableView reloadData];
        });
     }];
}
    ```

03. In the **viewDidAppear** method, add code to call the **getFolderContent** method

    ```objc
	-(void) viewDidAppear:(BOOL)animated{
	    self.currentMsg = nil;
	    [self getFolderContent];
	}
    ```

04. Change the **UITableView** delegate methods:

    ```objc
	- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
	    return [self.folderMessages count];
	}

	- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
	    NSString* identifier = @"msgListCell";
	    EmailListTableViewCell *cell =[tableView dequeueReusableCellWithIdentifier: identifier ];
	    
	    MSGraphMessage *msg = [self.folderMessages objectAtIndex:indexPath.row];
	    
	    cell.title.text = msg.from.emailAddress.name;
	    cell.subtitle.text = msg.bodyPreview;
	    
	    return cell;
	}
	- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
	{
	    
	    EmailDetailViewController *controller = (EmailDetailViewController *)segue.destinationViewController;
	    //controller.currentMsg = self.currentMsg;
	    
	}
	- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
	{
	    self.currentMsg= [self.folderMessages objectAtIndex:indexPath.row];
	    
	    [self performSegueWithIdentifier:@"msgDetail" sender:self];
	}

	- (BOOL)shouldPerformSegueWithIdentifier:(NSString *)identifier sender:(id)sender{
	    return ([identifier isEqualToString:@"msgDetail"] && self.currentMsg);
	}
    ```

05. Add the folder name in the label. To do so, add the following in the **viewDidLoad** method.

    ```objc
    self.folderName.text = self.currentFolder.displayName;
    self.title = self.currentFolder.displayName;
    ```


06. Build and Run the application. Check everything is ok. Now you can see the list with all the messages of a Folder.

    ![Screenshot of the previous step](img/fig.07.png)

### Task3 - Wiring up EmailDetailView

01. In **EmailDetailViewController.h** add a property to hold the current message:

    ```objc
    @property (nonatomic) MSGraphMessage *currentMsg;
    ```

    And add the import sentence

    ```objc
	#import <MSGraphSDK.h>
	#import "ExchangeGraphService.h"
    ```

02. In **EmailDetailViewController.m**, in the **viewDidLoad** method, replace the following code

	```objc
	self.author.text = @"authorName";
    self.subject.text = @"aSubjet";
    self.date.text = @"aDate";
    [self.emailBody loadHTMLString:@"aBodyContent"  baseURL: nil];
	```

	with the code below:

    ```objc
    self.author.text = self.currentMsg.from.emailAddress.name;
    self.subject.text = self.currentMsg.subject;
    
    [self.emailBody loadHTMLString:self.currentMsg.body.content  baseURL: nil];
    
    NSDate *msgDate = self.currentMsg.sentDateTime;
    
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"MM-dd-yyyy"];
    self.date.text = [formatter stringFromDate:msgDate];
    ```
    
03. Now in **FolderContentViewController.m**, uncomment the line in **prepareForSegue:sender:** method

    ```objc
    //controller.currentMsg = self.currentMsg;
    ```

04. Build and Run the application. Check everything is ok. Now you can see the email and its details

    ![Screenshot of the previous step](img/fig.08.png)

## Summary

By completing this hands-on lab you have learned:

01. The way to connect an iOS application with an Office 365 tenant.

02. How to retrieve information from Outlook using Microsoft Graph SDK.