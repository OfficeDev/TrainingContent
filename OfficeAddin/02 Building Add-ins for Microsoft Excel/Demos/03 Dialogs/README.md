# Office Add-ins: Building Office Add-ins for Excel

In this demo, you will demonstrate how an Excel Add-in can use the Dialog API to provide new user experiences in an Add-in.

## Running the project

The finished solution is provided in this folder to simplify demonstrations. If you want to run a finished project, clone the repository, run **npm install** (from the solution folder directory), then **npm run start** and follow one of these methods to sideload and test the Office Add-in.

* Windows: [Sideload Office Add-ins on Windows](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/create-a-network-shared-folder-catalog-for-task-pane-and-content-add-ins)
* Word Online: [Sideload Office Add-ins in Office Online](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-office-add-ins-for-testing#sideload-an-office-add-in-on-office-online)
* iPad and Mac: [Sideload Office Add-ins on iPad and Mac](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-an-office-add-in-on-ipad-and-mac)

## Demo steps

1. Reload the task pane by closing it, and then on the **Home** menu, select **Show Taskpane** to reopen the add-in.

1. Select the **Open Dialog** button in the task pane.

1. While the dialog is open, drag it and resize it. Note that you can interact with the worksheet and press other buttons on the taskpane. But you cannot launch a second dialog from the same task pane page.

1. In the dialog, enter a name and select **OK**. The name appears on the task pane and the dialog closes.