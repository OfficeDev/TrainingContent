# Demo: Add authentication to custom Microsoft Teams channel tabs

This completed project is the result of the lab exercise **Add authentication to custom Microsoft Teams channel tabs** that is referenced in the [README](./../../README.md) in this repo.

## Prerequisites

Developing Microsoft Teams apps requires an Office 365 tenant, Microsoft Teams configured for development, and the necessary tools installed on your workstation.

For the Office 365 tenant, follow the instructions on [Microsoft Teams: Prepare your Office 365 tenant](https://docs.microsoft.com/microsoftteams/platform/get-started/get-started-tenant) for obtaining a developer tenant if you do not currently have an Office 365 account and to enable Microsoft Teams for your organization.

In order to build custom apps for Microsoft Teams, you must configure Microsoft Teams to enable custom apps and allow custom apps to be uploaded to your tenant. Follow the instructions on the same **Prepare your Office 365 tenant** page mentioned above.

In this module, you will use Node.js to create custom Microsoft Teams tabs. The exercises in this module assume you have the following tools installed on your developer workstation.

> [!IMPORTANT]
> In most cases, installing the latest version of the following tools is the best option. The versions listed here were used when this module was published and last tested.

- [Node.js](https://nodejs.org/) - v10.\* (or higher)
- NPM (installed with Node.js) - v6.\* (or higher)
- [Gulp](https://gulpjs.com/) - v4.\* (or higher)
- [Yeoman](https://yeoman.io/) - v3.\* (or higher)
- [Yeoman Generator for Microsoft Teams](https://github.com/OfficeDev/generator-teams) - v2.\* (or higher)
- [Visual Studio Code](https://code.visualstudio.com)

If you do not have the minimum versions of these prerequisites installed on your workstation, follow the install instructions for each of these tools before proceeding with the exercise.

## Run this Completed Project

- Create an Azure AD application and grant it the delegated permissions **Mail.Read** & **User.Read** for the Microsoft Graph.
  - Update the following files with the Azure AD application's ID:
    - **./src/app/web/auth-start.html**
    - **./src/app/web/auth-end.html**
- Download the required dependencies for this project by executing the following command in the console:

    ```shell
    npm install
    ```

- Rename the file **.env.example** to **.env**. You do not need to edit any values in this file unless you have an existing ngrok license with a reserved subdomain name & auth key. These are only available to paid paid ngrok accounts, but it is not necessary to run the demo.
- Download the required dependencies for this project by executing the following command in the console:

    ```shell
    gulp ngrok-serve
    ```

- In a browser, navigate to **https://teams.microsoft.com** and sign in with the credentials of a Work and School account.
- Using the app bar navigation menu, select the **Mode added apps** button. Then select **Browse all apps** followed by **Upload for me or my teams**.
- In the file dialog that appears, select the Microsoft Teams package in your project. This app package is a ZIP file that can be found in the project's **./package** folder.
- Select the **Add** button to install the app. This will add a new personal tab to your **More added apps** dialog.
- Select the app to navigate to the new tab.
