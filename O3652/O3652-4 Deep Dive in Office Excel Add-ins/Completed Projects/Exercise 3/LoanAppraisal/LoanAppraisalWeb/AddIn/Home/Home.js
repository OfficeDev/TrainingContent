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
            onInitializeUI();
            createBindings();
        });
    }

    function updateAppUI() {
        $("#applicant_name").text(currentApplicant.name);
        $("#loan_amount").text(formatToCurrencyUSD(currentApplicant.loan_amount));
        $("#interest_rate").text((currentRate * 100) + "%");
        $("#loan_duration").text(currentApplicant.loan_duration + " years");
        $("#total_income").text(formatToCurrencyUSD(currentApplicant.total_income));
        $("#fixed_expenses").text(formatToCurrencyUSD(currentApplicant.fixed_expenses));
    }

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

    function onAllBindingCreated(asyncResult) {
        updateBindingsToDocument();
    }

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

    function onBindingUpdated(asncResult) {
        updateBindingsFromDocument();
    }

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

    function onBindingReadFromDocument(asyncResult) {
        var value = asyncResult.value;
        var targetDiv = "#" + asyncResult.asyncContext;
        $(targetDiv).text(value);
    }
})();