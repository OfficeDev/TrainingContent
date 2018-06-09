# Office Add-ins: Building Office Add-ins for Word

In this demo, you will demonstrate how a Word Add-in can work with RichText content controls.

## Running the project

The finished solution is provided in this folder to simplify demonstrations. If you want to run a finished project, clone the repository, run **npm install** (from the solution folder directory), then **npm run start** and follow one of these methods to sideload and test the Office Add-in.

* Windows: [Sideload Office Add-ins on Windows](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/create-a-network-shared-folder-catalog-for-task-pane-and-content-add-ins)
* Word Online: [Sideload Office Add-ins in Office Online](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-office-add-ins-for-testing#sideload-an-office-add-in-on-office-online)
* iPad and Mac: [Sideload Office Add-ins on iPad and Mac](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-an-office-add-in-on-ipad-and-mac)

## Demo steps

1. Select the phrase "Office 365" in one of the paragraphs, and then choose the **Create Content Control** button. Note that the phrase is wrapped in tags labelled "Service Name".

1. Select the **Rename Service** button and note that the text of the content control changes to "Fabrikam Online Productivity Suite".