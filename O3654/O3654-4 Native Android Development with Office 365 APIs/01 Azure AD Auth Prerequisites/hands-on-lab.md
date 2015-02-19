Configuring your O365 Tenant
============================

##Overview

The lab steps through the steps required to configure your O365 Tenant for authentication from your Android or iOS app.


##Objectives

- TODO: Create an O365 Tenant?
- Connect your O365 directory to your Azure subscription
- Add an Application to your O365 Tenant's Active Directory to allow authentcation from your Android or iOS app.


##Prerequisites

- [An O365 tenancy][sign-up-for-o365]
- [An Azure subscription][azure-management-portal]

[sign-up-for-o365]: http://office.microsoft.com/en-nz/business/office-365-enterprise-e3-business-software-FX103030346.aspx
[azure-management-portal]: https://manage.windowsazure.com/

##Tasks

The hands-on lab includes the following exercises:

- [**Task 1:**](#task1) Connect your O365 directory to your Azure subscription

- [**Task 2:**](#task2) Create a new Application in your O365 directory for your Android or iOS app


<a name="task1"></a>
##Task 1: Connect your O365 directory to your Azure subscription


Here we will associate your Azure account with your O365 tenant as a global administrator.
This gives you the ability to manage the O365 directory using the Azure portal.


01. Sign into the [Azure Portal](https://manage.windowsazure.com/)

02. Click **+ New**

    ![](img/0001_azure_portal_new_button.png)

03. Select **App Services > Active Directory > Directory > Custom Create**

    ![](img/0005_custom_create_active_directory.png)

04. Select **Use existing directory**, and then **I am ready to be signed out now**

    ![](img/00010_use_existing_directory.png)

05. You will be signed out of the portal and redirected to a sign-in page. Sign in using the credentials for a global
    administrator in your O365 tenant.

    ![](img/00015_sign_in_as_directory_global_admin.png)

06. When authenticated click **continue**. This will add your Azure account as a global administrator of the O365
    directory.

    ![](img/00020_accept_confirmation_dialog.png)

07. Click **Sign out now** and when prompted sign back into your Azure account.

    ![](img/00025_sign_out_and_sign_back_in.png)


You have successfully associated your Azure account with your O365 tenant as a global administrator.
This gives you the ability to manage the O365 directory using the Azure portal.


<a name="task2"></a>
##Task 2: Create a new Application in your O365 directory for your Android or iOS app


Here we will create an Application in your O365 directory to allow your Android or iOS app to authenticate
and interact with the O365 Exchange and SharePoint APIs


01. When you're signed back in, navigate to your O365 directory in the Active Directory extension.

    ![](img/00030_navigate_to_active_directory.png)

02. And then navigate to the **Applications** tab.

    ![](img/00035_navigate_to_applications_tab.png)

03. Select **Add** from the action bar to add a new Application.
    
    ![](img/00040_add_new_application.png)

04. Select **Add an application from my Organization**. Click **Next**.
    
    ![](img/00045_add_application_by_my_org.png)

05. Enter a name for the application, and select **Native Client Application**. Click **Next**.

    ![](img/00050_add_native_application.png)

06. Enter the following redirect URI for the application:

        http://example.com/redirect

    **NOTE:** this url does not need to resolve to anything, but we will later configure our mobile app with 
    this same url.

    ![](img/00055_add_redirect_uri.png)

07. Click **Next**.

08. The application is created. Navigate to the **Configure** tab.

    ![](img/00060_navigate_to_configure_tab.png)

09. And copy down the **Client Id**.

    ![](img/00065_copy_down_client_id.png)

10. Finally, scroll to the bottom of the screen. In the **Permissions to other applications**
    section, select **Office 365 Exchange Online** from the Select application
    dropdown.

11. From **Delegated Permissions** select the following:

    * Read and write access to users' mail
    * Send mail as user
    * Have full access to users' calendars
    * Have full access to users' contacts

    This configures your app to have delegated permission to access user data in
    Exchange.

    > Note: **do not** select "Have full access to a users' mailbox". This is
    > meant for access to a user's mailbox using an older API called Exchange
    > Web Services. If you select it, requests made to the Exchange REST API 
    > may be rejected as unauthorized.

    ![](img/00070_configure_exchange_permissions.png)

12. Again from the Select application dropdown, select **Office 365 SharePoint Online**.

13. From **Delegated Permissions** select the following:

    * Edit or delete user's files
    * Read user's files
    * Create or delete items and lists in all site collections
    * Edit or delete items in all site collections
    * Read items in all site collections

    This configures your app to have delegated permission to access user data in SharePoint.

    ![](img/00075_configure_sharepoint_permissions.png)

14. Click **Save** to save the changes.

    ![](img/00080_save_the_changes.png)


You have successfully created an Application in your O365 directory to allow your Android or iOS app to authenticate
and interact with the O365 Exchange and SharePoint APIs
