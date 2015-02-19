/// <reference path="../App.js" />

(function () {
    "use strict";

    // The Office initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();

            displayItemDetails();
        });
    };

    // Displays the "Subject" and "From" fields, based on the current mail item
    function displayItemDetails() {

        var displayTable = $("<table>");

        var mailbox = Office.context.mailbox;
        displayTable.append(createRow("Mailbox Owner:", mailbox.userProfile.displayName));
        displayTable.append(createRow("Mailbox Timezone:", mailbox.userProfile.timeZone));
        displayTable.append(createRow("EWS Url:", mailbox.ewsUrl));

        var item = Office.cast.item.toItemRead(Office.context.mailbox.item);
        displayTable.append(createRow("Item Type:", item.itemType));

        if (item.itemType === Office.MailboxEnums.ItemType.Message) {
            displayTable.append(createRow("Subject:", item.subject));
            displayTable.append(createRow("To:", item.to[0].displayName));
            displayTable.append(createRow("From:", item.from.displayName));
        }

        if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {

            displayTable.append(createRow("Organizer:", item.organizer.displayName));
            displayTable.append(createRow("Start time:", item.start));
        }

        $("#results").empty();
        $("#results").append(displayTable);
    }

    function createRow(rowLabel, rowValue) {
        var row = $("<tr>");
        row.append($("<th>").text(rowLabel));
        row.append($("<td>").text(rowValue));
        return row;
    }

})();