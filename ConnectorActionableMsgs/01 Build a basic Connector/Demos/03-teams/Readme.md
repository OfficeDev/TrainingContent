# Demo: Sideload the Connector to Microsoft Teams

To complete this demo, the prerequisites for developing Apps for Microsoft Teams must be completed. The setup steps are detailed on the [Getting Started page](https://msdn.microsoft.com/en-us/microsoft-teams/setup). Pay special attention to the sections **Prepare your Office 365 tenant** and **Use Teams App Studio**.

To run this demo, perform the following steps:

## Sideload app into Microsoft Teams

Side loading a Microsoft Teams Connector requires a zip file containing a manifest that describes the connector along with related resources.

1. From the connector setup page, select the **Download Manifest** button which will download the manifest.json file to your machine.

1. Open the manifest.json file in an editor and replace the `icons` section with the following json and save the file.

    ````json
    "icons": {
      "outline": "connector-icon-20x20.png",
      "color": "connector-icon-96x96.png"
    },
    ````

1. Add the manifest.json plus the `Lab Files/Teams/connector-icon-20x20.png` and `Lab Files/Teams/connector-icon-96x96.png` to a zip file. In this demo, the zip file is named **TeamsConnector.zip**.

1. In the Microsoft Teams application, select the **Add team** link. Then select the **Create team** button.

    ![Screenshot of Microsoft Teams](../../Images/Exercise3-01.png)

1. Enter a team name and description. In this example, the team is named **Connector Team**. Select **Next**.

1. Optionally, invite others from your organization to the team. This step can be skipped in this lab.

1. The new team is shown. In the left-side panel, select the ellipses next to the team name. Choose **Manage team** from the context menu.

    ![Screenshot of Microsoft Teams menu with Manage team highlighted](../../Images/Exercise3-02.png)

1. On the Manage Team display, select **Apps** in the tab strip. Then select the **Upload a custom app** link at the bottom right corner of the application. Navigate to the folder where the **TeamsConnector.zip** file is and select it.

    ![Screenshot of Microsoft Teams Apps screen with Upload a custom app highlighted](../../Images/Exercise3-03.png)

1. The app is displayed.

    ![Screenshot of apps in Microsoft Teams](../../Images/Exercise3-04.png)

The Connector is now sideloaded into the Microsoft Teams application.

## Add connector to a channel

1. Make sure your application is running.

1. Select the ellipses next to the channel name, then select **Connectors**.

    ![Screenshot of channel menu with connectors highlighted](../../Images/Exercise3-05.png)

1. Scroll to the bottom of the connector list. A section named **Sideloaded** contains the connector described by the manifest. Select **Configure**.

    ![Screenshot of connectors list in Microsoft Teams](../../Images/Exercise3-06.png)

1. A dialog window is shown with the general and notification information described on the Connector Developer portal. Select the **Visit site to install** button.

    ![Screenshot of information dialog in Microsoft Teams](../../Images/Exercise3-07.png)

1. Choose the **Connect to Office 365** button. Office 365 will process the registration flow. You will see the **Registration Successful** notice.  Close this window and select **Done**.

1. The conversation window of the channel will now show the Welcome Message card that was sent via the API.

    ![Screenshot of conversation window in Microsoft Teams with message card](../../Images/Exercise3-08.png)