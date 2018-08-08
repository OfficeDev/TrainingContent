# Demo - Section 2: Build a basic Microsoft Teams Bot

To run this demo, perform the following steps from the lab:

## Download NuGet packages

1. Launch Visual Studio 2017 as an administrator
1. Build the solution to download all configured NuGet packages.

## Configure URL

1. In Solution Explorer, double-click on **Properties**
1. In the Properties designer, select the **Web** tab.
1. Note the Project URL.

    ![](../../Images/Exercise2-02.png)

## Run the ngrok secure tunnel application

1. Open a new **Command Prompt** window.

1. Change to the directory that contains the **ngrok.exe** application.

1. Run the command `ngrok http 3007`.

1. The ngrok application will fill the entire prompt window. Make note of the forwarding address using HTTPS. This address is required in the next step.

1. Minimize the ngrok command prompt window. It is no longer referenced in this exercise, but it must remain running.

	![Screenshot of ngrok highlighting local host.](../../Images/Exercise2-03.png)

## Register the bot

1. Go to the [Microsoft Bot Framework portal](https://dev.botframework.com/bots/new) and sign in. The registration portal accepts a work or school account or a Microsoft account.

1. Select **Create a bot or skill**. If the create button is not shown, select **My bots** in the top navigation.

1. Complete the bot profile section, entering a display name, unique bot handle and description.

    ![Screenshot of bot profile form.](../../Images/Exercise2-04.png)

1. Complete the configuration section.
    - For the **Messaging endpoint**, use the forwarding HTTPS address from ngrok with `/api/messages` appended to provide the route to the **MessagesController** in the Visual Studio project. In the example, this is `https://a2632edd.ngrok.io/api/messages`.
    - Select the **Create Microsoft App ID and password button** to open a new browser window.
    - In the new browser window the application is registered in Azure Active Directory. Select **Generate an app password to continue**. An app password is generated. Copy the password and save it. You will use it in a subsequent step.
    - Select **OK** to close the dialogue box.
    - Select the **Finish and go back to Bot Framework** button to close the new browser window and populate the app ID in the **Paste your app ID below to continue textbox**.

        ![Screenshot of configuration form for teams bot.](../../Images/Exercise2-05.png)

1. Move to the bottom of the page. Agree to the privacy statement, terms of use, and code of conduct and select the **Register** button. Once the bot is created, select **OK** to dismiss the dialogue box. The **Connect to channels** page is displayed for the newly-created bot.

1. The bot must then be connected to Microsoft Teams. Select the **Teams** logo.

    ![Screenshot of channel menu with Microsoft Teams icon highlighted.](../../Images/Exercise2-06.png)

1. When the connection is complete, ensure the connection is enabled and select **Done**.

    ![Screenshot of MSTeams bot confirmation page.](../../Images/Exercise2-07.png)

    The bot registration is complete. Selecting **Settings** in the top navigation will re-display the profile and configuration sections. This can be used to update the messaging endpoint in the event ngrok is stopped, or the bot is moved to production.

## Configure the web project

The bot project must be configured with information from the registration.

1. In Visual Studio, open the **Web.config** file. Locate the `<appSettings>` section.

1. Enter the `BotId` value. The `BotId` is the **Bot handle** from the **Configuration** section of the registration.

1. Enter the `MicrosoftAppId`. The `MicrosoftAppId` is the app ID from the **Configuration** section of the registration.

1. Enter the `MicrosoftAppPassword`. The `MicrosoftAppPassword` is the auto-generated app password displayed in the dialogue box during registration. If you do not have the app password, the bot must be deleted and re-registered. An app password cannot be reset nor displayed.

    > If you do not have the app password, the bot must be deleted and re-registered. An app password cannot be reset nor displayed.

1. Press **F5** to run the project. This will update the package (a zip file) in the build output folder (`bin\\`).

## Sideload app into Microsoft Teams

Although not strictly necessary, in this demo you will add the bot to a new team.

1. In the Microsoft Teams application, select the **Add team** link. Then select **Create team**.

    ![Screenshot of Microsoft Teams with add team highlighted.](../../Images/Exercise1-08.png)

1. Enter a team name and description. In this example, the team is named **teams-bot-1**. Select **Next**.

1. Optionally, invite others from your organization to the team. This step can be skipped in this lab.

1. The new team is shown. In the left-side panel, select the ellipses next to the team name. Choose **Manage team** from the menu.

    ![Screenshot of Microsoft Teams with manage team menu highlighted.](../../Images/Exercise2-12.png)

1. On the manage team page, select **Apps** in the tab strip. Then select the **Upload a custom app** link at the bottom right corner of the application.

1. Select the **teams-bot1.zip** file from the **bin** folder. Select **Open**.

1. The app is displayed. Notice the description and icon for the app from the manifest is displayed.

    ![Screenshot of Microsoft Teams bot with information about the bot highlighted.](../../Images/Exercise2-13.png)

    The app is now sideloaded into the Microsoft Teams application and the bot is available.

### Interact with the bot

1. In the general channel for the team, a message is created announcing the bot has been added to the team. To interact with the bot, @ mention the bot.

    ![Screenshot of Microsoft Teams displaying welcome page.](../../Images/Exercise2-14.png)

1. As you test the bot, you will notice that the character count is not correct. You can set breakpoints in the Visual Studio project to debug the code. (Remember, however, that the count was correct using the registration portal.) Later modules of this training will review how to remove mentions from the message.
