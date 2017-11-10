# Demo - Section 1: Create a Card payload and submit it via an Incoming Webhook

To run this demo, perform the following steps from the lab:

### Create Group and configure Webhook

1. Open a browser and navigate to **https://outlook.office.com**. Log in with your Office 365 credentials.
1. Create a new Group, or navigate to an existing Group.
1. At the top-left of the screen, click the chevron next to the member count. Choose **Connectors**.

    ![](../../Images/Exercise1-01.png)

1. In the list of Connectors, scroll down and then select **Incoming Webhook**. Click **Add**.

    ![](../../Images/Exercise1-02.png)

1. Enter a name for the connector and click **Create**.
1. The page will re-display, now including a URL for the connector. Click the icon next to the URL to copy it to the clipboard.

    ![](../../Images/Exercise1-03.png)

    > Note: The URL will be used several times in this Exercise, as will the clipboard. We recommend pasting the URL into Notepad or other application.

1. Click **Done**. Then close the Connector flyout.

### Explore MessageCard Playground

1. In another browser tab or window, navigate to **https://messagecardplayground.azurewebsites.net**.
1. The playground site provides for uploading a custom card definition or reviewing several samples. Use the **select a sample** dropdown to select a sample that closely matches your requirements. (The image in this lab uses the **Connectors reference example**, but that is not required.)

    ![](../../Images/Exercise1-04.png)

1. After selecting an example, click **Send via WebHook**.
1. Enter or paste the URL copied earlier from the Group Connector configuration panel.
1. Click **OK**. The card will display in the Outlook Group conversation display. (You may have to click on the **New Activity** indicator to see the card.)

### Send card via PowerShell
It is not necessary to use the playground web site to send test messages. Any facility for sending HTTP POST requests can also send cards to the Group.

1. In the MessageCard Playground site, select a different sample card. (This will be easier to identify in the Conversation view if the cards are different.)
1. Select the JSON and copy it to Notepad.
1. Save the card source as **connector-card.json**.
1. Open **Windows PowerShell** and change to the directory containing the **connector-card.json** file.
1. Execute the following commands:

    ```powershell
    $message = Get-Content .\connector-card.json
    $url = <YOUR WEBHOOK URL>
    Invoke-RestMethod -ContentType "application/json" -Body $message -Uri <YOUR WEBHOOK URL> -Method Post
    ```

    ![](../../Images/Exercise1-06.png)

    > The `Invoke-RestMethod` cmdlet will return **1** to indicate success.