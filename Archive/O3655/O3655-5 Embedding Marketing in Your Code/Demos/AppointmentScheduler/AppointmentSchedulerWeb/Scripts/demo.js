
(function () {

    var $calendar = $('#calendar');
    var id = 25;

    $calendar.weekCalendar({
        timeslotsPerHour: 4,
        allowCalEventOverlap: true,
        overlapEventsSeparate: true,
        firstDayOfWeek: 1,
        businessHours: { start: 8, end: 18, limitDisplay: true },
        daysToShow: 4,
        height: function ($calendar) {
            return $(window).height() - $("h1").outerHeight() - 1;
        },
        eventRender: function (calEvent, $event) {
            if (calEvent.end.getTime() < new Date().getTime()) {
                $event.css("backgroundColor", "#aaa");
                $event.find(".wc-time").css({
                    "backgroundColor": "#999",
                    "border": "1px solid #888"
                });
            }
        },
        draggable: function (calEvent, $event) {
            return calEvent.readOnly != true;
        },
        resizable: function (calEvent, $event) {
            return calEvent.readOnly != true;
        },
        eventNew: function (calEvent, $event) {
            var $dialogContent = $("#event_edit_container");
            resetForm($dialogContent);
            var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
            var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
            var titleField = $dialogContent.find("input[name='title']");
            var bodyField = $dialogContent.find("textarea[name='body']");


            $dialogContent.dialog({
                modal: true,
                title: "New Calendar Event",
                close: function () {
                    $dialogContent.dialog("destroy");
                    $dialogContent.hide();
                    $('#calendar').weekCalendar("removeUnsavedEvents");
                },
                buttons: {
                    save: function () {
                    	appointments++;
                    	if (appointments === 23) {
		                    $("#spam").show();
		                    toastr.options = {
			                    "positionClass": "toast-bottom-full-width",
			                    "timeOut": 15000
		                    };
		                    toastr.success("Would you like to give feedback to the developer ? <button onclick=\"window.location('mailto:contosoappdeveloper@microsoft.com')\">Feedback</button>");
	                    } 

                        calEvent.id = id;
                        id++;
                        calEvent.start = new Date(startField.val());
                        calEvent.end = new Date(endField.val());
                        calEvent.title = titleField.val();
                        calEvent.body = bodyField.val();

                        $calendar.weekCalendar("removeUnsavedEvents");
                        $calendar.weekCalendar("updateEvent", calEvent);
                        $dialogContent.dialog("close");
                    },
                    cancel: function () {
                        $dialogContent.dialog("close");
                    }
                }
            }).show();

            $dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
            setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));

        },
        eventDrop: function (calEvent, $event) {

        },
        eventResize: function (calEvent, $event) {
        },
        eventClick: function (calEvent, $event) {

            if (calEvent.readOnly) {
                return;
            }

            var $dialogContent = $("#event_edit_container");
            resetForm($dialogContent);
            var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
            var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
            var titleField = $dialogContent.find("input[name='title']").val(calEvent.title);
            var bodyField = $dialogContent.find("textarea[name='body']");
            bodyField.val(calEvent.body);

            $dialogContent.dialog({
                modal: true,
                title: "Edit - " + calEvent.title,
                close: function () {
                    $dialogContent.dialog("destroy");
                    $dialogContent.hide();
                    $('#calendar').weekCalendar("removeUnsavedEvents");
                },
                buttons: {
                    save: function () {
                        calEvent.start = new Date(startField.val());
                        calEvent.end = new Date(endField.val());
                        calEvent.title = titleField.val();
                        calEvent.body = bodyField.val();

                        $calendar.weekCalendar("updateEvent", calEvent);
                        $dialogContent.dialog("close");

                        
                        window.actionCounter++;
                        if (window.actionCounter === 3) {
                            window.actionCounter = 0;
                            $("#trial_spam").html("Would you like to write a review? <button id='feedback'>Review</button>");
                            $("#trial_spam").show();
                        }
                        

                    },
                    "delete": function () {
                        appointments--;
                        $('#spam').show();
                        $calendar.weekCalendar("removeEvent", calEvent.id);
                        $dialogContent.dialog("close");
                    },
                    cancel: function () {
                        $dialogContent.dialog("close");
                    }
                }
            }).show();

            var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
            var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
            $dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
            setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));
            $(window).resize().resize(); //fixes a bug in modal overlay size ??

        },
        eventMouseover: function (calEvent, $event) {
        },
        eventMouseout: function (calEvent, $event) {
        },
        noEvents: function () {

        },
        data: function (start, end, callback) {
            callback(getEventData());
        }
    });

    function resetForm($dialogContent) {
        $dialogContent.find("input").val("");
        $dialogContent.find("textarea").val("");
    }

    function getEventData() {
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var day = new Date().getDate();
        if (document.getElementById('sample').checked) {   //If user has checked box to generate sample code
            appointments = 21;
            return {
                events: [
                   {
                       "id": 1,
                       "start": new Date(2015, 08, 26, 11, 15),
                       "end": new Date(2015, 08, 26, 12, 30),
                       "title": "Consultation - J. Freeman",
                       "body": "Consultation in Building 1, Room 212"
                   },
                   {
                       "id": 2,
                       "start": new Date(2015, 08, 26, 10),
                       "end": new Date(2015, 08, 26, 11, 15),
                       "title": "Consultation- R.Smith",
                       "body": "Consultation ahead of Heart Surgery"
                   },
                   {
                       "id": 3,
                       "start": new Date(2015, 08, 23, 17),
                       "end": new Date(2015, 08, 23, 17, 45),
                       "title": "Oncology review",
                       "body": "Quarterly review of oncology referals (south west and south east regions)"
                   },
                   {
                       "id": 4,
                       "start": new Date(2015, 08, 24, 8),
                       "end": new Date(2015, 08, 24, 9, 30),
                       "title": "Emergency consultation",
                       "body": "Blood scan follow up with J. Jones."
                   },
                   {
                       "id": 5,
                       "start": new Date(2015, 08, 25, 14),
                       "end": new Date(2015, 08, 25, 15),
                       "title": "Phlebotomy- J.Quinn",
                       "body": "Full bloodwork ahead of consultation on Tuesday"
                   },
                   {
                       "id": 6,
                       "start": new Date(2015, 08, 23, 8),
                       "end": new Date(2015, 08, 23, 9, 30),
                       "title": "New Patient",
                       "body": "Medical history and basic check-up.  Timothy Dalton (minor).  Mother: Jane Dalton."
                   },

                   {
                       "id": 8,
                       "start": new Date(2015, 08, 24, 13, 45),
                       "end": new Date(2015, 08, 24, 16),
                       "title": "Outpatient Follow-up - R.Keane",
                       "body": "Scheduled checkup after Major Surgery"
                   },
                   {
                       "id": 9,
                       "start": new Date(2015, 08, 24, 10, 15),
                       "end": new Date(2015, 08, 24, 12),
                       "title": "Accounts analysis",
                       "body": "Review of insurance claims which were denied (major 4 only)"
                   },
                   {
                       "id": 10,
                       "start": new Date(2015, 08, 25, 9, 45),
                       "end": new Date(2015, 08, 25, 12, 30),
                       "title": "Consultation S.Stanley",
                       "body": "Elderly referral complaining of shortness of breath"
                   },
                   {
                       "id": 11,
                       "start": new Date(2015, 08, 25, 8),
                       "end": new Date(2015, 08, 25, 9, 30),
                       "title": "Consultation D. Smith",
                       "body": "Injury resulting from arm wrestling."
                   },
                   {
                       "id": 12,
                       "start": new Date(2015, 08, 26, 8),
                       "end": new Date(2015, 08, 26, 9, 30),
                       "title": "Consultation Armstrong twins",
                       "body": "2 year check-up."
                   },
                   {
                       "id": 13,
                       "start": new Date(2015, 08, 26, 16),
                       "end": new Date(2015, 08, 26, 17, 30),
                       "title": "Consultation - B.Allen",
                       "body": "Checkup following severe fracture of tibia"
                   },
                   {
                       "id": 14,
                       "start": new Date(2015, 08, 26, 14),
                       "end": new Date(2015, 08, 26, 16),
                       "title": "Minor Injuries Clinic",
                       "body": "Free access (final patient list tbd)"
                   },
                   {
                       "id": 15,
                       "start": new Date(2015, 08, 23, 12, 30),
                       "end": new Date(2015, 08, 23, 13, 30),
                       "title": "Lunch",
                   },
                   {
                       "id": 16,
                       "start": new Date(2015, 08, 24, 17),
                       "end": new Date(2015, 08, 24, 17, 45),
                       "title": "Vaccination Q. McQuill",
                       "body": "Hepatitus (SE Asia)"
                   },
                   {
                       "id": 17,
                       "start": new Date(2015, 08, 25, 17),
                       "end": new Date(2015, 08, 25, 17, 45),
                       "title": "Spinal exam (to be confirmed)",
                       "body": "Spinal curvature arising from workplace"
                   },
                   {
                       "id": 18,
                       "start": new Date(2015, 08, 26, 17),
                       "end": new Date(2015, 08, 26, 17, 45),
                       "title": "Daily Review",
                       "body": "Meeting to review open case"
                   },
                   {
                       "id": 19,
                       "start": new Date(2015, 08, 24, 12, 30),
                       "end": new Date(2015, 08, 24, 13, 30),
                       "title": "Lunch",
                   },
                   {
                       "id": 20,
                       "start": new Date(2015, 08, 25, 12, 30),
                       "end": new Date(2015, 08, 25, 13, 30),
                       "title": "Lunch",
                   },
                   {
                       "id": 21,
                       "start": new Date(2015, 08, 26, 12, 30),
                       "end": new Date(2015, 08, 26, 13, 30),
                       "title": "Lunch",
                   },
                ]
            };
        }
        else {
            return { events: [] };
        }
    }


    /*
     * Sets up the start and end time fields in the calendar event
     * form for editing based on the calendar event being edited
     */
    function setupStartAndEndTimeFields($startTimeField, $endTimeField, calEvent, timeslotTimes) {

        for (var i = 0; i < timeslotTimes.length; i++) {
            var startTime = timeslotTimes[i].start;
            var endTime = timeslotTimes[i].end;
            var startSelected = "";
            if (startTime.getTime() === calEvent.start.getTime()) {
                startSelected = "selected=\"selected\"";
            }
            var endSelected = "";
            if (endTime.getTime() === calEvent.end.getTime()) {
                endSelected = "selected=\"selected\"";
            }
            $startTimeField.append("<option value=\"" + startTime + "\" " + startSelected + ">" + timeslotTimes[i].startFormatted + "</option>");
            $endTimeField.append("<option value=\"" + endTime + "\" " + endSelected + ">" + timeslotTimes[i].endFormatted + "</option>");

        }
        $endTimeOptions = $endTimeField.find("option");
        $startTimeField.trigger("change");
    }

    var $endTimeField = $("select[name='end']");
    var $endTimeOptions = $endTimeField.find("option");

    //reduces the end time options to be only after the start time options.
    $("select[name='start']").change(function () {
        var startTime = $(this).find(":selected").val();
        var currentEndTime = $endTimeField.find("option:selected").val();
        $endTimeField.html(
              $endTimeOptions.filter(function () {
                  return startTime < $(this).val();
              })
              );

        var endTimeSelected = false;
        $endTimeField.find("option").each(function () {
            if ($(this).val() === currentEndTime) {
                $(this).attr("selected", "selected");
                endTimeSelected = true;
                return false;
            }
        });

        if (!endTimeSelected) {
            //automatically select an end date 2 slots away.
            $endTimeField.find("option:eq(1)").attr("selected", "selected");
        }

    });

    //   $('#reminder_spam').remove();
    //  if (appointments != 0) { $('<div id ="reminder_spam">You currently have 0 appointments of ' + appointments + ' using reminders</div>').appendTo('#spam'); }

}());