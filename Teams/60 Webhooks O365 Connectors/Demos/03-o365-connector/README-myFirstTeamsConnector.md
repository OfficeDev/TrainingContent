# My First Teams Connector

## How to configure the Connector in the Connectors Developer Dashboard

All Connectors has to be registered in the [Connectors Developer Dashboard](https://outlook.office.com/connectors/publish), which you have to log in to using a Microsoft Organizational Account, a Microsoft Account (MSA) will not work. If you're building an internal enterprise connector you only have to register it, and not publish it.

1. Choose to add a *New Connector*
2. Give the Connector a name (`My First Teams Connector`), an image and a short and long description. You also need to add your company/Teams Apps website.
3. As *Configuration page for your Connector*  add the following URL, which is used to connect and configure your Connector (`https://myfirstteamsconnector.azurewebsites.net/myFirstTeamsConnector/config.html`).
4. In the *Valid domains* box enter the Teams Apps website (`https://myfirstteamsconnector.azurewebsites.net`).
5. Choose *Yes* on the *enable actions on your Connector Cards* question.
6. As *Actions URL* add the Connector API endpoint (`https://myfirstteamsconnector.azurewebsites.net/api/connector`).
7. Finally accept the license terms and click *Save*.
8. Once the Connector is saved, copy and paste the ID shown in the URL (in the form of a GUID) and add it to your`.env` file `CONNECTOR_ID` property

## Connector implementation details

### Connector files and pages

* `./src/myFirstTeamsConnector/MyFirstTeamsConnector.ts` - implementation of the Connector that manages registering new subscriptions (`Connect()`) as well as a sample method to send a message to all subscribers (`Ping()`).
* `./src/web/myFirstTeamsConnector/config.html` - the configuration of the Connector .
* `./src/scripts/myFirstTeamsConnectorConfig.tsx` - React component of the configuration page page.

### Connector end-points

For the Connector you will have two generated end-points, defined in `./src/server.ts`.

* `/api/connector/connect` - this is the end-point that is connected to the `Connect` method of the Connector implementation and is used when registering a Connector. 
* `/api/connector/ping` - this is a test end-point to demonstrate how to invoke the Connector using a simple HTTP GET operation. It is highly recommended that you remove this end-point and implement your own logic for invoking the connector.
