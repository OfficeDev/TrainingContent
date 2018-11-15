# Incoming webhook

In this demo, you will demonstrate the incoming webhook capability of Microsoft Teams.

1. In **Microsoft Teams**, select a channel in team.

1. Select **...** next to the channel name, then select **Connectors**.

    ![Screenshot of channel name with general menu displayed.](../../Images/Exercise3-01.png)

1. Find **Incoming Webhook** in the list, select **Add** then **Install**.

  ![Screenshot of list of connectors.](../../Images/Exercise3-02.png)

1. Enter a name for the webhook, upload an image to associate with the data from the webhook, then select **Create**.

1. Select the button next to the webhook URL to copy it. You will use the webhook URL in a subsequent step.

1. Select **Done**.

1. Close the **Connectors** dialog.

### Create a simple connector card message to the webhook

1. Copy the **sample-connector-message.json** file from the **Lab Files** folder to your development machine.

1. Open a **PowerShell** window, go to the directory that contains the **sample-connector-message.json**, and enter the following commands:

    ```powershell
    $message = Get-Content .\sample-connector-message.json
    $url = "<YOUR WEBHOOK URL>"
    Invoke-RestMethod -ContentType "application/json" -Body $message -Uri $url -Method Post
    ```

    ![Screenshot of PowerShell code displaying webhook URL.](../../Images/Exercise3-03.png)

    > **Note:** Replace `<YOUR WEBHOOK URL>` with the webhook URL you saved when you created the **Incoming Webhook** connector.

1. When the POST succeeds, you will see a simple **"1"** outputted by the `Invoke-RestMethod` cmdlet.

1. Check the conversations tab in the Microsoft Teams application. You will see the new card message posted to the conversation.

    ![Screenshot of card message in Microsoft Teams.](../../Images/Exercise3-04.png)

    > Note: The action buttons will not work. Action buttons work only for connectors registered and published in the Microsoft Office store.