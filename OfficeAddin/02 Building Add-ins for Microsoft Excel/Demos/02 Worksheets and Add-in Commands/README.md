# Office Add-ins: Building Office Add-ins for Excel

In this demo, you will demonstrate how an Excel Add-in can integrate more deeply with the ribbon via add-in commands and perform advanced worksheet operations such as protection.

## Running the project

The finished solution is provided in this folder to simplify demonstrations. If you want to run a finished project, clone the repository, run **npm install** (from the solution folder directory), then **npm run start** and follow one of these methods to sideload and test the Office Add-in.

* Windows: [Sideload Office Add-ins on Windows](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/create-a-network-shared-folder-catalog-for-task-pane-and-content-add-ins)
* Word Online: [Sideload Office Add-ins in Office Online](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-office-add-ins-for-testing#sideload-an-office-add-in-on-office-online)
* iPad and Mac: [Sideload Office Add-ins on iPad and Mac](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-an-office-add-in-on-ipad-and-mac)

## Demo steps

1. On the **Home** ribbon, select **Toggle Worksheet Protection**. Note that most of the controls on the ribbon are disabled (and visually grayed-out) as seen in screenshot below.

1. Select a cell as you would if you wanted to change its content. You get an error telling you that the worksheet is protected.

1. Select **Toggle Worksheet Protection** again, and the controls are re-enabled, and you can change cell values again.