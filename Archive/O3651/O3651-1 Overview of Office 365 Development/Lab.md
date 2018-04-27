# Overview of Office 365 Development
In this lab, you will work with existing Office 365 Add-ins.

## Prerequisites
1. You must have an Office 365 tenant to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
2. You must have Word and Excel 2013 available to complete this lab.
3. You must have a Microsoft account to complete this lab. If you do not have one, [sign up](https://signup.live.com/signup.aspx?lic=1).

## Exercise 1: Get to know the Microsoft Graph and the Microsoft Graph Explorer
In this exercise you will get user profile, Office 365 Group and OneDrive information by using the Microsoft Graph and the Microsoft Graph Explorer

1. Get my profile by using the Microsoft Graph.
  1. Navigate to the [Graph Explorer](http://graphexplorer2.azurewebsites.net/).
  2. Log in with your Microsoft account.
  3. Select **GET** and input this URL https://graph.microsoft.com/v1.0/me
  4. Press **Enter** to get the current user's profile information.

     ![Screenshot of Graph Explorer](Images/graph01.png)

2. Get Office 365 Groups by using the Microsoft Graph
  1. Navigate to the [Office 365 login page](https://login.microsoftonline.com).
  2. Sign in with your Microsoft account     
  3. Click **People**

     ![Screenshot of Office 365 Portal](Images/graph02.png)

  4. Click **Create** in the Groups section.   
  
     ![Screenshot of creating a group](Images/graph03.png)

  5. Input a new Office 365 Group name and click **Create**
  
     ![Screenshot of creating a group](Images/graph04.png)

  6. Navigate to the [Graph Explorer](http://graphexplorer2.azurewebsites.net/)
  7. Log in with your Microsoft account.   
  8. Select **GET** and input this URL https://graph.microsoft.com/v1.0/groups
  9. Press **Enter** to get all of the Office 365 Groups.  Locate the Office 365 Group you just created in the list.

     ![Screenshot of creating a group](Images/graph05.png)

3. Get files from OneDrive by using the Microsoft Graph
  1. Navigate to the [Office 365 login page](https://login.microsoftonline.com)    
  2. Sign in with your Microsoft Account.
  3. Click **OneDrive**
     
	![Screenshot of OneDrive](Images/graph06.png)

  4. Click **Upload** -> **Files** in the ribbon. Choose a local file and click **Open** to upload a file into OneDrive.
     
	![Screenshot of OneDrive](Images/graph07.png)

  5. Navigate to the [Graph Explorer](http://graphexplorer2.azurewebsites.net/).
  6. Log in with your Microsoft account.
  7. Select **GET** and input this URL https://graph.microsoft.com/v1.0/me/drive/root/children
  8. Press **Enter** to get a list of all of the files in OneDrive.  Notice the new file you uploaded is in the list.

     ![Screenshot of Graph Explorer](Images/graph08.png)

## Exercise 2: Add-ins for SharePoint 
In this exercise you will download, install and investigate an existing Add-in for SharePoint.

1. Log into your Office 365 tenant.
  1. Navigate to any site for which you are an administrator.
2. Install an existing Add-in for SharePoint
  1. Click **Site Contents**.
  2. Click **Add an App**<br/>
     ![Screenshot for Add-in for SharePoint](Images/01.png "Figure 1")
  3. Click **SharePoint Store**
  4. Search the SharePoint Store for **World Clock and Weather**<br/>
     ![Screenshot for Add-in for SharePoint](Images/02.png "Figure 2")
  5. Click the **World Clock and Weather**
  6. Click **Add it**<br/>
     ![Screenshot for Add-in for SharePoint](Images/03.png "Figure 3")
  7. When prompted, click **Continue**.<br/>
     ![Screenshot for Add-in for SharePoint](Images/04.png "Figure 4")
  8. Click **Return to site**.<br/>
     ![Screenshot for Add-in for SharePoint](Images/26.png "Figure 26")


  9. Click **Trust It**.<br/>
     ![Screenshot for Add-in for SharePoint](Images/27.png "Figure 27")

3. Use the new Add-in
  1. Launch the **World Clock and Weather** Add-in.<br/>
     ![Screenshot for Add-in for SharePoint](Images/05.png "Figure 5")
  2. Note that the Add-in launches into a full-screen experience.
  3. Note that the Add-in also provides a link to return to the SharePoint host web.<br/>
     ![Screenshot for Add-in for SharePoint](Images/06.png "Figure 6")
  4. Navigate the Add-in to review its content.
  5. Click **Your Site Name** to return to the host web.

## Exercise 3: Add-in for Office (Word)
In this exercise, you will download, install and investigate an Office Add-in  hosted by Word.

1. Install an existing Add-in for Office
  1. Launch **Word 2013**.
  2. When Word 2013 starts, click **Blank Document**.<br/>
     ![Screenshot of Word Add-in](Images/07.png "Figure 7")
  3. Click the **Insert** tab.
  4. In the **Add-Ins** group, click **Store**.<br/>
     ![Screenshot of Word Add-in](Images/08.png "Figure 8")
  5. In the store, search for **Wikipedia**.
  6. Select the App title **Wikipedia**.<br/>
     ![Screenshot of Word Add-in](Images/09.png "Figure 9")
  7. When prompted, click **Trust It**.<br/>
     ![Screenshot of Word Add-in](Images/10.png "Figure 10")
2. Use the new Add-in
  1. In the Wikipedia task pane, search for **Azure**.
  2. Click **EXPAND ARTICLE**.<br/>
     ![Screenshot of Word Add-in](Images/28.png "Figure 28")
  2. Click **Microsoft Azure**.<br/>
     ![Screenshot of Word Add-in](Images/11.png "Figure 11")
  3. Click **Sections**.
  5. Click **History**.<br/>
     ![Screenshot of Word Add-in](Images/12.png "Figure 12")
  5. Highlight the first few paragraphs.
  6. Click the **Plus** symbol (+) to insert the text.<br/>
     ![Screenshot of Word Add-in](Images/13.png "Figure 13")
3. Close Word 2013.

## Exercise 4: Add-in for Office (Excel)
In this exercise, you will download, install and investigate an Office Add-in hosted by Excel.

1. Sign up to access sample data.
  1. Navigate to the [Azure Data Market](https://datamarket.azure.com/home).
  2. Sign in with your Microsoft account.
  3. Search for **crime**.
  4. Click **2006-2008 Crime in the United States**<br/>
     ![Screenshot of Excel Add-in](Images/18.png "Figure 18")
  5. Click **Sign Up**<br/>
     ![[Screenshot of Excel Add-in](Images/19.png "Figure 19")
  6. When complete, click **Explore this Dataset**.<br/>
     ![Screenshot of Excel Add-in](Images/20.png "Figure 20")
  7. Click **Show** to display the **Primary Account Key**<br/>
     ![Screenshot of Excel Add-in](Images/21.png "Figure 21")
2. Import data into the Excel spreadsheet
  1. In Excel 2013, click the **Data** tab.
  2. In the **Get External Data** group, click **From Web**.<br/>
     ![Screenshot of Excel Add-in](Images/22.png "Figure 22")
  3. Enter the following URL  and click **GO**. When prompted for a user name and password, use your **Primary Account Key** for both.
     ```
     https://api.datamarket.azure.com/data.gov/Crimes/v1/CityCrime
     ```
  4. Click **Import**. When prompted for a user name and password, use your **Primary Account Key** for both.
  5. In the spreadsheet, locate the data for **Alaska**.
  6. Hide the columns so that **State**, **City**, and **Viloent Crime** columns are next to each other . <br/>
     ![Screenshot of Excel Add-in](Images/23.png "Figure 23")
3. Install an existing Office Add-in
  1. Click the **Insert** tab.
  2. In the **Add-Ins** group, click **Store**.<br/>
     ![Screenshot of Excel Add-in](Images/08.png "Figure 15")
  3. In the store, search for **Modern Trend**.
  4. Select the App title **Modern Trend**.<br/>
     ![Screenshot of Excel Add-in](Images/16.png "Figure 16")
  5. When prompted, click **Trust It**.<br/>
     ![Screenshot of Excel Add-in](Images/17.png "Figure 17")
4. Use the Office Add-in
  1. In the app, click **Select Your Data**. <br/>
     ![Screenshot of Excel Add-in](Images/24.png "Figure 24")
  2. Select the cities and crime statistices.<br/>
     ![Screenshot of Excel Add-in](Images/25.png "Figure 25")
  3. Click **Create**.

**Congratulations! You have completed investigating Add-ins for SharePoint and Office.**

