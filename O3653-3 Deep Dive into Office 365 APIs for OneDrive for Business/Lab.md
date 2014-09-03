# Office 365 APIs for OneDrive for Business
In this lab, you will use the Office 365 APIs for OneDrive for Business as part of an ASP.NET MVC5 application.

## Prerequisites
1. You must have an Office 365 tenant and Windows Azure subscription to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
2. You must have the Office 365 API Tools version 1.1.728 installed in Visual Studio 2013.

## Exercise 1: Create an ASP.NET MVC5 Application
In this exercise, you will create the ASP.NET MVC5 application and register it with Azure active Directory.

1. Create the new solution in Visual Studio 2013:
  1. Launch **Visual Studio 2013** as administrator. 
  2. In Visual Studio select **File/New/Project**.
  3. In the **New Project** dialog:
    1. Select **Templates/Visual C#/Web**.
    2. Click **ASP.NET Web Application**.
    3. Name the new project **OneDriveWeb**.
    4. Click **OK**.<br/>
       ![](Images/01.png?raw=true "Figure 1")
  4. In the **New ASP.NET Project** dialog:
    1. Click **MVC**.
    2. Click **Change Authentication**.
    3. Select **No Authentication**.
    4. Click **OK**.<br/>
       ![](Images/02.png?raw=true "Figure 2")
    5. Click **OK**.<br/>
       ![](Images/03.png?raw=true "Figure 3")
2. Connect the OneDrive for Business service:
  1. In the **Solution Explorer**, right click the **OneDriveWeb** project and select **Add/Connected Service**.
  2. In the **Services Manager** dialog:
    1. Click **Register Your App**.
    2. When prompted, login with your **Organizational Account**.
    3. Click **My Files**.
    4. Click **Permissions**.
    5. Check **Edit or Delete User's Files**.
    6. Check **Read User's Files**.
    7. Click **Apply**.<br/>
       ![](Images/04.png?raw=true "Figure 4")
    8. Click **Sites**.
    9. Click **Permissions**.
    10. Check **Create or Delete items and lists in all site collections**.
    11. Check **Edit or Delete items in all site collections**.
    12. Check **Read items in all site collections**.
    13. Click **Apply**.<br/>
       ![](Images/05.png?raw=true "Figure 5")
    14. Click **OK**.<br/>
       ![](Images/06.png?raw=true "Figure 6")



Congratulations! You have completed implementing Continuous Integration.



