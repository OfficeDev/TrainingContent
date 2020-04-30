# Demo: Create search command messaging extensions

This completed project is the result of the lab exercise **Create search command messaging extensions** that is referenced in the [README](./../../README.md) in this repo.

## Prerequisites

> [!IMPORTANT]
> In most cases, installing the latest version of the following tools is the best option. The versions listed here were used when this module was published and last tested.

- Office 365 Tenancy
- [.NET Core 3.0 SDK](https://dotnet.microsoft.com/download)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/) - v10.\* (or higher)
- NPM (installed with Node.js) - v6.\* (or higher)
- [Visual Studio Code](https://code.visualstudio.com)

## Run the send-email-card-dotnetcore project

- Create an Azure AD application by following the instructions in the lab exercise associated with this demo. In this step, you are instructed to collect these data elements:
  - tenantId
  - applicationId (ClientId)
  - applicationSecret (ClientSecret)
- Update the properties in the **[appsettings.json](./appsettings.json)** with the values you collected in the last step.
- Build and run the application by following the instructions in the lab exercise associated with this demo.

## Run the refresh-card-ts project

- Register the service in the Actionable Mail Developer Dashboard by following the instructions in the lab exercise associated with this demo.
- Download the required dependencies for this project by executing the following command in the console:

    ```shell
    npm install
    ```

- Rename the file **.env.example** to **.env**.
- Build and run the application by following the instructions in the lab exercise associated with this demo.
