# Demo BindingDemoWithWordApp

1. Open the BindingDemoWithWordApp solution using Visual Studio 2015
2. Select the BindingDemoWithWordApp project. Set the **Start Document** property value to **CustomerInformation.docx**.

    ![Screenshot of the previous step](../Images/Fig17.png)

3. Press the **{F5}** key to run the project. The debugger should launch **CustomerInformation.docx** and you should see your Office Add-in in the task pane on the right side of Word document.

    ![Screenshot of the previous step](../Images/Fig18.png)

4. **Close** the Add-in Task Pane.

    ![Screenshot of the previous step](../Images/Fig19.png)

5. Click **Insert > My Add-ins**, then select the **BindingDemoWithWordApp** Add-In.

    ![Screenshot of the previous step](../Images/Fig20.png)

6. The **BindingDemoWithWordApp** Add-In now appears in the Task Pane.

    ![Screenshot of the previous step](../Images/Fig21.png)

7. Click the **Create Bindings** button, to create bindings in the document whose ids equal **firstName**, **lastName**, and **company**.

9. Click the **Set Binding Values** button. The three bindings created in the step above have their values set programmatically.
   
    ![Screenshot of the previous step](../Images/Fig22.png)

10. Click the **Register Binding Event Handlers** button to register event handlers for the bindings. Then, change the value of **First Name**, **Last Name** or **Company**. 

    ![Screenshot of the previous step](../Images/Fig23.png)

11. Notice the message box indicates which binding value has been changed.

    ![Screenshot of the previous step](../Images/Fig24.png)