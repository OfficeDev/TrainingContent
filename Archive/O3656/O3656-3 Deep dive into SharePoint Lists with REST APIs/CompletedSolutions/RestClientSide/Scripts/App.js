(function () {
  'use strict';

  /**
 * view model used for the page in binding with knockout.js
 */
  var viewModel = function () {
    var self = this;

    // collection of ceo's that will be displayed on the page
    self.chiefExecutives = ko.observableArray([]);
    // get all CEOs
    self.getAllChiefExecutives = getAllChiefExecutives;
    self.addThirdCeo = addThirdCeo;
    self.deleteFirstCeo = deleteFirstCeo;


    /* ********************************************************* */
    /* ********************************************************* */


    // get all CEO's from the list
    function getAllChiefExecutives() {
      // build query, sorted in ascending order of CEO
      var endpoint = _spPageContextInfo.webAbsoluteUrl +
        '/_api/web/lists/getbytitle(\'CEO List\')' +
        '/items' +
        '?$select=Title,TenureStartYear,TenureEndYear' + 
        '&$orderby=TenureStartYear';
      // create request headers
      var requestHeaders = {
        'Accept': 'application/json;odata=verbose'
      };

      // execute the request
      return jQuery.ajax({
        url: endpoint,
        type: 'GET',
        headers: requestHeaders
      }).done(function (response) {
        // clear the current results out
        self.chiefExecutives([]);
        // bind the returned results to the collection
        self.chiefExecutives(response.d.results);
      });

    };

    // add satya nadella to the company
    function addThirdCeo() {
      var jobs = [];

      /* update second CEO's tenure (the last one in the list) */

      // build update query
      var totalCeos = self.chiefExecutives().length;
      var endpoint = self.chiefExecutives()[totalCeos - 1].__metadata.uri;
      // build request headers
      var requestHeaders = {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'X-RequestDigest': jQuery("#__REQUESTDIGEST").val(),
        'X-Http-Method': 'MERGE',
        'If-Match': self.chiefExecutives()[totalCeos - 1].__metadata.etag
      };
      // build data object to send to service
      var firstCeoUpdateData = {
        __metadata:{type:'SP.Data.CEO_x0020_ListListItem'},
        TenureEndYear: '2014'
      };
      // add the ajax request to collection of promises to execute
      jobs.push(jQuery.ajax({
        url: endpoint,
        type: 'POST',
        headers: requestHeaders,
        data: JSON.stringify(firstCeoUpdateData),
        success: function (resonse) {
          alert('second ceo updated');
        },
        fail: function (error) {
          alert('error occurred updating second ceo: ' + error.message);
        }
      }));


      /* now create third ceo */

      // build create query
      var endpoint = _spPageContextInfo.webAbsoluteUrl +
        '/_api/web/lists/getbytitle(\'CEO List\')' +
        '/items';
      // build request headers
      var requestHeaders = {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
        'X-RequestDigest': jQuery("#__REQUESTDIGEST").val()
      };
      // build data object to send to service
      var thirdCeoUpdateData = {
        __metadata: { type: 'SP.Data.CEO_x0020_ListListItem' },
        Title: 'Satya Nadella',
        TenureStartYear: '2014',
        TenureEndYear: 'present'
      };
      // add the ajax request to collection of promises to execute
      jobs.push(jQuery.ajax({
        url: endpoint,
        type: 'POST',
        headers: requestHeaders,
        data: JSON.stringify(thirdCeoUpdateData),
        success: function (resonse) {
          alert('third ceo created');
        },
        fail: function (error) {
          alert('error occurred creating third ceo: ' + error.message);
        }
      }));


      // execute all jobs in order...
      Q.all(jobs)
        .then(function () {
          // when the jobs are complete, get all ceos again
          self.getAllChiefExecutives();
        });
    }

    // delete the dummy record
    function deleteFirstCeo() {
      var jobs = [];

      // build update query
      var endpoint = self.chiefExecutives()[0].__metadata.uri;
      // build request headers
      var requestHeaders = {
        'Accept': 'application/json;odata=verbose',
        'X-RequestDigest': jQuery("#__REQUESTDIGEST").val(),
        'If-Match': '*'
      };

      jobs.push(jQuery.ajax({
        url: endpoint,
        type: 'DELETE',
        headers: requestHeaders,
        success: function (resonse) {
          alert('first person deleted');
        },
        fail: function (error) {
          alert('error occurred deleting first person: ' + error.message);
        }
      }));

      // execute all jobs in order...
      Q.all(jobs)
        .then(function () {
          // when the jobs are complete, get all ceos again
          self.getAllChiefExecutives();
        });
    }
  }

  /**
   * attach view model to the page & enable all buttons
   */
  jQuery(document).ready(function () {
    // create & bind view model to the page
    ko.applyBindings(new viewModel());

    // enable all buttons now that the scripts have loaded & view model is bound
    jQuery('input[type="button"]').removeAttr('disabled');
  });
})();