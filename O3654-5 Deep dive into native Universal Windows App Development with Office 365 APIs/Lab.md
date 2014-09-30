# Deep Dive into native Universal App Development with Office 365 APIs
In this lab, you will use the Office 365 APIs as part of a Windows Store Universal application. The starter project uses the sample data files that are part of the Hub App project. In this lab, you will extend the application to use the Office 365 API.

## Prerequisites
1. You must have an Office 365 tenant and Windows Azure subscription to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
2. You must have the Office 365 API Tools version 1.1.728 installed in Visual Studio 2013.

## Exercise 1: Configure the starter project and create data
In this exercise, you will configure the starter project to connect to your Office 365 tenant. You will also create data using the app for use in a later exercise.

1. Launch **Visual Studio 2013** as an administrator.
2. In Visual Studio, select **File/Open Project**.
3. In the **Open Project** dialog, select **HubApp2.sln** from the **Labs\Starter** folder.
4. Right-click on the **HubApp2.Windows** project and choose **Add.../Connected Service**.
	1. In the **Services Manager** dialog, select Office 365 in the left navigation, anc click **Register your app**.
	2. Sign in to your Office 365 tenant.
    3. Click **Calendar**.
    4. Click **Permissions**.
    5. Check **Read users' calendar**.
    6. Click **Apply**.<br/>
	7. Click **My Files**
	8. Click **Permissions**.
	9. Check **Read users' files**
	10. Click **Apply**.
    11. Click **OK**.<br/>

5. In **Solution Explorer**, delete the files **CalendarApiSample.cs** and **MyFilesApiSample.cs** from the **HubApp2.Windows** project. These files are added as part of the Connected Service, but are not necessary for this application.
6. In **Solution Explorer**, right-click on the **HubApp2.Shared** project and choose **Add/New Folder**. Name the folder **O365Helpers**.

add files to DataModel folder;
 O365DataGroup
 o365dataitem
 o365datasource

add o365helpers folder
  
change section page - load state method
					- item click
change item page - load state method