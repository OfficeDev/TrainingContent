# Demo: Upload the Connector to Microsoft Teams

To complete this demo, the prerequisites for developing Apps for Microsoft Teams must be completed. The setup steps are detailed on the [Getting Started page](https://msdn.microsoft.com/en-us/microsoft-teams/setup). Pay special attention to the sections **Prepare your Office 365 tenant**.

In addition, the demo for exercise 2, available in the **Demos\02-webconnector** must be completed. This demo uses the same Connector registration and web application.

To run this demo, perform the following steps:

## Ensure Demo 2 is running

1. The web application from Demo 2 must be updated and running.

1. The ngrok secure tunnel must be running.

1. A connector must be registered on the [Connectors Developer Dashboard](https://aka.ms/connectorsdashboard).

## Create Microsoft Teams app

1. From the Connectors Developer Dashboard, select the **Download Manifest**.

1. Open the manifest.json file in an editor.

1. Change the **manifestVersion** attribute to `"1.5"`.

1. Replace the `icons` section with the following json and save the file.

    ````json
    "icons": {
      "outline": "connector-icon-outline.png",
      "color": "connector-icon-color.png"
    },
    ````

1. Remove the **needsIdentity** attribute. Be sure to remove the comma from the previous attribute to ensure the file has a valid JSON format.

1. Copy the image files `Lab Files/Teams/connector-icon-20x20.png` and `Lab Files/Teams/connector-icon-96x96.png` to the directory with the downloaded manifest.

1. In **Windows Explorer**, select the `manifest.json`, `connector-icon-outline.png` and `connector-icon-color.png` files. Right-click and select **Send to > Compressed (zipped) folder**. Name the zip file **ToDoConnector.zip**.

    ![Screenshot of Windows Explorer, creating a zip file](../../Images/Exercise3-01.png)

## Upload app into Microsoft Teams

1. In the Microsoft Teams application, select the **Add team** link. Then select the **Create team** button.

1. Enter a team name and description. In this example, the team is named **Connector Team**. Select **Next**.

1. Optionally, invite others from your organization to the team. This step can be skipped in this lab.

1. The new team is shown. In the left-side panel, select the ellipses next to the team name. Choose **Manage team** from the context menu.

1. On the Manage Team display, select **Apps** in the tab strip. Then select the **Upload a custom app** link at the bottom right corner of the application. Navigate to the folder where the **ToDoConnector.zip** file is and select it.

    ![Screenshot of Microsoft Teams Apps screen with Upload a custom app highlighted](../../Images/Exercise3-03.png)

1. The app is uploaded.

## Add connector to a channel

1. Make sure your web application is running.

1. Select the ellipses next to the channel name, then select **Connectors**.

    ![Screenshot of channel menu with connectors highlighted](../../Images/Exercise3-05.png)

1. Scroll to the bottom of the connector list. A section named **Sideloaded** contains the connector described by the manifest. Select **Configure**.

    ![Screenshot of connectors list in Microsoft Teams](../../Images/Exercise3-06.png)

1. A dialog window is shown with the configuration page specified in the manifest. Enter a name for the connector instance and select **Save**.

1. The Connectors dialog will switch to the **Configured** page. The ToDo Connector is displayed. Selecting the **1 Configured** text will show the details of the connector instance.

    ![Screenshot of configured connectors in Microsoft Teams](../../Images/Exercise3-07.png)

1. A system message is sent to the channel with a notification of the new connection. In addition, the Welcome Message from the website is sent to the channel.

    ![Screenshot of system notification and welcome message in channel](../../Images/Exercise3-08.png)
