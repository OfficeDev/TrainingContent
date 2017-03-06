#Demo 2 - State Machine, Initiation Form & Tasks Workflow

Use the **Completed Solution** form the lab exercise 2 in this demo: **StateMachineInitForm**.

After opening, change the **Start URL** property of the SharePoint Hosted App to point to a SharePoint Developer site. Deploy & demonstrate the app.

After explaining the workflow, take a moment to look at the different aspects of a state and a transition. Explain how you can have multiple transitions taking you to the same or different states, or even creating a loop, based on different conditions.

The move onto forms. Pick through the JavaScript in the initiation form. Explain how because initiation forms are not displayed when workflows autostart when items are added / modified in a list, it is a good practice to include an association form that collects some default data upon association. Thus, add an association form and explain how to use it as well as the activity to use within the workflow to collect the data. Finally, explain how when testing association forms, configure the workflow so it is not automatically associated with the form.