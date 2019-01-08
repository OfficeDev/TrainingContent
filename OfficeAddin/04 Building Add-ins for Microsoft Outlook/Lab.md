# Office Add-ins: Building Add-ins for Microsoft Outlook - 100 Level

This lab will walk through the development of a message compose add-in for Microsoft Outlook using a number of developer capabilities such as ribbon commands, dialogs, function files, crafting email messages, and more. This lab uses the [Build a message compose Outlook add-in tutorial](https://docs.microsoft.com/en-us/outlook/add-ins/addin-tutorial).

## In this lab

1. [Create an Outlook add-in project](https://docs.microsoft.com/en-us/outlook/add-ins/addin-tutorial#create-an-outlook-add-in-project)
1. [Define ribbon commands](https://docs.microsoft.com/en-us/outlook/add-ins/addin-tutorial#define-buttons)
1. [Implement first run experience](https://docs.microsoft.com/en-us/outlook/add-ins/addin-tutorial#implement-a-first-run-experience)
1. [Implement UI-less button](https://docs.microsoft.com/en-us/outlook/add-ins/addin-tutorial#implement-a-ui-less-button)
1. [Implement task pane](https://docs.microsoft.com/en-us/outlook/add-ins/addin-tutorial#implement-a-task-pane)

## Prerequisites

To complete this lab, you need to have the following installed/configured.

* [Node.js and npm](https://nodejs.org/en/)
* The latest version of Yeoman and the Yeoman generator for Office Add-ins. To install these tools globally, run the following command from the command prompt:

    ```
    npm install -g yo generator-office
    ```

* Outlook 2016 or later for Windows (connected to an Office 365 account) or Outlook on the web
* A [GitHub](https://www.github.com/) account

## Completed Exercises

Finished solutions are provided in the [Demos](./Demos) folder if you get stuck. If you want to run any of the finished solutions, clone the repository, run **npm install** (from the directory of the finished solution), then **npm run start** and follow the instructions to [Sideload Office add-ins for testing](https://docs.microsoft.com/en-us/outlook/add-ins/sideload-outlook-add-ins-for-testing).