# Demo - Section 3: Sideload the Connector to Microsoft Teams

To run this demo, perfom the following steps from the lab:

## Exercise 3: Sideload the Connector to Microsoft Teams

To complete this part of the lab, the prerequistes for developing Apps for Microsoft Teams must be completed. The setup steps are detailed on the [Getting Started page](https://msdn.microsoft.com/en-us/microsoft-teams/setup). Pay special attention to the sections **Prepare your Office 365 tenant** and **Use Teams App Studio**.

### Sideload app into Microsoft Teams

Side loading a Microsoft Teams Connector requires a zip file containing a manifest that describes the Connector along with related resources. 

1. From the connector setup page, click on the `Download Manifest` button which will download the manifest.json file to your machine.

1. Open the manifest.json file in an editor and replace the `icons` section with the following json and save the file.

````json
"icons": {
    "outline": "connector-icon-20x20.png",
    "color": "connector-icon-96x96.png"
},
````

1. Add the manifest.json plus the `Lab Files/Teams/connector-icon-20x20.png` and `Lab Files/Teams/connector-icon-96x96.png` to a zip file. In this demo, the zip file is named `TeamsConnector.zip`

1. In the Microsoft Teams application, click the **Add team** link. Then click the **Create team** button.

    ![](../../Images/Exercise3-01.png)

1. Enter a team name and description. In this example, the Team is named **Connector Team**. Click **Next**.

1. Optionally, invite others from your organization to the team. This step can be skipped in this lab.

1. The new team is shown. In the left-side panel, click the elipses next to the team name. Choose **Manage team** from the context menu.

    ![](../../Images/Exercise3-02.png)

1. On the Manage team display, click **Apps** in the tab strip. Then click the **Upload a custom app** link at the bottom right corner of the application. Navigate to the folder where the `TeamsConnector.zip` file is and select it.

    ![](../../Images/Exercise3-03.png)

1. The app is displayed.

    ![](../../Images/Exercise3-04.png)

The connector is now sideloaded into the Microsoft Teams application.

### Add Connector to a channel

1. Make sure your application is running.

1. Click **...** next to the channel name, then select **Connectors**.

    ![](../../Images/Exercise3-05.png)

1. Scroll to the bottom of the connector list. A section named **Sideloaded** contains the Connector described by the manifest. Click **Configure**.

    ![](../../Images/Exercise3-06.png)

1. An information dialog is shown with the general and notification information described on the Connector Developer portal. Click the **Visit site to install** button.

    ![](../../Images/Exercise3-07.png)

1. Click the **Connect to Office 365** button. Office 365 will process the registration flow. You will see the `Registration Successful` notice.  Close this window and click `Done`.

1. The conversation window of the channel will now show the welcome message card that was sent via the api.

    ![](../../Images/Exercise3-08.png)