# teams app1

Generate a Microsoft Teams application.

TODO: Add your documentation here

## Getting started with Microsoft Teams Apps development

Head on over to [official documentation](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/tabs/tabs-overview) to learn how to build Microsoft Teams Tabs.

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
## Working with the devPreview manifest version

You can change the manifest version from the standard `1.3` to `devPreview` by editing the `manifest.json` file and the `manifestVersion` property. The schema validation currently supports `1.3` and `devPreview`, for other options you need to manually edit the `gulpfile.js` file and add the version and schema in the `SCHEMAS` constant. When validating the manifest you will get an error if any other versions are used and you will also get a warning if you have not manually updated the schema reference in the `manifest.json` file (which is recommended for in-editor schema validation).

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

In order to make development locally a great experience it is recommended to use [ngrok](https://ngrok.io), which allows you to publish the localhost on a public DNS, so that you can consume the bot and the other resources in Microsoft Teams. Start ngrok locally and either specify a reserved hostname or use a dynamic generated one. Modify the `HOSTNAME` property of the `.env` file with the public hostname you have in ngrok, rebuild the manifest and upload it to Microsoft Teams and start `gulp serve`.

## Output

* dist/* - the files required to host the solution
* package/* - the Teams extensibility package (zip file) to be uploaded to Microsoft Teams ([how-to](https://msdn.microsoft.com/en-us/microsoft-teams/createpackage#uploading-your-tab-package-to-microsoft-teams))
* temp - used for temporary processing of files during build time

## Deploying to Azure using Git

If you want to deploy to Azure using Git follow these steps.

This will automatically deploy your files to Azure, download the npm pacakges, build the solution and start the web server using Express.

1. Log into [the Azure Portal](https://portal.azure.com)
2. Create a new *Resource Group* or use an existing one
3. Create a new *Web App* with Windows App Service Plan and give it the name of your tab, the same you used when asked for URL in the Yeoman generator. In your case https://tbd.ngrok.io.
4. Add the following keys in the *Configuration* -> *Application Settings*; Name = `WEBSITE_NODE_DEFAULT_VERSION`, Value = `8.10.0` and Name = `SCM_COMMAND_IDLE_TIMEOUT`,  Value = `1800`. Click Save.
5. Go to *Deployment Center*
6. Choose *Local Git* as source and *App Service build service* as the Build Provider 
7. Click on *Deployment Credentials* and store the App Credentials securely
8. In your tab folder initialize a Git repository using `git init`
9. Build the solution using `gulp build` to make sure you don't have any errors
10. Commit all your files using `git add -A && git commit -m "Initial commit"`
11. Run the following command to set up the remote repository: `git remote add azure https://<username>@[your Azure web app name].scm.azurewebsites.net:443/[your Azure web app name].git`. You need to replace <username> with the username of the App Credentials you retrieved in _Deployment Credentials_. You can also copy the URL from *Options* in the Azure Web App.
12. To push your code use to Azure use the following command: `git push azure master`, you will be asked for your credentials the first time, insert the Password for the App Credential. Note that you should update the Azure Web Site application setting before pushing the code as the settings are needed when building the application.
13. Wait until the deployment is completed and navigate to https://tbd.ngrok.io/privacy.html to test that the web application is running
14. Done
15. Repeat step 11 for every commit you do and want to deploy

> NOTE: The `.env` file is excluded from source control and will not be pushed to the web site so you need to ensure that all the settings present in the `.env` file are added as application settings to your Azure Web site (except the `PORT` variable which is used for local debugging).

## Logging

To enable logging for the solution you need to add `msteams` to the `DEBUG` environment variable. See the [debug package](https://www.npmjs.com/package/debug) for more information.

Example for Windows command line:

> SET DEBUG=msteams

If you are using Microsoft Azure to host your Microsoft Teams app, then you can add `DEBUG` as an Application Setting with the value of `msteams`.