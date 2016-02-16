   (function () {
      'use strict';

      angular.module('officeAddin')
             .service('officeService', ['$q', officeService]);

      /**
       * Custom Angular service that works with the host Office client.
       *
       * @returns {{getWordCandidatesFromEmail: getWordCandidatesFromEmail}}
       */
      function officeService($q) {
        // public signature of the service.
        return {
          getWordCandidatesFromEmail: getWordCandidatesFromEmail
        };

        /** *********************************************************** */

        /**
         * Retrieves a collection of all possible names in the currently selected email.
         *
         * @returns {Array<string>}   Collection of potential names.
         */
        function getWordCandidatesFromEmail() {
          var deferred = $q.defer();

          try {
            var currentEmail = Office.cast.item.toItemRead(Office.context.mailbox.item);

            // get list of all words in email that start with an upper case letter
            //  these are potential names of employees
            deferred.resolve(currentEmail.getRegExMatches().PossibleName);
          } catch (error) {
            deferred.reject(error);
          }

          return deferred.promise;
        }
      }

    })();