# Office Add-ins: Building Office Add-ins for Excel

This lab will walk through the development of an Office Add-in for Microsoft Excel using a number of office.js capabilities such as working with ranges, tables, charts, add-in commands, dialogs, and more. This lab uses the [Excel Add-in tutorial](https://docs.microsoft.com/en-us/office/dev/add-ins/tutorials/excel-tutorial).

## Table of Contents

1. [Create your Add-in project](https://docs.microsoft.com/en-us/office/dev/add-ins/tutorials/excel-tutorial?tutorial-step=1)
1. [Create a table](https://docs.microsoft.com/en-us/office/dev/add-ins/tutorials/excel-tutorial?tutorial-step=2)
1. [Filter and sort a table](https://docs.microsoft.com/en-us/office/dev/add-ins/tutorials/excel-tutorial?tutorial-step=3)
1. [Create a chart](https://docs.microsoft.com/en-us/office/dev/add-ins/tutorials/excel-tutorial?tutorial-step=4)
1. [Freeze a table header](https://docs.microsoft.com/en-us/office/dev/add-ins/tutorials/excel-tutorial?tutorial-step=5)
1. [Protect a worksheet](https://docs.microsoft.com/en-us/office/dev/add-ins/tutorials/excel-tutorial?tutorial-step=6)
1. [Open a dialog](https://docs.microsoft.com/en-us/office/dev/add-ins/tutorials/excel-tutorial?tutorial-step=6)

## Prerequisites

To complete this lab, you need to have the following installed.

* Excel 2016, version 1711 (Build 8730.1000 Click-to-Run) or later. You might need to be an Office Insider to get this version. For more information, see [Be an Office Insider](https://products.office.com/en-us/office-insider?tab=tab-1).
* [Node and npm](https://nodejs.org/en/)
* [Git Bash](https://git-scm.com/downloads) (or another Git client)

## Completed Exercises

Finished solutions are provided in the [Excel Add-in tutorial repo](https://github.com/OfficeDev/Excel-Add-in-Tutorial) and the [Demos](./Demos) folder if you get stuck. If you want to run any of the finished solutions, clone the repository, run **npm install** (from the directory of the finished solution), then **npm run start** and follow one of these methods to sideload and test the Office Add-in.

* Windows: [Sideload Office Add-ins on Windows](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/create-a-network-shared-folder-catalog-for-task-pane-and-content-add-ins)
* Word Online: [Sideload Office Add-ins in Office Online](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-office-add-ins-for-testing#sideload-an-office-add-in-on-office-online)
* iPad and Mac: [Sideload Office Add-ins on iPad and Mac](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-an-office-add-in-on-ipad-and-mac)