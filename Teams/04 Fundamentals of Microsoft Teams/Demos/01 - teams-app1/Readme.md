# Demo - Section 1: Teams application packaging and testing

To run this demo, perform the following steps from the lab:

### Complete the prerequisites from the lab
1. Install developer tools
2. Install NodeJS and npm
3. Install Yeoman and gulp
4. Download ngrok

### Run the ngrok secure tunnel application

1. Open a new **Command Prompt** window.
2. Change to the directory that contains the ngrok.exe application.
3. run the command `ngrok http 3007`
4. The ngrok application will fill the entire prompt window. Make note of the Forwarding address using https. This address is required in the next step.
5. Minimize the ngrok Command Prompt window. It is no longer referenced in this exercise, but it must remain running.


### Update the manifest and build the package ###
3. Open the **manifest.json** file in the **manifest** folder.
4. Replace all instances of **tbd.ngrok.io** with the HTTPS Forwarding address from the ngrok window. There are 6 URLs that need to be changed.
5. Save the **manifest.json** file.
6. In the **Command Prompt** window, run the command `gulp manifest`. This command will create the package as a zip file in the **package** folder

    ![](../../Images/Exercise1-06.png)

7. Build the webpack and start the Express web server by running the following commands:

    ```shell
    gulp build
    gulp serve
    ```

    ![](../../Images/Exercise1-07.png)

    > Note: The gulp serve process must be running in order to see the tab in the Teams application. When the process is no longer needed, press `CTRL+C` to cancel the server.



### Sideload app into Microsoft Teams ###

1. In the Microsoft Teams application, click the **Add team** link. Then click the **Create team** button.

    ![](../../Images/Exercise1-08.png)

2. Enter a team name and description. In this example, the Team is named **teams-app-1**. Click Next.
3. Optionally, invite others from your organization to the team. This step can be skipped in this lab.
4. The new team is shown. In the left-side panel, click the elipses next to the team name. Choose **View team** from the context menu.

    ![](../../Images/Exercise1-09.png)

5. On the View team display, click **Apps** in the tab strip. Then click the **Sideload an app** link at the bottom right corner of the application.

    ![](../../Images/Exercise1-10.png)

6. Select the **teams-app-1.zip** file from the **package** folder. Click Open.

    ![](../../Images/Exercise1-11.png)

7. The app is displayed. Notice information about the app from the manifest (Description and Icon) is displayed.

    ![](../../Images/Exercise1-12.png)



### Add Tab to Team view ###

1. Tabs are not automatically displayed for the Team. To add the tab, click on the **General** channel in the Team.

2. Click the + icon at the end of the tab strip.
3. In the Tab gallery, sideloaded tabs are displayed in the **Tabs for your team** section. Tabs in this section are arranged alphabetically. Select the tab created in this lab.

    ![](Images/Exercise1-13.png)

4. The generator creates a configurable tab. When the Tab is added to the Team, the configuration page is displayed. Enter any value in the Setting box and click Save.

    ![](Images/Exercise1-14.png)

5. The value entered will then be displayed in the Tab window.

    ![](Images/Exercise1-15.png)
