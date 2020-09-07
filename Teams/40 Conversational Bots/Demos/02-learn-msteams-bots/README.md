# Conversational Bot - Microsoft Teams App

Generate a Microsoft Teams application.

TODO: Add your documentation here

## Getting started with Microsoft Teams Apps development

Head on over to [Microsoft Teams official documentation](https://developer.microsoft.com/en-us/microsoft-teams) to learn how to build Microsoft Teams Tabs or the [Microsoft Teams Yeoman generator Wiki](https://github.com/PnP/generator-teams/wiki) for details on how this solution is set up.

## Project setup

All required source code are located in the `./src` folder - split into two parts

* `app` for the application
* `manifest` for the Microsoft Teams app manifest

For further details se the [Yo Teams wiki for the project structure](https://github.com/PnP/generator-teams/wiki/Project-Structure)

## Building the app

The application is built using the `build` Gulp task.

``` bash
npm i -g gulp gulp-cli
gulp build
```

## Building the manifest

To create the Microsoft Teams Apps manifest, run the `manifest` Gulp task. This will generate and validate the package and finally create the package (a zip file) in the `package` folder. The manifest will be validated against the schema and dynamically populated with values from the `.env` file.

``` bash
gulp manifest
```

## Configuration

Configuration is stored in the `.env` file. 

## Debug and test locally

To debug and test the solution locally you use the `serve` Gulp task. This will first build the app and then start a local web server on port 3007, where you can test your Tabs, Bots or other extensions. Also this command will rebuild the App if you change any file in the `/src` directory.

``` bash
gulp serve
```

To debug the code you can append the argument `debug` to the `serve` command as follows. This allows you to step through your code using your preferred code editor.

``` bash
gulp serve --debug
```

To step through code in Visual Studio Code you need to add the following snippet in the `./.vscode/launch.json` file. Once done, you can easily attach to the node process after running the `gulp server --debug` command.

``` json
{
    "type": "node",
    "request": "attach",
    "name": "Attach",
    "port": 5858,
    "sourceMaps": true,
    "outFiles": [
        "${workspaceRoot}/dist/**/*.js"
    ],
    "remoteRoot": "${workspaceRoot}/src/"
},
```

### Using ngrok for local development and hosting

In order to make development locally a great experience it is recommended to use [ngrok](https://ngrok.io), which allows you to publish the localhost on a public DNS, so that you can consume the bot and the other resources in Microsoft Teams. 

To use ngrok, it is recommended to use the `gulp ngrok-serve` command, which will read your ngrok settings from the `.env` file and automatically create a correct manifest file and finally start a local development server using the ngrok settings.

### Additional build options

You can use the following flags for the `serve`, `ngrok-serve` and build commands:

* `--no-linting` - skips the linting of Typescript during build to improve build times
* `--debug` - builds in debug mode

## Deploying to Azure using Git

If you want to deploy to Azure using Git follow these steps.

This will automatically deploy your files to Azure, download the npm pacakges, build the solution and start the web server using Express.

1. Log into [the Azure Portal](https://portal.azure.com)
2. Create a new *Resource Group* or use an existing one
3. Create a new *Web App* with Windows App Service Plan and give it the name of your tab, the same you used when asked for URL in the Yeoman generator. In your case https://conversationalbot.azurewebsites.net.
4. Add the following keys in the *Configuration* -> *Application Settings*; Name = `WEBSITE_NODE_DEFAULT_VERSION`, Value = `8.10.0` and Name = `SCM_COMMAND_IDLE_TIMEOUT`,  Value = `1800`. Click Save.
5. Go to *Deployment Center*
6. Choose *Local Git* as source and *App Service build service* as the Build Provider 
7. Click on *Deployment Credentials* and store the App Credentials securely
8. In your tab folder initialize a Git repository using `git init`
9. Build the solution using `gulp build` to make sure you don't have any errors
10. Commit all your files using `git add -A && git commit -m "Initial commit"`
11. Run the following command to set up the remote repository: `git remote add azure https://<username>@conversationalbot.scm.azurewebsites.net:443/conversationalbot.git`. You need to replace <username> with the username of the App Credentials you retrieved in _Deployment Credentials_. You can also copy the URL from *Options* in the Azure Web App.
12. To push your code use to Azure use the following command: `git push azure master`, you will be asked for your credentials the first time, insert the Password for the App Credential. Note that you should update the Azure Web Site application setting before pushing the code as the settings are needed when building the application.
13. Wait until the deployment is completed and navigate to https://conversationalbot.azurewebsites.net/privacy.html to test that the web application is running
14. Done
15. Repeat step 11 for every commit you do and want to deploy

> NOTE: The `.env` file is excluded from source control and will not be pushed to the web site so you need to ensure that all the settings present in the `.env` file are added as application settings to your Azure Web site (except the `PORT` variable which is used for local debugging).

## Logging

To enable logging for the solution you need to add `msteams` to the `DEBUG` environment variable. See the [debug package](https://www.npmjs.com/package/debug) for more information. By default this setting is turned on in the `.env` file.

Example for Windows command line:

``` bash
SET DEBUG=msteams
```

If you are using Microsoft Azure to host your Microsoft Teams app, then you can add `DEBUG` as an Application Setting with the value of `msteams`.