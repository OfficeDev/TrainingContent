# teams app1

Generate a Microsoft Teams application.

TODO: Add your documentation here

## Getting started with Microsoft Teams Apps development

Head on over to [official documentation](https://msdn.microsoft.com/en-us/microsoft-teams/tabs) to learn how to build Microsoft Teams Tabs.

## Building the app

``` bash
npm i -g gulp gulp-cli
gulp build
```

## Building the manifest

``` bash
gulp manifest
```

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

## Output

* dist/* - the files required to host the solution
* package/* - the Teams extensibility package (zip file) to be uploaded to Microsoft Teams ([how-to](https://msdn.microsoft.com/en-us/microsoft-teams/createpackage#uploading-your-tab-package-to-microsoft-teams))

## Deploying to Azure using Git

If you want to deploy to Azure using Git follow these steps.

This will automatically deploy your files to Azure, download the npm pacakges, build the solution and start the web server using Express.

1. Log into [the Azure Portal](https://portal.azure.com)
2. Create a new *Resource Group* or use an existing one
3. Create a new *Web App* and give it the name of your tab, the same you used when asked for URL in the Yeoman generator. In your case https://tbd.ngrok.io.
4. Go to the created Web App and configure *Deployment Credentials*. Not that this is only done once per Microsoft Azure Account.
5. Go to *Deployment Options*
6. Choose *Local Git Repository* as source and click *OK*
7. In your tab folder initialize a Git repository using `git init`
8. Build the solution using `gulp build` to make sure you don't have any errors
9. Commit all your files using `git add -A && git commit -m "Initial commit"`
10. Run the following command to set up the remote repository: `git remote add azure https://<username>@[your Azure web app name].scm.azurewebsites.net:443/[your Azure web app name].git`. You need to replace <username> with the name of the user you set up in _Deployment Credentials_. You can also copy the URL from *Options* in the Azure Web App.
11. To push your code use to Azure use the following command: `git push azure master`, you will be asked for your credentials the first time
12. Wait until the deployment is completed and navigate to https://tbd.ngrok.io/privacy.html to test that the web application is running
13. Done
14. Repeat step 11 for every commit you do and want to deploy

## Logging

To enable logging for the solution you need to add `msteams` to the `DEBUG` environment variable. See the [debug package](https://www.npmjs.com/package/debug) for more information.

Example for Windows command line:

> SET DEBUG=msteams

If you are using Microsoft Azure to host your Microsoft Teams app, then you can add `DEBUG` as an Application Setting with the value of `msteams`.