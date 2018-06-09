# Office Add-ins: Building Office Add-ins for Word

In this demo, you will demonstrate how a Word Add-in can interact with rich content such as images, HTML and tables.

## Running the project

The finished solution is provided in this folder to simplify demonstrations. If you want to run a finished project, clone the repository, run **npm install** (from the solution folder directory), then **npm run start** and follow one of these methods to sideload and test the Office Add-in.

* Windows: [Sideload Office Add-ins on Windows](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/create-a-network-shared-folder-catalog-for-task-pane-and-content-add-ins)
* Word Online: [Sideload Office Add-ins in Office Online](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-office-add-ins-for-testing#sideload-an-office-add-in-on-office-online)
* iPad and Mac: [Sideload Office Add-ins on iPad and Mac](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-an-office-add-in-on-ipad-and-mac)

## Demo steps

1. Select the **Insert Image** button and note that an image is inserted at the end of the document.

1. Select the **Insert HTML** button and note that two paragraphs are inserted at the end of the document, and that the first one has Verdana font.

1. Select the **Insert Table** button and note that a table is inserted after the second paragraph.