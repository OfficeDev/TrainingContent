Configuring your Office 365 Tenant
==================================

## Overview

The lab steps through the steps required to configure your Office 365 Tenant for authentication from your Android or iOS app.

## Objectives
- Connect your Office 365 directory to your Azure subscription
- Add an Application to your Office 365 Tenant's Active Directory to allow authentication from your Android or iOS app.

## Prerequisites

- [An Office 365 tenancy][sign-up-for-o365]
- [An Azure subscription][azure-management-portal]

[sign-up-for-o365]: http://office.microsoft.com/en-nz/business/office-365-enterprise-e3-business-software-FX103030346.aspx
[azure-management-portal]: https://manage.windowsazure.com/

## Tasks

The hands-on lab includes the following exercises:

- [**Task 1:**](#task1) Connect your Office 365 directory to your Azure subscription

- [**Task 2:**](#task2) Create a new Application in your Office 365 directory for your Android or iOS app


<a name="task1"></a>
## Task 1: Connect your Office 365 directory to your Azure subscription

Here we will associate your Azure account with your Office 365 tenant as a global administrator.
This gives you the ability to manage the Office 365 directory using the Azure portal.

01. Sign into the [Azure Portal](https://manage.windowsazure.com/)

02. Click **+ New**

    ![Screenshot of the previous step](img/0001_azure_portal_new_button.png)

03. Select **App Services > Active Directory > Directory > Custom Create**

    ![Screenshot of the previous step](img/0005_custom_create_active_directory.png)

04. Enter **NAME**, **DOMAIN NAME**, and select a **COUNTRY OR REGION**. Click **Checker** button

    ![Screenshot of the previous step](img/00010_create_directory.png)

05. Once done, the domain you just created will be listed in **Directory** tab

    ![Screenshot of the previous step](img/00015_directory_list.png)

You have successfully associated your Azure account with your Office 365 tenant as a global administrator.
This gives you the ability to manage the Office 365 directory using the Azure portal.

<a name="task2"></a>
## Task 2: Create a new Application in your Office 365 directory for your Android or iOS app

Here we will create an Application in your Office 365 directory to allow your Android or iOS app to authenticate and interact with the Office 365 Exchange and SharePoint APIs

01. When you're signed back in, navigate to your Office 365 directory in the Active Directory extension.

    ![Screenshot of the previous step](img/00030_navigate_to_active_directory.png)

02. And then navigate to the **Applications** tab.

    ![Screenshot of the previous step](img/00035_navigate_to_applications_tab.png)

03. Select **Add** from the action bar to add a new Application.
    
    ![Screenshot of the previous step](img/00040_add_new_application.png)

04. Select **Add an application from my Organization**. Click **Next**.
    
    ![Screenshot of the previous step](img/00045_add_application_by_my_org.png)

05. Enter a name for the application, and select **Native Client Application**. Click **Next**.

    ![Screenshot of the previous step](img/00050_add_native_application.png)

06. Enter the following redirect URI for the application:

        http://example.com/redirect

    > **NOTE:** this url does not need to resolve to anything, but we will later configure our mobile app with this same url.

    ![Screenshot of the previous step](img/00055_add_redirect_uri.png)

07. Click **Complete**(Check icon button).

08. The application is created. Navigate to the **Configure** tab.

    ![Screenshot of the previous step](img/00060_navigate_to_configure_tab.png)

09. And copy down the **Client Id**.

    ![Screenshot of the previous step](img/00065_copy_down_client_id.png)

10. Scroll down to the **permissions to other applications** section. 

11. Click the **Add Application** button.

12. In the **Permissions to other applications** dialog, click the **PLUS** icon next to the **Microsoft Graph** option.

13. Click the **CHECK** icon in the lower left corner.
 
14. For the new **Microsoft Graph** application permission entry, select the **Delegated Permissions** dropdown on the same line and then select the following permissions:
    * Have full access to all files user can access
	* Have full access to user contacts
	* Have full access to user calendars
	* Send mail as a user
	* Read and write access to user mail
    
    ![Screenshot of the previous step](img/00070_configure_exchange_permissions.png)

12. Again from the Select application dropdown, add **Office 365 SharePoint Online**.

13. From **Delegated Permissions** select the following:

    * Read and write items and lists in all site collections

    This configures your app to have delegated permission to access user data in SharePoint.

    ![Screenshot of the previous step](img/00075_configure_sharepoint_permissions.png)

14. Click **Save** to save the changes.

    ![Screenshot of the previous step](img/00080_save_the_changes.png)

You have successfully created an Application in your Office 365 directory to allow your Android or iOS app to authenticate and interact with the Microsoft Graph and SharePoint APIs
