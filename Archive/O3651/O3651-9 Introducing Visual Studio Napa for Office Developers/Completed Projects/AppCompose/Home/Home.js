/// <reference path="../App.js" />
// global app

(function () {
  'use strict';

  // The initialize function must be run each time a new page is loaded
  Office.initialize = function (reason) {
    $(document).ready(function () {
      app.initialize();
      loadBuildings();
    });
  };

  function loadBuildings() {
      // Send an AJAX request
      var xhr = $.getJSON(buildingsSvcUri);
      xhr.done(function (data) {
  
          buildings = data;
          $('#buildings').accordion({ active: false, collapsible: true });
  
          // On success, 'data' contains a list of buildings.
          $.each(data, function (key, item) {
              // Add a list item for the building.
              $('#buildings').append('<h3><a href="#"' + item.Id + '>' + item.Name + '</a></h3><div><p>' + item.Area + '<span style="display: inline-block; width: 100px;  text-align:right"><button onclick="insertBuildingDetails(' + item.Id + ')">Insert</button></span></p><p>' + item.Address + '</p></div>');
  
          });
  
          $('#buildings').accordion('refresh');
  
      });
  }
})();

var buildings = [];
var buildingsSvcUri = '../../Content/msbuildings.json';

function insertBuildingDetails(index) {
    var building = buildings[index];
    var buildingDetails = '<div><h4><a href="' + building.DetailsUrl + '">' + building.Name + '</a> - ' + building.Area + '</h4><p>' + building.Address + '</p><a href="' + building.DirectionsUrl + '">Get Directions</a></div>'

    var item = Office.context.mailbox.item;
    item.body.setSelectedDataAsync(buildingDetails, { coercionType: Office.CoercionType.Html });

    if (item.itemType == Office.MailboxEnums.ItemType.Appointment) {
        item.location.setAsync("Microsoft Campus - " + building.Name);
    }
}
