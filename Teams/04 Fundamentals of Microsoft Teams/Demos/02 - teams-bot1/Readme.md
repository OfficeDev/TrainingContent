# Demo - Section 2: Build a basic Microsoft Teams Bot

To run this demo, perform the following steps from the lab:

## Download NuGet packages

1. Launch Visual Studio 2017 as an administrator

4. Build the solution to download all configured NuGet packages.

## Configure URL

1. In Solution Explorer, double-click on Properties

2. In the Properties designer, select the Web tab.
3. Note the Project URL.

    ![](Images/Exercise2-02.png)

### Run the ngrok secure tunnel application

1. Open a new **Command Prompt** window.
2. Change to the directory that contains the ngrok.exe application.
3. Run the command `ngrok http [port] -host-header=localhost:[port]` (Replace [port] with the port portion of the URL noted above.)
4. The ngrok application will fill the entire prompt window. Make note of the Forwarding address using https. This address is required in the next step.
5. Minimize the ngrok Command Prompt window. It is no longer referenced in this lab, but it must remain running.

	![](Images/Exercise2-03.png)

### Register the bot ###

1. Go to the Microsoft Bot Framework portal at https://dev.botframework.com and sign in. (The bot registration portal accepts a Work or School Account or a Microsoft Account.)
2. Click Register. (If the Register button is not shown, click **My bots** in the top navigation.)
3. Complete the Bot profile section, entering a Display name, Bot handle and description.

    ![](Images/Exercise2-04.png)

4. Complete the Configuration section.

    1. For the Messaging endpoint, use the Forwarding https address from ngrok prepended to the route to the MessagesController in the Visual Studio project. In the example, this is `https://a2632edd.ngrok.io/API/Messages`

    2. Click the **Create Microsoft App ID and password button**. This opens a new browser tab/window.

    3. In the new browser tab/window the application is registered in Azure Active Directory. Click **Generate an app password to continue**.

    4. An app password is generated. Copy the password and save it. You will use it in a subsequent step.

    5. Click **OK**. This closes the popup.

    6. Click the **Finish and go back to Bot Framework** button. This closes the new browser tab/window and populates the app Id in the **Paste your app ID below to continue textbox**.

        ![](Images/Exercise2-05.png)

5. Scroll to the bottom of the page. Agree to the Privacy statement, Terms of use, and Code of conduct and click the **Register** button. Once the Bot is created, click **OK** to dismiss the pop-up.

The **Connect to channels** page is displayed for the newly-created bot. The bot must be connected to Microsoft Teams.

1. Click the Teams logo.

    ![](Images/Exercise2-06.png)

2. Once the connection is complete, ensure the connection is Enabled and click **Done**

    ![](Images/Exercise2-07.png)

The bot registration is complete.

> Clicking on Settings in the top navigation will re-display the profile and configuration sections. This can be used to update the Messaging endpoint in the event ngrok is stopped, or the bot is moved to staging/production.

### Configure the web project
The bot project must be configured with information from the registration.

1. In Visual Studio, open the Web.config file. Locate the `<appSettings>` section.

2. Enter the BotId value. the BotId is the **Bot handle** from the **Configuration** section of the registration.
3. Enter the MicrosoftAppId. The MicrosoftAppId is the app ID from the **Configuration** section of the registration.
4. Enter the MicrosoftAppPassword. The MicrosoftAppPassword is the auto-generated app password displayed in the pop-up during registration.
    > If you do not have the app password, the bot must be deleted and re-registered. An app password cannot be reset nor displayed.

5. Press **F5** to run the project. This will update the package (a zip file) in the build output folder (bin\\).

### Sideload app into Microsoft Teams ###

Although not strictly necessary, in this lab the bot will be added to a new Team.
1. In the Microsoft Teams application, click the **Add team** link. Then click the **Create team** button.

    ![](Images/Exercise1-08.png)

2. Enter a team name and description. In this example, the Team is named **teams-bot-1**. Click Next.
3. Optionally, invite others from your organization to the team. This step can be skipped in this lab.
4. The new team is shown. In the left-side panel, click the elipses next to the team name. Choose **View team** from the context menu.

    ![](Images/Exercise2-12.png)

5. On the View team display, click **Apps** in the tab strip. Then click the **Sideload an app** link at the bottom right corner of the application.

6. Select the **teams-bot1.zip** file from the *bin* folder. Click Open.

7. The app is displayed. Notice information about the app from the manifest (Description and Icon) is displayed.

    ![](Images/Exercise2-13.png)

The app is now sideloaded into the Microsoft Teams application and the bot is available.

### Interact with the Bot ###

In the General channel for the team, a message is created announcing the bot has been added to the Team. To interact with the bot, @ mention the bot.

![](Images/Exercise2-14.png)

As you test the bot, you will notice that the character count is not correct. You can set breakpoints in the Visual Studio project to debug the code. (Remember, however, that the count was correct using the registration portal.) Later modules of this training will review how to remove mentions from the message.
