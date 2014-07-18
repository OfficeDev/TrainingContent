# Overview of Office 365 Development
In this lab, you will work with existing Office 365 apps.

## Prerequisites
1. You must have an Office 365 tenant to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
2. You must have Word and Excel 2013 available to complete this lab.
3. You must have a Microsoft account to complete this lab. If you do not have one, [sign up](https://signup.live.com/signup.aspx?lic=1).

## Exercise 1: Apps for SharePoint 
In this exercise you will download, install and investigate an existing App for SharePoint.

1. Log into your Office 365 tenant.
  1. Navigate to any site for which you are an administrator.
2. Install an existing App for SharePoint
  1. Click **Site Contents**.
  2. Click **Add an App**<br/>
     ![](Images/01.png?raw=true "Figure 1")
  3. Click **SharePoint Store**
  4. Search the SharePoint Store for **Discover SharePoint**<br/>
     ![](Images/02.png?raw=true "Figure 2")
  5. Click the **Discover SharePoint App**
  6. Click **Add it**<br/>
     ![](Images/03.png?raw=true "Figure 3")
  7. When prompted, click **Trust It**.<br/>
     ![](Images/04.png?raw=true "Figure 4")
3. Use the new App
  1. Launch the **Discover SharePoint** App.<br/>
     ![](Images/05.png?raw=true "Figure 5")
  2. Note that the app launches into a full-screen experience driven from http://www.discoversharepoint.com.
  3. Note that the app also provides a link to return to the SharePoint host web.<br/>
     ![](Images/06.png?raw=true "Figure 6")
  4. Navigate the app to review its content.
  5. Click **Back to Site** to return to the host web.

## Exercise 2: Apps for Office (Word)
In this exercise, you will download, install and investigate an App for Office hosted by Word.

1. Install an existing App for Office
  1. Launch **Word 2013**.
  2. When Word 2013 starts, click **Blank Document**.<br/>
     ![](Images/07.png?raw=true "Figure 7")
  3. Click the **Insert** tab.
  4. In the **Apps** group, click **Store**.<br/>
     ![](Images/08.png?raw=true "Figure 8")
  5. In the store, search for **Wikipedia**.
  6. Click **Add** next to the **Wikipedia** app.<br/>
     ![](Images/09.png?raw=true "Figure 9")
  7. When prompted, click **Trust It**.<br/>
     ![](Images/10.png?raw=true "Figure 10")
2. Use the new App
  1. In the Wikipedia task pane, search for **Azure**.
  2. Click **Microsoft Azure**.<br/>
     ![](Images/11.png?raw=true "Figure 11")
  3. Click **Sections**.
  4. Click **History**.<br/>
     ![](Images/12.png?raw=true "Figure 12")
  5. Highlight the first few paragraphs.
  6. Click the **Plus** symbol (+) to insert the text.<br/>
     ![](Images/13.png?raw=true "Figure 13")
3. Close Word 2013.

## Exercise 3: Apps for Office (Excel)
In this exercise, you will download, install and investigate an App for Office hosted by Excel.

1. Sign up to access sample data.
  1. Navigate to the [Azure Data Market](https://datamarket.azure.com).
  2. Sign in with your Microsoft account.
  3. Search for **crime**.
  4. Click **2006-2008 Crime in the United States**<br/>
     ![](Images/18.png?raw=true "Figure 18")
  5. Click **Sign Up**<br/>
     ![](Images/19.png?raw=true "Figure 19")
  6. When complete, click **Explore this Dataset**.<br/>
     ![](Images/20.png?raw=true "Figure 20")
  7. Click **Show** to display the **Primary Account Key**<br/>
     ![](Images/21.png?raw=true "Figure 21")
2. Import data into the Excel spreadsheet
  1. In Excel 2013, click the **Data** tab.
  2. In the **Get External Data** group, click **From Web**.<br/>
     ![](Images/22.png?raw=true "Figure 22")
  3. Enter the following URL  and click **GO**. When prompted for a user name and password, use your **Primary Account Key** for both.
     ```
     https://api.datamarket.azure.com/data.gov/Crimes/v1/CityCrime
     ```
  4. Click **Import**. When prompted for a user name and password, use your **Primary Account Key** for both.
  5. In the spreadsheet, locate the data for **Alaska**.
  6. Hide the columns so that **State**, **City**, and **Viloent Crime** columns are next to each other . <br/>
     ![](Images/23.png?raw=true "Figure 23")
3. Install an existing App for Office
  1. Launch **Excel 2013*.
  2. When Excel 2013 starts, click **Blank Workbook**.<br/>
     ![](Images/14.png?raw=true "Figure 14")
  3. Click the **Insert** tab.
  4. In the **Apps** group, click **Store**.<br/>
     ![](Images/08.png?raw=true "Figure 15")
  5. In the store, search for **Modern Trend**.
  6. Click **Add** next to the **Modern Trend** app.<br/>
     ![](Images/16.png?raw=true "Figure 16")
  7. When prompted, click **Trust It**.<br/>
     ![](Images/17.png?raw=true "Figure 17")
4. Use the App for Office
  1. In the app, click **Select Your Data**. <br/>
     ![](Images/24.png?raw=true "Figure 24")
  2. Select the cities and crime statistices.<br/>
     ![](Images/25.png?raw=true "Figure 25")
  3. Click **Create**.

**Congratulations! You have completed investigating Apps for SharePoint and Office.**

