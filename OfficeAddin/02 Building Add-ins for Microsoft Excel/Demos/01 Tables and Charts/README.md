# Office Add-ins: Building Office Add-ins for Excel

In this demo, you will demonstrate how an Excel Add-in can interact with tables and charts in a workbook.

## Running the project

The finished solution is provided in this folder to simplify demonstrations. If you want to run a finished project, clone the repository, run **npm install** (from the solution folder directory), then **npm run start** and follow one of these methods to sideload and test the Office Add-in.

* Windows: [Sideload Office Add-ins on Windows](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/create-a-network-shared-folder-catalog-for-task-pane-and-content-add-ins)
* Word Online: [Sideload Office Add-ins in Office Online](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-office-add-ins-for-testing#sideload-an-office-add-in-on-office-online)
* iPad and Mac: [Sideload Office Add-ins on iPad and Mac](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-an-office-add-in-on-ipad-and-mac)

## Demo steps

1. On the **Home** menu, select **Show Taskpane**.

1. In the taskpane, select **Create Table**.

1. Select the **Filter Table** and **Sort Table** buttons, in either order.

1. Select the **Create Chart** button. A chart is created and only the data from the rows that have been filtered are included. The labels on the data points across the bottom are in the sort order of the chart; that is, merchant names in reverse alphabetical order.

1. Select the **Freeze Header** button.