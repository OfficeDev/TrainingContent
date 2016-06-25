# Deep Dive into Office Excel Add-ins
In this lab you will get hands-on experience developing an Office Excel Add-in that creates bindings between the Add-in and a spreadsheet.


**Prerequisites:** 
1. You must have Visual Studio 2015 & Update 1 installed.
1. You must have Office 2016 Preview installed which you can obtain from here: https://products.office.com/en-us/office-2016-preview
1. This lab requires you to use multiple starter files or an entire starter project from the GitHub location. You can either download the whole repo as a zip or clone the repo https://github.com/OfficeDev/TrainingContent.git for those familiar with git.

## Exercise 1: Creating the LoanAppraisal Add-in for Office Project
In this exercise you will create a new Office Add-in project in Visual Studio so that you can begin to write, test and debug an Office Excel Add-in.

1. Launch Visual Studio 2015 as an administrator.
2. From the **File** menu select the **New Project** command. When the **New Project** dialog appears, select the **Office Add-in** project template from the **Office/SharePoint** template folder as shown below. Name the new project **LoanAppraisal** and click **OK** to create the new project.  

	![Screenshot of the previous step](Images/Fig01.png)

3. When you create a new Add-in for Office project, Visual Studio prompts you with the **Choose the add-in type** page of the **Create Office Add-in** dialog. This is the point where you select the type of Office Add-in you want to create. Leave the default setting with the radio button titled **Task pane** and select **Next** to continue. 

	![Screenshot of the previous step](Images/Fig02.png)

4. On the **Choose the host applications** page of the **Create Office Add-in** dialog, uncheck all the Office application except for **Excel** and then click **Finish** to create the new Visual Studio solution.  

	![Screenshot of the previous step](Images/Fig03.png)

5. Take a look at the structure of the new Visual Studio solution once it has been created. At a high-level, the new solution has been created using two Visual Studio projects named **LoanAppraisal** and **LoanAppraisalWeb**. You should also observe that the top project contains a top-level manifest for the Add-in named **LoanAppraisalManifest** which contains a single file named **LoanAppraisal.xml**.  

	![Screenshot of the previous step](Images/Fig04.png)

6. In the Solution Explorer, double-click on the node named **LoanAppraisalManifest** to open the add-in manifest file in the Visual Studio designer. Update the **Display Name** settings in the Add-in manifest from **LoanAppraisal** to **Loan Appraisal Add-in**.  

	![Screenshot of the previous step](Images/Fig05.png)

7. Save and close **LoanAppraisalManifest**.
8. Over the next few steps you will walk through the default Add-in implementation that Visual Studio generated for you when the Add-in project was created. Begin by looking at the structure of the **AddIn** folder which has two important files named **app.css** and **app.js** which contain CSS styles and JavaScript code which is to be used on an app-wide basis.

	![Screenshot of the previous step](Images/Fig06.png)

9. You can see that inside the **AddIn** folder there is a child folder named **Home** which contains three files named **Home.html**, **Home.css** and **Home.js**. Note that the Add-in project is currently configured to use **Home.html** as the Add-in's start page and that **Home.html** is linked to both **Home.css** and **Home.js**. 
10. Double-click on **app.js** to open it in a code editor window. you should be able to see that the code creates a global variable named **app** based on the JavaScript *Closure* pattern. The global **app** object defines a method named **initialize** but it does not execute this method. 
 
	````javascript
	var app = (function () {
	    "use strict";
	    var app = {};
	    // Common initialization function (to be called from each page)
	    app.initialize = function () {
	        $('body').append(
	            '<div id="notification-message">' +
	                '<div class="padding">' +
	                    '<div id="notification-message-close"></div>' +
	                    '<div id="notification-message-header"></div>' +
	                    '<div id="notification-message-body"></div>' +
	                '</div>' +
	            '</div>');
	        $('#notification-message-close').click(function () {
	            $('#notification-message').hide();
	        });
	        // After initialization, expose a common notification function
	        app.showNotification = function (header, text) {
	            $('#notification-message-header').text(header);
	            $('#notification-message-body').text(text);
	            $('#notification-message').slideDown('fast');
	        };
	    };
	    return app;
	})();
	````

11. Close **app.js** and be sure not to save any changes.
12. Next you will examine the JavaScript code in **home.js**. Double-click on **home.js** to open it in a code editor window. Note that **Home.html** links to **app.js** before it links to **home.js** which means that JavaScript code written in **Home.js** can access the global **app** object created in **app.js**.
13. Walk through the code in **Home.js** and see how it uses a self-executing function to register an event handler on the **Office.initialize** method which in turn registers a document-ready event handler using jQuery. This allows the Add-in to call **app.initialize** and to register an event handler using the **getDataFromSelection** function. 

	````javascript 
	(function () {
	  "use strict";

	  // The initialize function must be run each time a new page is loaded
	  Office.initialize = function (reason) {
	    $(document).ready(function () {
	      app.initialize();
	      $('#get-data-from-selection').click(getDataFromSelection);
	    });
	  };

	  // Reads data from current document selection and displays a notification
	  function getDataFromSelection() {
	    Office.context.document.getSelectedDataAsync(Office.CoercionType.Text,
	      function (result) {
	        if (result.status === Office.AsyncResultStatus.Succeeded) {
	          app.showNotification('The selected text is:', '"' + result.value + '"');
	        } else {
	          app.showNotification('Error:', result.error.message);
	      }
		});
	  }
	})();
	````

14. Delete the **getDataFromSelection** function from **Home.js** and also remove the line of code that binds the event handler to the button with the id of **get-data-from-selection** so your code matches the following code listing.

	````javascript
	(function () {
	  "use strict";

	  // The initialize function must be run each time a new page is loaded
	  Office.initialize = function (reason) {
	    $(document).ready(function () {
	      app.initialize();
	      // your app initialization code goes here
	    });
	  };

	})(); 
	````

15. Save your changes to **Home.js**. You will return to this source file after you have added your HTML layout to **Home.html**.
16. Now it's time to examine the HTML that has been added to the project to create the Add-in's user interface. Double-click **Home.html** to open this file in a Visual Studio editor window. Examine the layout of HTML elements inside the body element. 

	````html
	<body>
		<div id="content-header">
			<div class="padding">
				<h1>Welcome</h1>
			</div>
		</div>
		<div id="content-main">
			<div class="padding">
				<p><strong>Add home screen content here.</strong></p>
				<p>For example:</p>
				<button id="get-data-from-selection">Get data from selection</button>

				<p style="margin-top: 50px;">
					<a target="_blank" href="https://go.microsoft.com/fwlink/?LinkId=276812">Find more samples online...</a>
				</p>
			</div>
		</div>
	</body>
	````

17. Replace the text message of **Welcome** inside the **h1** element with a different message such as **Loan Information**. Also trim down the contents of the **content-main** div element to match the HTML code shown below. You will start off your HTML layout using a single div element with an id of **results**.

	````html
	<body>
	    <div id="content-header">
	        <div class="padding">
	            <h1>Loan Information</h1>
	        </div>
	    </div>
	    <div id="content-main">
	        <div class="padding">
	            <div id="results"></div>
	        </div>
	    </div>
	</body>
	````

18. Save and close **Home.html**.
19. Return to **Home.js** and modify the code to write a simple message to the **results** div using the following code.

	````javascript
	(function () {
	    "use strict";

	    // The initialize function must be run each time a new page is loaded
	    Office.initialize = function (reason) {
	        $(document).ready(function () {
	            app.initialize();
	            $('#results').text("Hello world");
	        });
	    }

	})();
	````

20. Now it's time to test the Add-in using the Visual Studio debugger. Press the **{F5}** key to run the project in the Visual Studio debugger. The debugger should launch Microsoft Excel 2016 and you should see your **LoanAppraisal** Add-in in the task pane on the right side of a new Excel workbook as shown in the following screenshot.  

	![Screenshot of the previous step](Images/Fig07.png)

21. Close Microsoft Excel to terminate your debugging session and return to Visual Studio.

## Exercise 2: Adding a Test Document to an Office Add-in project
*In this exercise you continue to work on the LoanAppraisal project you created in the previous lab by integrating a preexisting Excel workbook into the development process. This will make it possible for you to develop an Add-in binds to named ranges within the workbook.*

1. Ensure that you still have the **LoanAppraisal** Add-in project opened in Visual Studio.
2. Download [**TestDoc.xlsx**](Starter Files/TestDoc.xlsx?raw=true).
3. Double-click on **TestDoc.xlsx** to open the workbook in Microsoft Excel.  You should see that the workbook provides mortgage loan information and a chart as shown in the following screenshot.  

	![Screenshot of the previous step](Images/Fig08.png)  

4. Close **TestDoc.xlsx** and also close Microsoft Excel.
5.	Add the file **TestDoc.xlsx** into the **LoanAppraisal** project. The easiest way to do this is to copy the file to the clipboard in Windows Explorer and then to paste it into the root of the the **LoanAppraisal** project and then include it in the project. When you are done, you should be able to see **TestDoc.xlsx** at the root of the **LoanAppraisal** project right below **LoanAppraisalManifest** as shown in the following screenshot.

	![Screenshot of the previous step](Images/Fig09.png)  

6.	With the **LoanAppraisal** project selected in the Solution Explorer, locate the properties window and modify the **Start Document** property to **TestDoc.xslx**.  

	![Screenshot of the previous step](Images/Fig10.png)  

7.	Press **{F5}** to begin a debugging session. You should see that Visual Studio initialize the debugging session with **TestDoc.xlsx** instead of using a new Excel workbook. However, you might notice that the **LoanAppraisal** Add-in has not be activated. In the Excel ribbon, navigate to the **Insert** tab and select **Loan Appraisal Add-in** from the **My Add-ins** drop down menu.

	![Screenshot of the previous step](Images/Fig11.png)

8.	You should now see that the Add-in has activated over in the task pane.  

	![Screenshot of the previous step](Images/Fig12.png)

9.	Inside Excel, save your changes to **TestDoc.xlsx** to update the test file to include the Add-in in future debugging sessions.
10.	Close **TestDoc.xlsx** and then close Microsoft Excel.
11.	Return to Visual Studio and press **{F5}** to start another debugging session. Now the Add-in should be initialized automatically when Visual Studio initialize a debugging session.  

	![Screenshot of the previous step](Images/Fig12.png)

12.	Now that you have integrated the test document into your project, it is time to move ahead to the next exercise where you will write code to bind to name ranges in the workbook.

## Exercise 3: Adding Bindings Between an Add-in and an Excel Workbook
In this exercise you will write code to create bindings on named ranges within the the Excel workbook named TestDoc.xlsx. You will also create event handlers so that the Add-in responds to the user when updating the Add-in user interface.

1. The workbook **TestDoc.xlsx** contains several cells that have already been defined as named ranges. Review the following list which shows the names of the Excel named ranges that you will be programming against in this exercise.
	-	**Applicant_Name**
	-	**Loan_Amount**
	-	**Interest_Rate**
	-	**Loan_Duration**
	-	**Monthly_Payment**
	-	**Total_Income**
	-	**Yearly_Mortgage**
	-	**Fixed_Expenses**
	-	**Available_Income**
2. Open **Home.html** in an editor window.
3. Modify the contents of the **content-main** div element with the HTML code from **[content-main.html.txt](Starter Files/content-main.html.txt?raw=true "content-main.html.txt")** which is in the **[Starter Files](Starter Files "Starter Files")** folder within this lab located at [\\\O3652\O3652-4 Deep Dive in Office Excel Add-ins\Starter Files](Starter Files).
4. Save and close **Home.html**.
5. Open **Home.css** in an editor window.
6. Modify the contents of **Home.css** with the set of CSS rules shown in [**Home.css.txt**](Starter Files/Home.css.txt?raw=true) which is in the **[Starter Files](Starter Files "Starter Files")** folder within this lab located at [\\\O3652\O3652-4 Deep Dive in Office Excel Add-ins\Starter Files](Starter Files).
7. Save and close **Home.css**.
8. Open **Home.js** in a code editor widow. Remove the following line of code.
	
	````javascript
	$('#results').text("Hello world");
	````

9. At this point, the code in **Home.js** should look like the following code listing.

	````javascript
	/// <reference path="../App.js" />
	(function () {
	    "use strict";

	    // The initialize function must be run each time a new page is loaded
	    Office.initialize = function (reason) {
	        $(document).ready(function () {
	            app.initialize();
	            
	        });
	    }

	})();
	````

10. Start a debugging session by pressing the **{F5}** key to inspect the Add-in's new HTML layout. You should see the user interface appears like the one in the following screenshot.

	![Screenshot of the previous step](Images/Fig13.png)    

11.	Close Excel and return to Visual Studio.
12.	Inside **Home.js**, place the cursor under the **"use strict;"** statement at the top of the closure and add the following code. 

	````javascript
	var interestRates = [0.0425, 0.0500, 0.0750];
	var currentRate = interestRates[0];

	var applicants = [
	  { name: "Brian Cox", loan_amount: 100000, loan_duration: 30, total_income: 82000, fixed_expenses: 22000 },
	  { name: "Wendy Wheeler", loan_amount: 325000, loan_duration: 30, total_income: 145000, fixed_expenses: 40000 },
	  { name: "Ken Sanchez", loan_amount: 225000, loan_duration: 30, total_income: 162000, fixed_expenses: 40000 },
	  { name: "Joe Healy", loan_amount: 625000, loan_duration: 30, total_income: 182000, fixed_expenses: 72000 },
	  { name: "Mke Fitzmaurice", loan_amount: 725000, loan_duration: 8, total_income: 320000, fixed_expenses: 120000 },
	  { name: "Chris Sells", loan_amount: 1225000, loan_duration: 15, total_income: 325000, fixed_expenses: 167000 }
	];
	var currentApplicant = applicants[0];
	````

13. After this step is complete, your **Home.js** file should match the following code listing.

	````javascript
	/// <reference path="../App.js" />
	(function () {
	    "use strict";

	    var interestRates = [0.0425, 0.0500, 0.0750];
	    var currentRate = interestRates[0];

	    var applicants = [
	      { name: "Brian Cox", loan_amount: 100000, loan_duration: 30, total_income: 82000, fixed_expenses: 22000 },
	      { name: "Wendy Wheeler", loan_amount: 325000, loan_duration: 30, total_income: 145000, fixed_expenses: 40000 },
	      { name: "Ken Sanchez", loan_amount: 225000, loan_duration: 30, total_income: 162000, fixed_expenses: 40000 },
	      { name: "Joe Healy", loan_amount: 625000, loan_duration: 30, total_income: 182000, fixed_expenses: 72000 },
	      { name: "Mke Fitzmaurice", loan_amount: 725000, loan_duration: 8, total_income: 320000, fixed_expenses: 120000 },
	      { name: "Chris Sells", loan_amount: 1225000, loan_duration: 15, total_income: 325000, fixed_expenses: 167000 }
	    ];
	    var currentApplicant = applicants[0];

	    // The initialize function must be run each time a new page is loaded
	    Office.initialize = function (reason) {
	        $(document).ready(function () {
	            app.initialize();            
	        });
	    }

	})();
	````

14. Place your cursor under the code that assigns a function to **Office.initialize** and add five new functions named **updateAppUI**, **onInitializeUI**, **formatToCurrencyUSD**, **onRateChanged** and **onApplicantChanged**.

	````javascript	
	// The initialize function must be run each time a new page is loaded
	Office.initialize = function (reason) {
	    $(document).ready(function () {
	        app.initialize();
	    });
	};

	function updateAppUI() {
	}

	function onInitializeUI() {
	}

	function formatToCurrencyUSD(amount) {
	}

	function onRateChanged() {
	}

	function onApplicantChanged() {
	}
	````

15. Implement the **updateAppUI** function using the following code.

	````javascript
	function updateAppUI() {
	    $("#applicant_name").text(currentApplicant.name);
	    $("#loan_amount").text(formatToCurrencyUSD(currentApplicant.loan_amount));
	    $("#interest_rate").text((currentRate * 100) + "%");
	    $("#loan_duration").text(currentApplicant.loan_duration + " years");
	    $("#total_income").text(formatToCurrencyUSD(currentApplicant.total_income));
	    $("#fixed_expenses").text(formatToCurrencyUSD(currentApplicant.fixed_expenses));
	}
	````

16. Implement the **onInitializeUI** function using the following code.

	````javascript
	function onInitializeUI() {
	    var divRates = $("#selectInterestRate");
	    divRates.empty();

	    for (var i = 0; i < interestRates.length; ++i) {
	        var rate = interestRates[i];
	        divRates.append($('<input>', { type: 'radio', name: 'rate', value: rate }));
	        var formatedRate = (rate * 100).toFixed(2) + "%";
	        divRates.append($('<label>').text(formatedRate));
	        divRates.append($("<br>"));
	    }

	    var divApplicants = $("#selectApplicant");
	    divApplicants.empty();

	    for (i = 0; i < applicants.length; ++i) {
	        var name = applicants[i].name;
	        divApplicants.append($('<input>', { type: 'radio', name: 'Applicant', value: i }));
	        divApplicants.append($('<label>').text(applicants[i].name));
	        divApplicants.append($("<br>"));
	    }

	    $("#selectInterestRate :first-child").attr("checked", "checked");
	    $("#selectApplicant :first-child").attr("checked", "checked");

	    $("input[name='rate']").click(onRateChanged);
	    $("input[name='Applicant']").click(onApplicantChanged);

	    updateAppUI();
	}
	````

17. Implement the **formatToCurrencyUSD** function using the following code.

	````javascript
	function formatToCurrencyUSD(amount) {
	    var sign; var cents; var i;
	    amount = amount.toString().replace(/\$|\,/g, '');
	    if (isNaN(amount)) { amount = "0"; }
	    sign = (amount == (amount = Math.abs(amount)));
	    amount = Math.floor(amount * 100 + 0.50000000001);
	    cents = amount % 100;
	    amount = Math.floor(amount / 100).toString();
	    if (cents < 10) {
	        cents = '0' + cents;
	    }
	    for (i = 0; i < Math.floor((amount.length - (1 + i)) / 3) ; i++) {
	        amount = amount.substring(0, amount.length - (4 * i + 3)) + ',' + amount.substring(amount.length - (4 * i + 3));
	    }
	    return (((sign) ? '' : '-') + '$' + amount + '.' + cents);
	}
	````

18. Implement the **onRateChanged** and **onApplicantChanged** functions using the following code.

	````javascript
	function onRateChanged() {
	    var rate = parseFloat($(this).attr("value"));
	    currentRate = rate;
	    updateAppUI();
	}

	function onApplicantChanged() {
	    var applicant = applicants[parseInt(this.value)];
	    currentApplicant = applicant;
	    updateAppUI();
	}
	````

19. Modify the Add-in's initialization code to call the **onInitializeUI** function. 

	````javascript
	// The initialize function must be run each time a new page is loaded
	Office.initialize = function (reason) {
	    $(document).ready(function () {
	        app.initialize();
	        onInitializeUI();
	    });
	}
	````

20. Now it's again time to test the Add-in in the Visual Studio. Press the **{F5}** key and wait for the debugging session and the Add-in to initialize. Once the Add-in has activated, you should be able to see it is displaying information about a loan for the current applicant as shown in the following screenshot. Also note that the UI for the Add-in will automatically update when you change the interest rate or the loan applicant.  

	![Screenshot of the previous step](Images/Fig14.png)  

21. Close Excel and return to Visual Studio.
22. Inside **Home.js** directly below the **onApplicantChanged** function, add six new functions named **createBindings**, **onAllBindingCreated**, **updateBindingsToDocument**, **onBindingUpdated**, **updateBindingsFromDocument** and **onBindingReadFromDocument**.

	````javascript
	function createBindings() {
	}

	function onAllBindingCreated(asyncResult) {
	}

	function updateBindingsToDocument() {
	}

	function onBindingUpdated(asncResult) {
	}

	function updateBindingsFromDocument() {
	}

	function onBindingReadFromDocument(asyncResult) {
	}
	````

23. Implement the **createBindings** function using the following code.

	````javascript
	function createBindings() {	
        var bindings = Office.context.document.bindings;
	    bindings.addFromNamedItemAsync("Sheet1!Applicant_Name", "text",
	                                    { id: "applicant_name" }, function () { });
	
	    bindings.addFromNamedItemAsync("Sheet1!Loan_Amount", "text",
	                                   { id: "loan_amount" }, function () { });
	
	    bindings.addFromNamedItemAsync("Sheet1!Interest_Rate", "text",
	                                   { id: "interest_rate" }, function () { });
	
	    bindings.addFromNamedItemAsync("Sheet1!Loan_Duration", "text",
	                                   { id: "loan_duration" }, function () { });
	
	    bindings.addFromNamedItemAsync("Sheet1!Monthly_Payment", "text",
	                                   { id: "monthly_payment" }, function () { });
	
	    bindings.addFromNamedItemAsync("Sheet1!Total_Income", "text",
	                                   { id: "total_income" }, function () { });
	
	    bindings.addFromNamedItemAsync("Sheet1!Yearly_Mortgage", "text",
	                                   { id: "yearly_mortgage" }, function () { });
		
	    bindings.addFromNamedItemAsync("Sheet1!Fixed_Expenses", "text",
	                                   { id: "fixed_expenses" }, function () { });
	
	    bindings.addFromNamedItemAsync("Sheet1!Available_Income", "text",
	                                   { id: "available_income" }, onAllBindingCreated);
	}
	````

24. Implement the **onAllBindingCreated** function using the following code.

	````javascript		
	function onAllBindingCreated(asyncResult) {
	    updateBindingsToDocument();
	}
	````

25. Implement the **updateBindingsToDocument** function using the following code.

	````javascript
	function updateBindingsToDocument() {
		Office.select("bindings#applicant_name")
		        .setDataAsync(currentApplicant.name, function () { });
		
		Office.select("bindings#loan_amount")
		        .setDataAsync(currentApplicant.loan_amount, function () { });
		
		Office.select("bindings#interest_rate")
		        .setDataAsync(currentRate, function () { });
		
		Office.select("bindings#loan_duration")
		        .setDataAsync(currentApplicant.loan_duration, function () { });
		
		Office.select("bindings#total_income")
		        .setDataAsync(currentApplicant.total_income, function () { });
		
		Office.select("bindings#fixed_expenses")
		        .setDataAsync(currentApplicant.fixed_expenses, onBindingUpdated);
	}
	````

26. Implement the **onBindingUpdated** function using the following code.

	````javascript
	function onBindingUpdated(asncResult) {
	    updateBindingsFromDocument();
	}
	````

27. Implement the **updateBindingsFromDocument** function using the following code.

	````javascript
	function updateBindingsFromDocument() {		
	    Office.select("bindings#monthly_payment")
	          .getDataAsync({
	              asyncContext: "monthly_payment",
	              valueFormat: Office.ValueFormat.Formatted
	          }, onBindingReadFromDocument);
	
	    Office.select("bindings#yearly_mortgage")
	          .getDataAsync({
	              asyncContext: "yearly_mortgage",
	              valueFormat: Office.ValueFormat.Formatted
	          }, onBindingReadFromDocument);
	
	    Office.select("bindings#available_income")
	          .getDataAsync({
	              asyncContext: "available_income",
	              valueFormat: Office.ValueFormat.Formatted
	          }, onBindingReadFromDocument);
	}
	````

28. Implement the **onBindingReadFromDocument** function using the following code.

	````javascript
	function onBindingReadFromDocument(asyncResult) {
	    var value = asyncResult.value;
	    var targetDiv = "#" + asyncResult.asyncContext;
	    $(targetDiv).text(value);
	}
	````

29. Update both the **onRateChanged** and **onApplicantChanged** functions so that each of these functions calls **updateBindingsToDocument**.
		
	````javascript
	function onRateChanged() {
	    var rate = parseFloat($(this).attr("value"));
	    currentRate = rate;
	    updateAppUI();
	    updateBindingsToDocument();
	}
	
	function onApplicantChanged() {
	    var applicant = applicants[parseInt(this.value)];
	    currentApplicant = applicant;
	    updateAppUI();
	    updateBindingsToDocument();
	}
	````

30. Modify the Add-in's initialization code to call the **createBindings** function just after calling **onInitializeUI**. 

	````javascript
	// The initialize function must be run each time a new page is loaded
	Office.initialize = function (reason) {
	    $(document).ready(function () {
	        app.initialize();
	        onInitializeUI();
	        createBindings(); 
	    });
	}
	````

31. Now it's again time to test the Add-in in the Visual Studio. Press the **{F5}** key and wait for the debugging session and the Add-in to initialize. Once the Add-in has activated, test how the Add-in behaves when you change the Interest Rate or the Loan Applicant using the radio button at the bottom of the task pane. You should see that the Add-in updates information in the workbook and then retrieves values from the workbook for Monthly Payment and Yearly Mortgage and updates the UI in the task pane.

	![Screenshot of the previous step](Images/Fig15.png)  

Congratulations! In exercise you wrote code to create bindings on named ranges within the the Excel workbook named TestDoc.xlsx. You also created event handlers so that the Add-in responds to the user when interacting with the Add-in user interface.

## Exercise 4: Leverage the Excel v2 JavaScript API in Excel 2016
In this exercise you will create a Excel Add-in that uses the v2 JavaScript API included in Excel 2016. 

> **Note**: For this exercise you must have the Microsoft Office Excel 2016 Preview, or a later version, installed. Refer to the prerequisites at the beginning of this lab for links on where to obtain the Office 2016 Preview.

1. Launch Visual Studio 2015 as an administrator.
2. From the **File** menu select the **New Project** command. When the **New Project** dialog appears, select the **Office Add-ins** project template from the **Office/SharePoint** template folder as shown below. Name the new project **Excel16Api** and click **OK** to create the new project.

3. When you create a new Office Add-in project, Visual Studio prompts you with the **Choose the add-in type** page of the **Create Office Add-in** dialog. This is the point where you select the type of Office Add-in you want to create. Leave the default setting with the radio button titled **Task pane** and select **Next** to continue.

	![Screenshot of the previous step](Images/Fig02.png)

4. On the **Choose the host applications** page of the **Create Office Add-in** dialog, uncheck all the Office application except for **Excel** and then click **Finish** to create the new Visual Studio solution. 

	![Screenshot of the previous step](Images/Fig03.png)

5. Now update the user interface for the Add-in:
	1. Locate the `<body>` section of the page within the `home.html` file.
	1. Replace the entire contents of the `<body>` with the following markup:

		````html
		<body>
		  <div id="content-header">
		    <div class="padding">
		      <h1>Welcome</h1>
		    </div>
		  </div>
		  <div id="content-main">
		    <div class="padding">
		      <p>
		        Worksheet Name: <input type="text" id="worksheetName" /><br />
		        <button id="addWorksheet">Add a New Worksheet</button>
		      </p>
		      <p>
		        <button id="addRange">Add Range of Data</button>
		      </p>
		      <p>
		        <button id="addFormattedData"> Add Formatted Data Range</button>
		      </p>
		    </div>
				  </div>
		</body>
		````

6. The next step is to code the business logic for the Add-in.
	1. Locate the **AddIn \ Home \ Home.js** file.
	2. Remove all the sample code except the Add-in initialization code so all that is left is the following:

		````javascript
		(function () {
		  "use strict";

		  // The initialize function must be run each time a new page is loaded
		  Office.initialize = function (reason) {
		    $(document).ready(function () {
		        app.initialize();
	            // Use this to check whether the API is supported in the Word client.
	            if (Office.context.requirements.isSetSupported('ExcelApi', 1.1)) {
			      // attach click handlers to the word document
			      // TODO-1
			      // TODO-2
                  // TODO-3
	            }
	            else {
	                // Just letting you know that this code will not work with your version of Word.
	                console.log('This code requires Word 2016 or greater.');
	            }
		    });
		  };

		  // TODO-error
		})();
		````

	3. Add a universal error handler function that will be used when there are errors. This should replace the comment `// TODO-error`:

		````javascript
	  function errorHandler (error) {
	    console.log(JSON.stringify(error));
	  };
		````

	4. Now add a function that will add a new worksheet to the workbook:
		1. Replace the comment `// TODO-1` with the following jQuery code that creates a click event handler on one of the buttons in the `home.html` page you added previously:

			````javascript
			$('#addWorksheet').click(addWorksheet);
			````

		1. Next, add the following function before the error handler function you added previously.

			Notice how the code in this function is very different from the code in the previous exercises. The Excel v2 JavaScript API uses a context (`Excel.RequestContext()`) to allow you to batch multiple operations (such as `context.workbook.worksheets.add()`) that will be sent to the hosting Excel client application for processing at one time using the `context.executeAsync()` method:

			````javascript
		    function addWorksheet() {
		        // get reference to hosting Word application
		        var context = new Excel.RequestContext();
		
		        Excel.run(function (context) {
		            // create a new worksheet
		            var worksheetName = $('#worksheetName').val();
		            var newWorksheet = context.workbook.worksheets.add(worksheetName);
		
		            // create the worksheet and set as active worksheet
		            context.load(newWorksheet);
		            newWorksheet.activate();
		            return context.sync().then(function () {
		            }, errorHandler);
		        }).catch(function (error) {
		            console.log('Error: ' + JSON.stringify(error));
		            if (error instanceof OfficeExtension.Error) {
		                console.log('Debug info: ' + JSON.stringify(error.debugInfo));
		            }
		        });
		    };
			````

7. Now add functionality to add unformatted data to a new range in the current worksheet:
	1. Go back to the `Office.initialize` statement and replace the comment `// TODO-2` with the following jQuery code that creates a click handler for the button that will add a range of unformatted data to the current worksheet:

	````javascript
	$('#addRange').click(addRange);
	````

	1. Next, add the following function before the error handler function you previously added.

		Notice how the code first gets a collection of all the worksheets in the workbook, then it creates an array of data that is assigned to a range that's created on the spreadsheet starting at cell A1:

		````javascript
	    function addRange() {
	        // get reference to hosting Word application
	        var context = new Excel.RequestContext();
	        Excel.run(function (context) {
	            // get reference to current worksheet
	            var currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
	            // get a list of all worksheets in the current workbook
	            var worksheets = context.workbook.worksheets.load();
	
	            return context.sync().then(function () {
	
	                // create a one-dimensional array of all worksheets in the workbook
	                var worksheetList = [];
	                worksheetList.push(['Worksheets in the Workbook']);
	                for (var i = 0; i < worksheets.items.length; i++) {
	                    worksheetList.push([worksheets.items[i].name]);
	                };
	
	                // get a range to write to
	                var rangeSpec = "A1:A" + worksheetList.length;
	                var range = currentWorksheet.getRange(rangeSpec);
	                range.values = worksheetList;
	
	                // execute the change
	                context.sync().then(function () { }, errorHandler);
	            }, errorHandler);
	        }).catch(function (error) {
	            console.log('Error: ' + JSON.stringify(error));
	            if (error instanceof OfficeExtension.Error) {
	                console.log('Debug info: ' + JSON.stringify(error.debugInfo));
	            }
	        });
	    };
		````

8. Finally, add functionality to add *formatted* data to a new range in the current worksheet:
	1. Go back to the `Office.initialize` statement and replace the comment `// TODO-3` with the following jQuery code that creates a click handler for the button that will add a range of unformatted data to the current worksheet:

	````javascript
	$('#addFormattedData').click(addFormattedData);
	````

	1. Next, add the following function before the error handler function you previously added.

		Notice how the code works with ranges in a similar way to the last function, but this one assigns some formats to the range's `numberFormats` property:

		````javascript
		function addFormattedData() {
	        // get reference to hosting Word application
	        var context = new Excel.RequestContext();
	        Excel.run(function (context) {
	                // define a range
	                var rangeAddress = "C3:E5";
	
	                // define values in the range
	                var values = [
	                  ['Expense', 'Date', 'Amount'],
	                  ['Lunch', '7/15/2015', 45.98],
	                  ['Taxi', '7/15/2015', 18.22]
	                ];
	
	                // define the formats
	                var formats = [
	                  [null, null, null],
	                  [null, 'mmmm dd, yyyy', '$#,##0.00'],
	                  [null, 'mmmm dd, yyyy', '$#,##0.00']
	                ];
	
	                // get the range in the worksheet
	                var range = context.workbook.worksheets.getActiveWorksheet().getRange(rangeAddress);
	                range.numberFormat = formats;
	                range.values = values;
	                range.load();
	                // execute the change
	                context.sync().then(function () { }, errorHandler);
	        }).catch(function (error) {
	            console.log('Error: ' + JSON.stringify(error));
	            if (error instanceof OfficeExtension.Error) {
	                console.log('Debug info: ' + JSON.stringify(error.debugInfo));
	            }
	        });
	    };
		````

### Test the Add-in
1. Now deploy the Excel Add-in to the local Excel client:
  1. Select the **Excel16Api** project within the **Solution Explorer** tool window.
  1. Within the **Properties** window set the **Start Action** selector to **Office Desktop Client** and press **F5** to start the project.
  1. Visual Studio will launch the Excel desktop client & create a new Excel workbook.
1. Enter a name for a new worksheet and click the button **Add a New Worksheet**. 

	> Notice how Excel creates a new blank worksheet and changes focus to that worksheet.

1. Now, make sure you have a few worksheets in the workbook and then click the button **Add Range of Data**.

	> Notice how Excel creates a list of all the worksheets starting with cell **A1** in the current worksheet, but it adds a title to the worksheet at the top.

1. Lastly, click the button **Add Formatted Data Range**.

	> Notice how Excel creates a new table of data in the middle of the worksheet, but the dates and currency values are formatted accordingly.

Congratulations! You've now written an Excel Add-in that uses the new Excel v2 JavaScript API.