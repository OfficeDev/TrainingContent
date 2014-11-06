# O3656-6 Deep Dive into Search Scenarios in Office 365
In this lab, you will create solutions to extend the Search Center and build a search-based app.

## Prerequisites
1. You must have an Office 365 tenant to complete this lab. If you do not have one, the lab for **O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
2. You will need some task lists defined in your tenancy. If you do not have one created, then define at least one and add some tasks.

## Exercise 1: Extend the Search Center 
In this exercise you will create a custom solution that extends the Search Center.

1. Create a new Search Center in your tenant.
  1. Log into your SharePoint online tenancy using your **Organizational Account**.
  2. Select **Site Settings**.<br/>
     ![](Images/01.png?raw=true "Figure 1")
  3. Click **Site Collection Features**.<br/>
     ![](Images/02.png?raw=true "Figure 2")
  4. Activate **SharePoint Server Publishing Infrastructure**.<br/>
     ![](Images/03.png?raw=true "Figure 3")
  5. Select **Site Settings**.
  6. Click **Manage Site Features**.<br/>
     ![](Images/04.png?raw=true "Figure 4")
  7. Activate **SharePoint Server Publishing**.<br/>
     ![](Images/05.png?raw=true "Figure 5")
  8. Click **Site Contents**.
  9. Click **New Subsite**.
  10. On the **New SharePoint Site** page:
    1. Enter **My Search Center** for the **Title**..
    2. Enter **mysearch** for the **Url**.
    3. Select **Enterprise Search Center** as the template.
    4. Click **Create**.<br/>
       ![](Images/06.png?raw=true "Figure 6")
  11. Test the Search Center by entering the following query to return your current tasks:

  ```
  ContentClass:STS_ListItem_Tasks AssignedToOWSUSER:'[YOUR DISPLAY NAME]' PercentCompleteOWSNMBR<>'100'
  ```
  ![](Images/07.png?raw=true "Figure 7")

2. Create a Result Source.
  1. Select **Site Settings**.
  2. Click **Result Sources**.<br/>
      ![](Images/08.png?raw=true "Figure 8")
  3. Click **New Result Source**.<br/>
      ![](Images/09.png?raw=true "Figure 9")
    1. Enter **Tasks** for the **Name**.
    2. Click **Launch Query Builder**.
    3. On the **Basics** tab, enter the following query in the **Query Text** field.

    ```
    ContentClass:STS_ListItem_Tasks AssignedToOWSUSER:{User.Name} PercentCompleteOWSNMBR<>'100'
    ```
    4. Click **Test Query** and verify you see results.<br/>
      ![](Images/10.png?raw=true "Figure 10")
    5. Click **OK**
  4. Click **Save**.

3. Create a Result Type.
  1. Click **Master Pages and Page Layouts**.<br/>
    ![](Images/11.png?raw=true "Figure 11")
  2. Click the **Display Templates** folder.
  3. Click the **Search** folder.
  4. Click the **Files** tab and then **Upload Document**.
  5. **Browse** to the **LabFiles** folder and upload **Task_Default.html**.
  6. Click **OK**.<br/>
    ![](Images/12.png?raw=true "Figure 12")
  7. When the Properties form appears, simply click **Save**.
  8. Return to the **My Search Center** site.
  9. Click **Site Settings**.
  10. Click **Result Types**.<br/>
    ![](Images/13.png?raw=true "Figure 13")
  11. Click **New Result Type**.<br/>
      ![](Images/14.png?raw=true "Figure 14")
    1. Enter **Task** for the **Name**.
    2. Select **Tasks** for the **Which source should results match?** drop-down list.
    3. Select **Task Template** for the **What should these results look like?** drop-down list.
    4. Click **Save**.<br/>
      ![](Images/15.png?raw=true "Figure 15")

4. Create a Search Results Page
  1. Return to the **My Search Center** site.
  2. Click **Site Contents**.
  3. Click the **Pages** library.
  4. Click the **Flies** tab and then select **New Document/Page**.<br/>
      ![](Images/16.png?raw=true "Figure 16")
    1. Enter **Tasks** in the **Title** field.
    2. Click **Create**.<br/>
      ![](Images/17.png?raw=true "Figure 17")
  5. Click on the newly-created **Tasks** page.
  6. Select **Edit Page**.
  7. Select **Edit Web Part** from the **Search Results** web part.
      ![](Images/18.png?raw=true "Figure 18")
  8. Click **Change Query**.
  9. In the **Build Your Query** dialog:
    1. Select **Tasks** from the **Select a Query** drop-down list.
    2. Click **Test Query** and verify you get results.
    3. Click **OK**.<br/>
      ![](Images/19.png?raw=true "Figure 19")
  10. Click **OK**.
  11. Click **Publish**. You should now see a properly-formatted task list.
      ![](Images/20.png?raw=true "Figure 20")

5. Add Search Navigation
  1. Click **Site Settings**.
  2. Click **Search Settings**.<br/>
      ![](Images/21.png?raw=true "Figure 21")
  3. In the **Configure Search Navigation** section:
    1. Click **Add Link**.
    2. Enter **Tasks** in the **Title**.
    3. Enter **/mysearch/Pages/Tasks.aspx** in the **URL**.
    4. Click **OK*.<br/>
      ![](Images/22.png?raw=true "Figure 22")
  4. Click **OK**.

6. Test the Solution
  1. Return to the **My Search Center** site.
  2. Enter a keyword and click the **Tasks** scope.
  3. Verify that you see appropriate results for the query.
      ![](Images/23.png?raw=true "Figure 23")


