# Send an Adaptive Card via email using the Microsoft Graph

A command-line sample that uses [Microsoft Authentication Library](https://www.nuget.org/packages/Microsoft.Identity.Client) and the [Microsoft Graph Client Library](https://www.nuget.org/packages/Microsoft.Graph/) to send a message with an [Adaptive Card](https://adaptivecards.io/) to the authenticated user.

## Running the sample

In order to run the sample, you need to register an application in the [Application Registration Portal](https://apps.dev.microsoft.com) to obtain an application ID, then copy that application ID into the [App.config](./App.config) file.

### Register the application

1. Open the [Azure Active Directory admin center](https://aad.portal.azure.com).

1. Log in with the work or school account that is an administrator in the tenant.

1. Select **Azure Active Directory** in the left-most blade.

1. Select **App registrations** in the left-hand menu.

1. Select **New registration**.

1. Enter a name for the application. A suggested name is `Expense Card mailer`. Select **Register**.

1. In the **Overview** blade, copy the **Application (client) ID**.

1. In the **Overview** blade, , copy the **Directory (tenant) ID**.

1. Select **Authentication** in the left-hand menu.

1. In the **Redirect URIs** > **Suggested Redirect URIs for public clients (mobile, desktop)** section, select the native client URI. (`https://login.microsoftonline.com/common/oauth2/nativeclient`)

1. Select **Save** from the toolbar at the top of the Authentication blade.

### Add the application ID & tenant ID to the project

1. Open the [App.config](App.config) file in Solution Explorer.

1. Find the following line:

    ```xml
    <add key="applicationId" value="[your-app-id-here]" />
    <add key="tenantId" value="[your-tenant-id-here]" />
    ```

1. Paste the application ID you copied from the portal into the `value`, replacing the token `[your-app-id-here]`.

1. Past the tenant ID you copied from the portal into the `value`, replacing the token `[your-tenant-id-here]`.

1. Save the file.

### Build the app

1. Press **Ctrl+Shift+B** in Visual Studio to build the app.

1. An executable program named **SendEmailCard.exe** is compiled into the `bin` folder. This executable is used in the lab.

### Run the app

1. Open a command prompt.

1. Change to the folder containing the **SendEmailCard.exe** file.

1. Run the command, specifying two arguments:

    ```shell
    SendEmailCard.exe actionable|adaptive path_to_card_json_file
    ```

1. A pop-up authentication window should appear. Login with the Work or School  account specified in the Actionable Email Developer Dashboard. Review the list of requested permissions and click **Accept** or **Cancel**. (**Note:** choosing **Cancel** will result in the app returning an error and not sending a message.)

1. The command prompt window should output `Message sent` to indicate success. Check your inbox using Outlook on the web for the message.
